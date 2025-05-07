const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const validator = require("validator");
const auth = require("../middleware/auth");
const { sendRecoveryEmail } = require("../mailer");

const router = express.Router();

// Registro de usuario con validación
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar el correo electrónico
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Correo electrónico inválido" });
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
        
    }

    // Verificar si ya existe un usuario con el mismo correo
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Ya existe un usuario con este correo" });
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario con la contraseña hasheada
    const user = new User({ name, email, password: hashedPassword });

    // Guardar el usuario en la base de datos
    await user.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase(); 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Ruta para verificar el token
router.get("/verify", auth, (req, res) => {
  res.status(200).json({ message: "Token válido", user: req.user });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Correo electrónico inválido" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Generar token JWT con email y expiración de 15 minutos
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Enviar correo con el token
    await sendRecoveryEmail(email, token);

    res.status(200).json({ message: "Correo de recuperación enviado." });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ message: "Error al enviar el correo de recuperación." });
  }
});



module.exports = router;

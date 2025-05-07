const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Category = require("../models/Category");

// Crear una nueva categoría
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ error: "El nombre de la categoría es obligatorio" });
    }

    const category = new Category({
      name,
      user: req.user.id, // Asegúrate de que `auth` middleware añada `req.user`
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las categorías del usuario
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
    console.log(error);
  }
});

// Actualizar una categoría
router.put("/:id", auth, async (req, res) => {
  const { name } = req.body;

  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name },
      { new: true, runValidators: true }
    );

    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la categoría" });
    console.log(error);
  }
});

// Eliminar una categoría
router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });

    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la categoría" });
    console.log(error);
  }
});

module.exports = router;
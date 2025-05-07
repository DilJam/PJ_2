require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static("frontend"));

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((error) => console.error("Error conectando a MongoDB:", error));

// Rutas
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});
app.use("/auth", require("./routes/authRoutes"));
app.use("/expenses", require("./routes/expenseRoutes"));
app.use("/categories", require("./routes/categoryRoutes"));

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}/`)
);

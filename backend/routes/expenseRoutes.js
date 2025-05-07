const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

// Crear un gasto
router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;
    if (!title || !amount || !category) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const expense = new Expense({
      title,
      amount,
      date: date || Date.now(),
      category,
      user: req.user.id,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error al crear el gasto:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Obtener gastos del usuario autenticado
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).populate({
      path: "category", // Campo relacionado
      select: "name", // Solo traer el campo `name`
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error al obtener los gastos:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un gasto
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, amount, date, category } = req.body;

  if (!title || !amount || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, amount, date, category },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }

    res.json({ message: "Gasto actualizado correctamente", expense });
  } catch (error) {
    console.error("Error al actualizar el gasto:", error.message);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Eliminar un gasto
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }

    res.json({ message: "Gasto eliminado correctamente", expense });
  } catch (error) {
    console.error("Error al eliminar el gasto:", error.message);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
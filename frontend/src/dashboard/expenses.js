import { apiFetch } from "../utils/api.js";
import { getToken } from "../utils/auth.js";

const expenseForm = document.getElementById("expenseForm");
const expenseTitle = document.getElementById("expenseTitle");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");
const expenseId = document.getElementById("expenseId");
const saveButton = document.getElementById("saveExpense");
const updateButton = document.getElementById("updateExpense");
const expenseList = document.getElementById("expenseList");

// Función para cargar las categorías en el dropdown
async function loadCategories() {
  try {
    const token = getToken();
    const categories = await apiFetch("/categories", "GET", null, token);

    expenseCategory.innerHTML =
      '<option value="">Selecciona una categoría</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      expenseCategory.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las categorías:", error.message);
    alert("No se pudieron cargar las categorías.");
  }
}

// Función para cargar los gastos
async function loadExpenses() {
  try {
    const token = getToken();
    const expenses = await apiFetch("/expenses", "GET", null, token);

    expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${expense.title} - $${expense.amount} (${expense.category.name})</span>
        <div>
          <button class="edit" data-id="${expense._id}" data-title="${expense.title}" data-amount="${expense.amount}" data-category="${expense.category._id}" data-date="${expense.date}">Editar</button>
          <button class="delete" data-id="${expense._id}">Eliminar</button>
        </div>
      `;
      expenseList.appendChild(li);
    });

    attachEventListeners();
  } catch (error) {
    console.error("Error al cargar los gastos:", error.message);
    alert("No se pudieron cargar los gastos.");
  }
}

// Función para guardar un nuevo gasto
async function saveExpense() {
  const title = expenseTitle.value.trim();
  const amount = expenseAmount.value.trim();
  const category = expenseCategory.value;
  const date = expenseDate.value;

  if (!title || !amount || !category) {
    return alert("Todos los campos son obligatorios.");
  }

  try {
    const token = getToken();
    await apiFetch(
      "/expenses",
      "POST",
      { title, amount, category, date },
      token
    );
    alert("Gasto guardado correctamente.");
    resetForm();
    loadExpenses();
  } catch (error) {
    console.error("Error al guardar el gasto:", error.message);
    alert("No se pudo guardar el gasto.");
  }
}

// Función para actualizar un gasto
async function updateExpense() {
  const id = expenseId.value;
  const title = expenseTitle.value.trim();
  const amount = expenseAmount.value.trim();
  const category = expenseCategory.value;
  const date = expenseDate.value;

  if (!id || !title || !amount || !category) {
    return alert("Todos los campos son obligatorios.");
  }

  try {
    const token = getToken();
    await apiFetch(
      `/expenses/${id}`,
      "PUT",
      { title, amount, category, date },
      token
    );
    alert("Gasto actualizado correctamente.");
    resetForm();
    loadExpenses();
  } catch (error) {
    console.error("Error al actualizar el gasto:", error.message);
    alert("No se pudo actualizar el gasto.");
  }
}

// Función para manejar la edición
function handleEdit(event) {
  const button = event.target;
  expenseId.value = button.dataset.id;
  expenseTitle.value = button.dataset.title;
  expenseAmount.value = button.dataset.amount;
  expenseCategory.value = button.dataset.category;
  expenseDate.value = button.dataset.date.split("T")[0]; // Formato YYYY-MM-DD
  toggleButtons("edit");
}

// Función para eliminar un gasto
async function handleDelete(event) {
  const button = event.target;
  const id = button.dataset.id;

  if (!confirm("¿Estás seguro de que deseas eliminar este gasto?")) return;

  try {
    const token = getToken();
    await apiFetch(`/expenses/${id}`, "DELETE", null, token);
    alert("Gasto eliminado correctamente.");
    loadExpenses();
  } catch (error) {
    console.error("Error al eliminar el gasto:", error.message);
    alert("No se pudo eliminar el gasto.");
  }
}

// Función para alternar entre los botones
function toggleButtons(mode) {
  if (mode === "edit") {
    saveButton.style.display = "none";
    updateButton.style.display = "inline-block";
  } else {
    saveButton.style.display = "inline-block";
    updateButton.style.display = "none";
  }
}

// Función para resetear el formulario
function resetForm() {
  expenseForm.reset();
  expenseId.value = "";
  toggleButtons("save");
}

// Asignar eventos a botones
function attachEventListeners() {
  const editButtons = document.querySelectorAll(".edit");
  const deleteButtons = document.querySelectorAll(".delete");

  editButtons.forEach((button) => button.addEventListener("click", handleEdit));
  deleteButtons.forEach((button) =>
    button.addEventListener("click", handleDelete)
  );
}

// Eventos iniciales
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadExpenses();
});
saveButton.addEventListener("click", saveExpense);
updateButton.addEventListener("click", updateExpense);
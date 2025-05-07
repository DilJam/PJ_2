import { apiFetch } from "../utils/api.js";
import { getToken } from "../utils/auth.js";

const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryId = document.getElementById("categoryId");
const saveButton = document.getElementById("saveCategory");
const updateButton = document.getElementById("updateCategory");
const categoryList = document.getElementById("categoryList");

// Función para cargar las categorías
async function loadCategories() {
  try {
    const token = getToken();
    const categories = await apiFetch("/categories", "GET", null, token);

    // Limpiar el listado actual
    categoryList.innerHTML = "";

    // Renderizar cada categoría en la lista
    categories.forEach((category) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${category.name}</span>
        <div>
          <button class="edit" data-id="${category._id}" data-name="${category.name}">Editar</button>
        </div>
      `;
      categoryList.appendChild(li);
    });

    attachEventListeners();
  } catch (error) {
    console.error("Error al cargar categorías:", error.message);
    alert("No se pudieron cargar las categorías.");
  }
}

// Función para guardar una nueva categoría
async function saveCategory() {
  const name = categoryName.value.trim();
  if (!name) return alert("Por favor, escribe un nombre para la categoría.");

  try {
    const token = getToken();
    await apiFetch("/categories", "POST", { name }, token);
    alert("Categoría guardada correctamente.");
    resetForm();
    loadCategories();
  } catch (error) {
    console.error("Error al guardar la categoría:", error.message);
    alert("No se pudo guardar la categoría.");
  }
}

// Función para actualizar una categoría existente
async function updateCategory() {
  const id = categoryId.value;
  console.log(id);
  const name = categoryName.value.trim();
  if (!id || !name) return alert("Por favor, completa todos los campos.");

  try {
    const token = getToken();
    await apiFetch(`/categories/${id}`, "PUT", { name }, token);
    alert("Categoría actualizada correctamente.");
    resetForm();
    loadCategories();
  } catch (error) {
    console.error("Error al actualizar la categoría:", error.message);
    alert("No se pudo actualizar la categoría.");
  }
}

// Función para manejar el clic en el botón de editar
function handleEdit(event) {
  const button = event.target;
  const id = button.dataset.id;
  const name = button.dataset.name;

  categoryId.value = id; // Establecer el ID oculto
  categoryName.value = name; // Establecer el nombre en el campo de texto
  toggleButtons("edit"); // Mostrar el botón de actualizar y ocultar el de guardar
}

// Función para resetear el formulario
function resetForm() {
  categoryForm.reset();
  categoryId.value = "";
  toggleButtons("save"); // Mostrar el botón de guardar y ocultar el de actualizar
}

// Función para alternar entre los botones de guardar y actualizar
function toggleButtons(mode) {
  if (mode === "edit") {
    saveButton.style.display = "none";
    updateButton.style.display = "inline-block";
  } else {
    saveButton.style.display = "inline-block";
    updateButton.style.display = "none";
  }
}

// Función para asignar eventos a los botones de editar y eliminar
function attachEventListeners() {
  const editButtons = document.querySelectorAll(".edit");
  const deleteButtons = document.querySelectorAll(".delete");

  editButtons.forEach((button) => button.addEventListener("click", handleEdit));
  deleteButtons.forEach((button) =>
    button.addEventListener("click", handleDelete)
  );
}

// Eventos de los botones
saveButton.addEventListener("click", saveCategory);
updateButton.addEventListener("click", updateCategory);

// Cargar categorías al inicio
document.addEventListener("DOMContentLoaded", loadCategories);
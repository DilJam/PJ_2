import { apiFetch } from "../utils/api.js";
import { setToken } from "../utils/auth.js";

// Función para manejar el envío del formulario de inicio de sesión
async function handleLogin(event) {
  event.preventDefault(); // Evitar recargar la página

  // Obtener los valores de los campos y eliminar espacios en blanco
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    // Llamar a la API para iniciar sesión
    const response = await apiFetch("/auth/login", "POST", { email, password });

    // Almacenar el token en localStorage
    setToken(response.token);

    alert("Inicio de sesión exitoso. Redirigiendo a la página principal...");
    window.location.href = "expenses.html"; // Redirigir a la pantalla principal
  } catch (error) {
    alert(`Error al iniciar sesión: ${error.message}`);
    console.error("Error en el login:", error);
  }
}

// Agregar el evento al formulario
document.getElementById("loginForm").addEventListener("submit", handleLogin);

import { apiFetch } from "../utils/api.js";

// Función para manejar el envío del formulario de registro
async function handleRegister(event) {
  event.preventDefault(); // Evitar recargar la página

  // Obtener los valores de los campos
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
    // Llamar a la API para registrar al usuario
    const response = await apiFetch("/auth/register", "POST", {
      name,
      email,
      password,
    });

    alert("Registro exitoso. Redirigiendo a la página de inicio de sesión...");
    window.location.href = "login.html"; // Redirigir a la pantalla de inicio de sesión
  } catch (error) {
    alert(`Error en el registro: ${error.message}`);
    console.error("Error en el registro:", error);
  }
}

// Agregar el evento al formulario
document
  .getElementById("registerForm")
  .addEventListener("submit", handleRegister);
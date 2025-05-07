// Manejo del formulario de recuperación de contraseña
import { apiFetch } from "../utils/api.js";

const form = document.getElementById("forgotForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();

  try {
    const response = await apiFetch("/auth/forgot-password", "POST", { email });
    message.textContent = response.message;
    message.style.color = "green";
  } catch (error) {
    message.textContent = error.message || "Error al enviar el correo de recuperación";
    message.style.color = "red";
  }
});

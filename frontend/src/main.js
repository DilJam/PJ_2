import { getToken, clearToken } from "../src/utils/auth.js";
import { apiFetch } from "../src/utils/api.js";

// Función para cerrar sesión
function logout() {
  clearToken(); // Elimina el token del localStorage
  alert("Has cerrado sesión");
  window.location.href = "login.html"; // Redirige al login
}

// Vincular la función al botón de cierre de sesión
document.getElementById("logout").addEventListener("click", logout);

async function verifyToken() {
  const token = getToken();

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    await apiFetch("/auth/verify", "GET", null, token);
  } catch (error) {
    console.error("Token inválido o expirado:", error.message);
    clearToken();
    redirectToLogin();
  }
}

function redirectToLogin() {
  alert("Debes iniciar sesión para acceder al dashboard.");
  window.location.href = "login.html";
}

verifyToken();
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login-form");
  const regForm = document.querySelector("#register-form");
  const formTitle = document.querySelector("#form-title");

  // --- LOGIN ---
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const d = await res.json();
    document.querySelector("#msg").textContent = d.message;
    if (d.ok) window.location.href = "/dashboard";
  });

  // --- REGISTRO ---
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#rname").value;
    const email = document.querySelector("#remail").value;
    const password = document.querySelector("#rpassword").value;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const d = await res.json();
    document.querySelector("#msg-reg").textContent = d.message;

    if (d.ok) {
      // Si se registró bien → regresar al login
      regForm.classList.remove("active");
      loginForm.classList.add("active");
      formTitle.textContent = "Iniciar sesión";
    }
  });

  // --- TOGGLE ENTRE LOGIN Y REGISTRO ---
  document.querySelector("#show-register").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("active");
    regForm.classList.add("active");
    formTitle.textContent = "Registro";
  });

  document.querySelector("#show-login").addEventListener("click", (e) => {
    e.preventDefault();
    regForm.classList.remove("active");
    loginForm.classList.add("active");
    formTitle.textContent = "Iniciar sesión";
  });
});

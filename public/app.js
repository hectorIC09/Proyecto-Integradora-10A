/*// Espera a que todo el HTML esté cargado
document.addEventListener("DOMContentLoaded", () => {
  
  // --- LÓGICA DEL SERVICE WORKER (GLOBAL) ---
  // Esto se ejecuta en todas las páginas
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./serviceWorker.js") 
        .then((reg) => console.log("✅ Service Worker registrado:", reg.scope))
        .catch((err) => console.error("❌ Error al registrar Service Worker:", err));
    });
  }

  
  // --- LÓGICA DE LOGIN / REGISTRO ---
  // 🧠 Comprobamos si estamos en la página de login buscando los formularios
  const loginForm = document.querySelector("#login-form");
  const regForm = document.querySelector("#register-form");

  // Si loginForm existe, ejecutamos todo el código de login/registro
  if (loginForm && regForm) {
    const formTitle = document.querySelector("#form-title");
    console.log("Estoy en la página de Login.");

    // --- LOGIN ---
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      const msg = document.querySelector("#msg"); // Mensaje de error/éxito

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const d = await res.json();
        
        if (d.ok) {
          // Éxito: Redirigir al dashboard
          window.location.href = "/dashboard.html"; // Asegúrate que sea .html
        } else {
          msg.textContent = d.message || "Error: Revisa tus credenciales.";
        }
      } catch (err) {
        msg.textContent = "Error de conexión con el servidor.";
      }
    });

    // --- REGISTRO ---
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.querySelector("#rname").value;
      const email = document.querySelector("#remail").value;
      const password = document.querySelector("#rpassword").value;
      const msgReg = document.querySelector("#msg-reg"); // Mensaje de registro

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        const d = await res.json();
        
        if (d.ok) {
          // Éxito: regresar al login y mostrar mensaje
          regForm.classList.remove("active");
          loginForm.classList.add("active");
          formTitle.textContent = "Iniciar Sesión";
          document.querySelector("#msg").textContent = d.message || "¡Registro exitoso! Inicia sesión.";
        } else {
          msgReg.textContent = d.message || "Error al registrar la cuenta.";
        }
      } catch (err) {
        msgReg.textContent = "Error de conexión con el servidor.";
      }
    });

    // --- TOGGLE ENTRE LOGIN Y REGISTRO ---
    document.querySelector("#show-register").addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.remove("active");
      regForm.classList.add("active");
      formTitle.textContent = "Crear Cuenta"; // Título actualizado
    });

    document.querySelector("#show-login").addEventListener("click", (e) => {
      e.preventDefault();
      regForm.classList.remove("active");
      loginForm.classList.add("active");
      formTitle.textContent = "Iniciar Sesión"; // Título actualizado
    });
  } // <-- Fin del bloque "if (loginForm)"


  // --- LÓGICA DEL DASHBOARD ---
  // 🧠 Comprobamos si estamos en el dashboard buscando el botón de logout
  const btnLogout = document.getElementById('btn-logout');
  
  if (btnLogout) {
    console.log("Estoy en la página de Dashboard.");

    // 1. Función para cargar datos del usuario
    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const d = await res.json();
          if (d.ok) {
            document.querySelector("#welcome").textContent = `Bienvenido, ${d.user.name}`;
          }
        } else {
          // Si la API falla (no logueado), lo echamos al login
          window.location.href = "/login.html";
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
        window.location.href = "/login.html"; // Error de red, lo echamos
      }
    }

    // 2. Lógica del botón de Logout
    btnLogout.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/logout", { method: "POST" });
        const d = await res.json();
        if (d.ok) window.location.href = "/"; // Lo mandamos al index
      } catch (err) {
        console.error("Error al cerrar sesión:", err);
      }
    });

    // 3. Ejecutar la carga del usuario al entrar al dashboard
    loadUser();
  } // <-- Fin del bloque "if (btnLogout)"

}); // <-- Fin del DOMContentLoaded
*/
//-----------------------------------------------------------------------------------//


document.addEventListener("DOMContentLoaded", () => {
  
  // --- SERVICE WORKER ---
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./serviceWorker.js")
        .catch(err => console.error("Error SW:", err));
    });
  }

  // --- LÓGICA DE LOGIN / REGISTRO ---
  const loginForm = document.querySelector("#login-form");
  const regForm = document.querySelector("#register-form");

  if (loginForm && regForm) {
    const formTitle = document.querySelector("#form-title");
    
    // Login
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      const msg = document.querySelector("#msg"); 

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const d = await res.json();
        if (d.ok) window.location.href = "/dashboard.html"; 
        else msg.textContent = d.message || "Error de credenciales";
      } catch (err) { msg.textContent = "Error de conexión"; }
    });

    // Registro
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.querySelector("#rname").value;
      const email = document.querySelector("#remail").value;
      const password = document.querySelector("#rpassword").value;
      const msgReg = document.querySelector("#msg-reg");

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        const d = await res.json();
        if (d.ok) {
          regForm.classList.remove("active");
          loginForm.classList.add("active");
          formTitle.textContent = "Iniciar Sesión";
          alert("Registro exitoso. Inicia sesión.");
        } else msgReg.textContent = d.message || "Error al registrar";
      } catch (err) { msgReg.textContent = "Error de conexión"; }
    });

    // Toggle Forms
    document.querySelector("#show-register").addEventListener("click", (e) => {
      e.preventDefault(); loginForm.classList.remove("active"); regForm.classList.add("active"); formTitle.textContent = "Crear Cuenta";
    });
    document.querySelector("#show-login").addEventListener("click", (e) => {
      e.preventDefault(); regForm.classList.remove("active"); loginForm.classList.add("active"); formTitle.textContent = "Iniciar Sesión";
    });
  }

  // --- LÓGICA DEL DASHBOARD ---
  const btnLogout = document.getElementById('btn-logout');
  
  if (btnLogout) {
    // 1. Cargar Usuario y Logout
    fetch("/api/me").then(res => res.json()).then(d => {
      if(d.ok) document.querySelector("#welcome").textContent = `Bienvenido, ${d.user.name}`;
      else window.location.href = "/login.html";
    }).catch(() => window.location.href = "/login.html");

    btnLogout.addEventListener("click", async () => {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/";
    });

    // --- LÓGICA DEL MAPA Y PANELES ---
    let mapa = null;
    const marcadores = {};

    // Iconos
    const iconDefault = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    const iconAlert = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
      className: 'marker-alert'
    });

    function iniciarMapa() {
      const mapDiv = document.getElementById('map');
      if (!mapDiv) return;
      
      mapa = L.map('map').setView([19.3240, -99.1795], 16); 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapa);

      // ✨ ARREGLO IMPORTANTE: Recalcular tamaño tras carga
      setTimeout(() => { mapa.invalidateSize(); }, 200);
    }

    async function cargarDatos() {
      try {
        const res = await fetch('/api/alumnos');
        const alumnos = await res.json();
        if(!alumnos.length) return;

        const listaAlertas = document.getElementById('alertas-lista');
        const listaAlumnos = document.getElementById('alumnos-lista');
        
        listaAlertas.innerHTML = '';
        listaAlumnos.innerHTML = '';
        let hayAlertas = false;

        alumnos.forEach(a => {
          // Actualizar Mapa (Simulación de movimiento)
          const lat = parseFloat(a.lat_actual) + (Math.random() - 0.5) * 0.0002;
          const lng = parseFloat(a.lng_actual) + (Math.random() - 0.5) * 0.0002;
          
          const icono = a.en_alerta ? iconAlert : iconDefault;
          const popupClass = a.en_alerta ? 'popup-alert' : '';
          const popupContent = `<span class="popup-title">${a.nombre}</span>${a.matricula}`;

          if (marcadores[a.id]) {
            marcadores[a.id].setLatLng([lat, lng]);
            marcadores[a.id].setIcon(icono);
            // Actualizar popup si cambia estado (opcional)
          } else {
            marcadores[a.id] = L.marker([lat, lng], {icon: icono}).addTo(mapa)
              .bindPopup(popupContent, {className: popupClass});
          }

          // Llenar Paneles
          const btnHTML = a.en_alerta 
            ? `<button class="btn-safe" onclick="cambiarAlerta(${a.id}, false)">Marcar Seguro</button>`
            : `<button class="btn-alert" onclick="cambiarAlerta(${a.id}, true)">Simular Alerta</button>`;

          // Lista Gestión
          listaAlumnos.innerHTML += `
            <div class="student-list-item">
              <div><strong>${a.nombre}</strong> <br><small>${a.matricula}</small></div>
              ${btnHTML}
            </div>`;

          // Lista Alertas
          if(a.en_alerta) {
            hayAlertas = true;
            listaAlertas.innerHTML += `
              <div class="alert-list-item">
                <div><strong>${a.nombre}</strong></div>
                <button class="btn-safe" onclick="cambiarAlerta(${a.id}, false)">Atendido</button>
              </div>`;
          }
        });

        if(!hayAlertas) listaAlertas.innerHTML = '<p style="color:#888">Sin alertas activas.</p>';

      } catch (err) { console.error("Error actualizando:", err); }
    }

    // Función global para los botones
    window.cambiarAlerta = async (id, estado) => {
      await fetch(`/api/alumnos/alerta/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ en_alerta: estado })
      });
      cargarDatos(); // Refrescar inmediato
    };

    // Iniciar
    iniciarMapa();
    cargarDatos();
    setInterval(cargarDatos, 3000); // Loop cada 3s
  }
});
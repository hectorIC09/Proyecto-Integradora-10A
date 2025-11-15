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


// Espera a que todo el HTML esté cargado
document.addEventListener("DOMContentLoaded", () => {
  
  // --- LÓGICA DEL SERVICE WORKER (GLOBAL) ---
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./serviceWorker.js") 
        .then((reg) => console.log("✅ Service Worker registrado:", reg.scope))
        .catch((err) => console.error("❌ Error al registrar Service Worker:", err));
    });
  }

  
  // --- LÓGICA DE LOGIN / REGISTRO ---
  const loginForm = document.querySelector("#login-form");
  const regForm = document.querySelector("#register-form");

  if (loginForm && regForm) {
    const formTitle = document.querySelector("#form-title");
    console.log("Estoy en la página de Login.");

    // --- LOGIN ---
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
        
        if (d.ok) {
          window.location.href = "/dashboard.html"; 
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
      formTitle.textContent = "Crear Cuenta";
    });

    document.querySelector("#show-login").addEventListener("click", (e) => {
      e.preventDefault();
      regForm.classList.remove("active");
      loginForm.classList.add("active");
      formTitle.textContent = "Iniciar Sesión";
    });
  } 


  // --- LÓGICA DEL DASHBOARD ---
  const isDashboard = document.body.classList.contains('dashboard-page');
  
  if (isDashboard) {
    console.log("Estoy en la página de Dashboard.");

    // --- Lógica de Usuario ---
    const btnLogout = document.getElementById('btn-logout');

    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const d = await res.json();
          if (d.ok) {
            document.querySelector("#welcome").textContent = `Bienvenido, ${d.user.name}`;
          }
        } else {
          window.location.href = "/login.html";
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
        window.location.href = "/login.html";
      }
    }

    if (btnLogout) {
      btnLogout.addEventListener("click", async () => {
        try {
          const res = await fetch("/api/logout", { method: "POST" });
          const d = await res.json();
          if (d.ok) window.location.href = "/";
        } catch (err) {
          console.error("Error al cerrar sesión:", err);
        }
      });
    }

    loadUser();


    // -----------------------------
    //     ***** MAPBOX *****
    // -----------------------------
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGVjdG9yaWMwOSIsImEiOiJjbWkwaW5kM20wdm90MmtvcWVzNzRqODM5In0.iJMjm-vk0gHrO297w6F1Hg';

    let map = null;
    const marcadores = {};

    function iniciarMapa() {
      const mapDiv = document.getElementById("map");
      if (!mapDiv) return;

      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-100.4583, 25.6732], // Santa Catarina
        zoom: 14
      });

      map.addControl(new mapboxgl.NavigationControl());
    }


    // -----------------------------
    //  Cargar Datos y Pintar Marcadores
    // -----------------------------
    async function actualizarDatos() {
      try {
        const res = await fetch('/api/alumnos');
        const alumnos = await res.json();

        const listaAlertas = document.getElementById('alertas-lista');
        const listaAlumnos = document.getElementById('alumnos-lista');
        const msgNoAlertas = document.getElementById('no-alertas-msg');

        listaAlertas.innerHTML = "";
        listaAlumnos.innerHTML = "";
        let hayAlertas = false;

        alumnos.forEach(alumno => {

          const {
            id,
            nombre,
            matricula,
            lat_actual,
            lng_actual,
            en_alerta,
            lat_inicial,
            lng_inicial
          } = alumno;

          // --- PANEL ALERTAS ---
          if (en_alerta) {
            hayAlertas = true;
            const item = document.createElement("div");
            item.className = "alert-list-item";
            item.innerHTML = `
              <div>
                <strong>${nombre}</strong>
                <br><small>${matricula}</small>
              </div>
              <button class="btn btn-safe" data-id="${id}">Marcar Seguro</button>
            `;
            listaAlertas.appendChild(item);
          }

          // --- PANEL ALUMNOS ---
          const itemAlumno = document.createElement("div");
          itemAlumno.className = "student-list-item";
          itemAlumno.innerHTML = `
            <div>
              <strong>${nombre}</strong>
              <br><small>${matricula}</small>
            </div>
            ${
              en_alerta
              ? `<button class="btn btn-safe" data-id="${id}">Marcar Seguro</button>`
              : `<button class="btn btn-alert" data-id="${id}">Simular Alerta</button>`
            }
          `;
          listaAlumnos.appendChild(itemAlumno);


          // ========= MAPBOX MARCADORES =========

          if (!map) return;

          const lat = parseFloat(lat_actual || lat_inicial);
          const lng = parseFloat(lng_actual || lng_inicial);

          // Si ya existe → moverlo
          if (marcadores[id]) {
            marcadores[id].setLngLat([lng, lat]);
          } else {
            // Crear DIV para el marcador
            const el = document.createElement("div");
            el.className = en_alerta ? "marker-alert" : "marker-normal";
            el.style.width = "22px";
            el.style.height = "22px";
            el.style.borderRadius = "50%";
            el.style.background = en_alerta ? "#ff4d4d" : "#3fa7ff";
            el.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

            const marker = new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(
                new mapboxgl.Popup().setHTML(`
                  <strong>${nombre}</strong><br>
                  Matrícula: ${matricula}<br>
                  ${en_alerta ? "<span style='color:#ff4d4d;font-weight:bold'>⚠ ALERTA</span>" : ""}
                `)
              )
              .addTo(map);

            marcadores[id] = marker;
          }
        });

        if (!hayAlertas) {
          msgNoAlertas.textContent = "No hay alertas activas.";
          listaAlertas.appendChild(msgNoAlertas);
        }

      } catch (err) {
        console.error("Error:", err);
      }
    }


    // --- CLICK EN PANEL ---
    async function manejarClicPaneles(e) {
      const target = e.target;
      const id = target.dataset.id;

      if (!id) return;

      const nuevoEstado = target.classList.contains("btn-alert");

      await fetch(`/api/alumnos/alerta/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ en_alerta: nuevoEstado })
      });

      actualizarDatos();
    }


    // ---- INICIO ----
    iniciarMapa();
    actualizarDatos();
    setInterval(actualizarDatos, 3000);

    const panelWrapper = document.querySelector(".panels-wrapper");
    if (panelWrapper) {
      panelWrapper.addEventListener("click", manejarClicPaneles);
    }

  } // fin dashboard

}); // fin DOMContentLoaded

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
  } // <-- Fin del bloque "if (loginForm)"


  // --- LÓGICA DEL DASHBOARD ---
  // 🧠 Comprobamos si estamos en el dashboard buscando la clase del body
  const isDashboard = document.body.classList.contains('dashboard-page');
  
  if (isDashboard) {
    console.log("Estoy en la página de Dashboard.");

    // --- Lógica de Usuario (Tu código original) ---
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
          // Si la API falla (no logueado), lo echamos al login
          window.location.href = "/login.html";
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
        window.location.href = "/login.html"; // Error de red, lo echamos
      }
    }

    // 2. Lógica del botón de Logout
    if (btnLogout) {
      btnLogout.addEventListener("click", async () => {
        try {
          const res = await fetch("/api/logout", { method: "POST" });
          const d = await res.json();
          if (d.ok) window.location.href = "/"; // Lo mandamos al index
        } catch (err) {
          console.error("Error al cerrar sesión:", err);
        }
      });
    }

    // 3. Ejecutar la carga del usuario al entrar al dashboard
    loadUser();

    // --- LÓGICA NUEVA DEL MAPA Y PANELES ---

    let mapa = null;
    const marcadores = {}; // Objeto para guardar los marcadores

    // --- Definir Iconos ---
    const iconDefault = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    const iconAlert = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
      className: 'marker-alert' // Clase CSS definida en styles.css
    });

    // 1. Iniciar el Mapa
    function iniciarMapa() {
      // Verificar si el div del mapa existe
      const mapDiv = document.getElementById('map');
      if (!mapDiv) {
        console.log("No se encontró el div #map. Saliendo de iniciarMapa().");
        return;
      }
      
      mapa = L.map('map').setView([19.3240, -99.1795], 16); // Coordenadas de ejemplo
      
      // ============= CAMBIO AQUÍ =============
      // Usamos un mapa oscuro que va con tu tema
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapa);
      // =======================================

      // ✨ ARREGLO MAPA ✨
      // ============= CAMBIO AQUÍ =============
      // Aumentamos el tiempo a 250ms para asegurar que el CSS cargue
      setTimeout(() => {
        if (mapa) {
          mapa.invalidateSize();
          console.log("Mapa recalculado.");
        }
      }, 250); // <-- 250 milisegundos
      // =======================================
    }

    // 2. Cargar Paneles (Alertas y Alumnos) y Marcadores
    async function actualizarDatos() {
      try {
        const res = await fetch('/api/alumnos'); // Llama a la API del backend
        if (!res.ok) throw new Error('Respuesta de API no fue OK');
        const alumnos = await res.json();

        const listaAlertas = document.getElementById('alertas-lista');
        const listaAlumnos = document.getElementById('alumnos-lista');
        const msgNoAlertas = document.getElementById('no-alertas-msg');

        listaAlertas.innerHTML = ''; // Limpiar
        listaAlumnos.innerHTML = ''; // Limpiar
        let hayAlertas = false;
        
        // Si no hay alumnos, mostrar mensaje y salir
        if (!alumnos.length) {
            listaAlumnos.innerHTML = '<p>No hay alumnos registrados.</p>';
            if (msgNoAlertas) listaAlertas.appendChild(msgNoAlertas);
            return;
        }

        alumnos.forEach(alumno => {
          const { id, nombre, matricula, lat_actual, lng_actual, en_alerta, lat_inicial, lng_inicial } = alumno;

          // --- Panel de Alertas ---
          if (alumno.en_alerta) {
            hayAlertas = true;
            const item = document.createElement('div');
            item.className = 'alert-list-item'; // Estilo de styles.css
            item.innerHTML = `
              <div>
                <strong>${alumno.nombre}</strong>
                <br><small>${alumno.matricula}</small>
              </div>
              <button class="btn btn-safe" data-id="${alumno.id}">Marcar Seguro</button>
            `;
            listaAlertas.appendChild(item);
          }

          // --- Panel de Gestión de Alumnos ---
          const itemAlumno = document.createElement('div');
          itemAlumno.className = 'student-list-item'; // Estilo de styles.css
          itemAlumno.innerHTML = `
            <div>
              <strong>${alumno.nombre}</strong>
              <br><small>${alumno.matricula}</small>
            </div>
            ${alumno.en_alerta
              ? `<button class="btn btn-safe" data-id="${alumno.id}">Marcar Seguro</button>`
              : `<button class="btn btn-alert" data-id="${alumno.id}">Simular Alerta</button>`
            }
          `;
          listaAlumnos.appendChild(itemAlumno);
          
          // --- Actualizar Marcadores en Mapa ---
          if(mapa) { // Solo si el mapa se inició
            // Usamos lat_actual o la inicial si es nula
            const latBase = parseFloat(lat_actual || lat_inicial);
            const lngBase = parseFloat(lng_actual || lng_inicial);
            
            let latSim, lngSim;

            // Simular movimiento (para que parezca "en vivo")
            if (marcadores[id] && marcadores[id].currentLat) {
              // Si ya existe, simular desde su última pos
              latSim = parseFloat(marcadores[id].currentLat) + (Math.random() - 0.5) * 0.0002;
              lngSim = parseFloat(marcadores[id].currentLng) + (Math.random() - 0.5) * 0.0002;
            } else {
              // Si es nuevo, usar la pos base
              latSim = latBase;
              lngSim = lngBase;
            }
  
            const icono = en_alerta ? iconAlert : iconDefault;
            const popupClase = en_alerta ? 'popup-alert' : '';
            const popupContenido = `
              <div class="popup-title">${nombre}</div>
              <div class="popup-body">Matrícula: ${matricula}</div>
              ${en_alerta ? '<div class="popup-body" style="color:#F87171; font-weight:bold;">¡NECESITA AYUDA!</div>' : ''}
            `;
  
            if (marcadores[id]) {
              // Si el marcador existe, moverlo y actualizarlo
              marcadores[id].setLatLng([latSim, lngSim]);
              marcadores[id].setIcon(icono);
              marcadores[id].setPopupContent(popupContenido);
              if (marcadores[id].getPopup()) {
                marcadores[id].getPopup().options.className = popupClase;
              }
              // Guardar la nueva pos simulada
              marcadores[id].currentLat = latSim;
              marcadores[id].currentLng = lngSim;
            } else {
              // Si no existe, crearlo
              marcadores[id] = L.marker([latSim, lngSim], { icon: icono })
                .addTo(mapa)
                .bindPopup(popupContenido, { className: popupClase });
              // Guardar la pos base
              marcadores[id].currentLat = latSim;
              marcadores[id].currentLng = lngSim;
            }
          }

        });

        if (!hayAlertas && msgNoAlertas) {
          // Re-seleccionar msgNoAlertas en caso de que se haya borrado
          const msg = document.getElementById('no-alertas-msg') || document.createElement('p');
          msg.id = 'no-alertas-msg';
          msg.textContent = "No hay alertas activas.";
          listaAlertas.appendChild(msg);
        }

      } catch (err) {
        console.error("Error al actualizar datos:", err);
      }
    }

    // 4. Manejador de Clics para botones de Alerta
    async function manejarClicPaneles(e) {
      const target = e.target;
      const id = target.dataset.id;
      
      // Si no es un botón con data-id, ignorar
      if (!id || !(target.classList.contains('btn-alert') || target.classList.contains('btn-safe'))) return;

      let nuevoEstado;
      if (target.classList.contains('btn-alert')) {
        nuevoEstado = true; // Botón "Simular Alerta"
      } else if (target.classList.contains('btn-safe')) {
        nuevoEstado = false; // Botón "Marcar Seguro"
      } else {
        return;
      }

      try {
        const res = await fetch(`/api/alumnos/alerta/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ en_alerta: nuevoEstado })
        });
        if (!res.ok) throw new Error('No se pudo actualizar la alerta');
        
        actualizarDatos(); // Refrescar todo inmediatamente

      } catch (err) {
        console.error("Error al cambiar alerta:", err);
      }
    }

    // 5. Iniciar todo
    iniciarMapa();
    actualizarDatos();
    
    // Iniciar loops de actualización
    setInterval(actualizarDatos, 3000); // Actualizar todo (mapa y paneles) cada 3 seg

    // Agregar el listener de clics al contenedor de paneles
    const panelWrapper = document.querySelector('.panels-wrapper');
    if (panelWrapper) {
      panelWrapper.addEventListener('click', manejarClicPaneles);
    }

  } // <-- Fin del bloque "if (isDashboard)"

}); // <-- Fin del DOMContentLoaded
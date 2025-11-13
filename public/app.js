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
  // (Tu código existente - sin cambios)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./serviceWorker.js") 
        .then((reg) => console.log("✅ Service Worker registrado:", reg.scope))
        .catch((err) => console.error("❌ Error al registrar Service Worker:", err));
    });
  }

  
  // --- LÓGICA DE LOGIN / REGISTRO ---
  // (Tu código existente - sin cambios)
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
  // (Tu código existente - MODIFICADO)
  const btnLogout = document.getElementById('btn-logout');
  
  if (btnLogout) {
    console.log("Estoy en la página de Dashboard.");

    // --- INICIO DE CÓDIGO NUEVO (MAPA Y PANELES) ---

    // Variables globales para el mapa
    let mapa = null;
    const marcadores = {}; // Objeto para guardar los marcadores de Leaflet

    // Definir íconos de Leaflet
    const iconBlue = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    const iconRed = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
      className: 'marker-alert' // Esta clase está en styles.css
    });

    /**
     * Función 1: Iniciar el Mapa
     */
    function iniciarMapa() {
      const mapDiv = document.getElementById('map');
      if (!mapDiv) {
        console.error("El div #map no se encuentra en dashboard.html");
        return;
      }
      
      const centroMapa = [19.3240, -99.1795]; // Coordenadas de prueba
      mapa = L.map('map').setView(centroMapa, 16); 

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapa);
    }

    /**
     * Función 2: Cargar Paneles (Alertas y Gestión) y Actualizar Mapa
     * Esta es la función principal del bucle.
     */
    async function cargarPanelesYMapa() {
      const alertasLista = document.getElementById('alertas-lista');
      const alumnosLista = document.getElementById('alumnos-lista');
      const noAlertasMsg = document.getElementById('no-alertas-msg');

      if (!alertasLista || !alumnosLista) return; 

      try {
        // Pedir TODOS los alumnos a la API
        const res = await fetch('/api/alumnos');
        if (!res.ok) throw new Error('Error al cargar alumnos');
        const alumnos = await res.json();

        // Limpiar listas
        alertasLista.innerHTML = '';
        alumnosLista.innerHTML = '';
        let hayAlertas = false;

        // --- A. Actualizar Marcadores en el Mapa ---
        actualizarMarcadores(alumnos);

        // --- B. Llenar Paneles ---
        alumnos.forEach(a => {
          // Panel de Alumnos (Gestión)
          const itemAlumno = document.createElement('div');
          itemAlumno.className = 'student-list-item';
          itemAlumno.innerHTML = `
            <div>
              <strong>${a.nombre}</strong>
              <br><small>${a.matricula}</small>
            </div>
            ${a.en_alerta
              ? `<button class="btn btn-safe" onclick="cambiarAlerta(${a.id}, false)">Marcar Seguro</button>`
              : `<button class="btn btn-alert" onclick="cambiarAlerta(${a.id}, true)">Simular Alerta</button>`
            }
          `;
          alumnosLista.appendChild(itemAlumno);

          // Panel de Alertas Activas
          if (a.en_alerta) {
            hayAlertas = true;
            const itemAlerta = document.createElement('div');
            itemAlerta.className = 'alert-list-item';
            itemAlerta.innerHTML = `
              <div>
                <strong>${a.nombre}</strong>
                <br><small>${a.matricula}</small>
              </div>
              <button class="btn btn-safe" onclick="cambiarAlerta(${a.id}, false)">Marcar Seguro</button>
            `;
            alertasLista.appendChild(itemAlerta);
          }
        });

        // Mostrar mensaje si no hay alertas
        if (!hayAlertas) {
          noAlertasMsg.style.display = 'block';
          alertasLista.appendChild(noAlertasMsg);
        } else {
          noAlertasMsg.style.display = 'none';
        }

      } catch (err) {
        console.error("Error cargando paneles:", err);
        alertasLista.innerHTML = '<p>Error al cargar datos.</p>';
        alumnosLista.innerHTML = '<p>Error al cargar datos.</p>';
      }
    }
    
    /**
     * Función 3: Actualizar Marcadores en el Mapa
     */
    function actualizarMarcadores(alumnos) {
      if (!mapa) return; // Salir si el mapa no está listo

      alumnos.forEach(a => {
        // Usar lat_actual o la inicial si no existe
        const lat = parseFloat(a.lat_actual || a.lat_inicial);
        const lng = parseFloat(a.lng_actual || a.lng_inicial);
        const icono = a.en_alerta ? iconRed : iconBlue;
        
        const popupContent = `
          <div class="popup-title">${a.nombre}</div>
          <div class="popup-body">Matrícula: ${a.matricula}</div>
          ${a.en_alerta ? '<div class="popup-body" style="color:red; font-weight:bold;">¡NECESITA AYUDA!</div>' : ''}
        `;
        const popupOptions = { className: a.en_alerta ? 'popup-alert' : '' };

        // SIMULACIÓN DE MOVIMIENTO
        let simLat = lat, simLng = lng;
        if (marcadores[a.id]) {
          // Si el marcador ya existe, calculamos una nueva pos simulada
          [simLat, simLng] = simularMovimiento(marcadores[a.id].currentLat, marcadores[a.id].currentLng);
        }

        if (marcadores[a.id]) {
          // Marcador existe: moverlo (simulado) y actualizar ícono/popup
          marcadores[a.id].setLatLng([simLat, simLng]);
          marcadores[a.id].setIcon(icono);
          marcadores[a.id].setPopupContent(popupContent, popupOptions);
          marcadores[a.id].currentLat = simLat;
          marcadores[a.id].currentLng = simLng;
        } else {
          // Marcador NUEVO: crearlo en la pos original
          const m = L.marker([lat, lng], { icon: icono }).addTo(mapa)
            .bindPopup(popupContent, popupOptions);
          marcadores[a.id] = m;
          marcadores[a.id].currentLat = lat; // Guardar lat/lng actual
          marcadores[a.id].currentLng = lng;
        }
      });
    }

    /**
     * Función 4: Simular Movimiento Pequeño
     */
    function simularMovimiento(lat, lng) {
      const factorMovimiento = 0.0001; // Ajusta esto para más/menos movimiento
      const latChange = (Math.random() - 0.5) * factorMovimiento;
      const lngChange = (Math.random() - 0.5) * factorMovimiento;
      return [lat + latChange, lng + lngChange];
    }

    /**
     * Función 5: Cambiar Alerta (API)
     * La ponemos en 'window' para que los botones 'onclick' la encuentren
     */
    window.cambiarAlerta = async (id, estado) => {
      console.log(`Cambiando alerta para ID ${id} a ${estado}`);
      try {
        const res = await fetch(`/api/alumnos/alerta/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ en_alerta: estado })
        });

        if (res.ok) {
          // Refrescar paneles y mapa INMEDIATAMENTE
          cargarPanelesYMapa(); 
        } else {
          alert('Error al actualizar la alerta.');
        }
      } catch (err) {
        console.error("Error en cambiarAlerta:", err);
        alert('Error de conexión al cambiar alerta.');
      }
    };
    
    // --- FIN DE CÓDIGO NUEVO ---


    // --- LÓGICA EXISTENTE DEL DASHBOARD (del usuario) ---

    // 1. Función para cargar datos del usuario (tu código)
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

    // 2. Lógica del botón de Logout (tu código)
    btnLogout.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/logout", { method: "POST" });
        const d = await res.json();
        if (d.ok) window.location.href = "/"; 
      } catch (err) {
        console.error("Error al cerrar sesión:", err);
      }
    });

    // 3. Ejecutar la carga del usuario (tu código)
    loadUser();

    // --- INICIO DE CÓDIGO NUEVO (INICIALIZACIÓN) ---
    
    // 4. Iniciar el mapa y cargar los paneles por primera vez
    iniciarMapa();
    cargarPanelesYMapa();

    // 5. Iniciar el bucle de actualización
    // (3000ms = 3 segundos)
    // Llama a la función principal repetidamente
    setInterval(cargarPanelesYMapa, 3000); 

  } // <-- Fin del bloque "if (btnLogout)"

}); // <-- Fin del DOMContentLoaded
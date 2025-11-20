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

// 1. Configuración de Mapbox (Token público)
// REEMPLAZA CON TU TOKEN SI ES DIFERENTE
mapboxgl.accessToken = 'pk.eyJ1IjoiaGVjdG9yaWMwOSIsImEiOiJjbWkwaW5kM20wdm90MmtvcWVzNzRqODM5In0.iJMjm-pk.eyJ1IjoiaGVjdG9yaWMwOSIsImEiOiJjbWkwaW5kM20wdm90MmtvcWVzNzRqODM5In0.iJMjm-vk0gHrO297w6F1Hg';

document.addEventListener("DOMContentLoaded", () => {

  // ===================================================================
  //                 (1) SERVICE WORKER (GLOBAL)
  // ===================================================================
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./serviceWorker.js")
        .then((reg) => console.log("✅ Service Worker registrado:", reg.scope))
        .catch((err) => console.error("❌ Error al registrar Service Worker:", err));
    });
  }

  // ===================================================================
  //                 (2) LÓGICA DE LOGIN / REGISTRO
  // ===================================================================
  // Esta sección se ejecuta solo si existen los formularios de login
  const loginForm = document.querySelector("#login-form");
  const regForm = document.querySelector("#register-form");
  const alumnoForm = document.getElementById("alumno-form");
  const btnSoyAlumno = document.getElementById("soy-alumno-btn");

  // --- MODO ALUMNO (LOGIN POR MATRÍCULA) ---
  if (btnSoyAlumno && loginForm && alumnoForm) {
    btnSoyAlumno.addEventListener("click", () => {
      loginForm.classList.remove("active");
      regForm?.classList.remove("active");
      alumnoForm.classList.add("active");
      document.getElementById("form-title").textContent = "Acceso Alumno";
    });

    alumnoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const matricula = document.getElementById("matricula-alumno").value.trim();
      const msgAlumno = document.getElementById("msg-alumno");

      try {
        const res = await fetch("/api/alumnos/login", {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ matricula })
        });
        const d = await res.json();

        if (!res.ok || !d.ok) {
          msgAlumno.textContent = d.msg || "Matrícula no encontrada.";
          return;
        }

        // Guardar sesión alumno y redirigir
        localStorage.setItem("alumno_data", JSON.stringify(d.alumno));
        window.location.href = "/dashboard-alumno.html";

      } catch (err) {
        msgAlumno.textContent = "Error de conexión.";
        console.error(err);
      }
    });
  }

  // --- LOGIN / REGISTRO ADMIN ---
  if (loginForm && regForm) {
    const formTitle = document.querySelector("#form-title");
    console.log("Modo Login detectado");

    // Login Submit
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
          msg.textContent = d.message || "Credenciales incorrectas.";
        }
      } catch (err) {
        msg.textContent = "Error de servidor.";
      }
    });

    // Registro Submit
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
          document.querySelector("#msg").textContent = "Registro exitoso. Ingresa ahora.";
        } else {
          msgReg.textContent = d.message || "Error al registrar.";
        }
      } catch (err) {
        msgReg.textContent = "Error de conexión.";
      }
    });

    // Toggles
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

  // ===================================================================
  //                 (3) LÓGICA DEL DASHBOARD (ADMIN)
  // ===================================================================
  // Solo se ejecuta si el body tiene la clase 'dashboard-page'
  const isDashboard = document.body.classList.contains('dashboard-page');

  if (isDashboard) {
    console.log("Modo Dashboard Admin activado");

    // --- REFERENCIAS DASHBOARD ---
    const btnLogout = document.getElementById("btn-logout");
    const navAlumnos = document.getElementById("nav-alumnos");
    const navMapa = document.getElementById("nav-mapa");
    const navInicio = document.getElementById("nav-inicio");
    
    const viewAlumnos = document.getElementById("view-alumnos");
    const viewMapa = document.getElementById("view-mapa");
    
    const alumnosTableBody = document.getElementById("alumnosTableBody");

    // Modal Invitación
    const modal = document.getElementById("invitarModal");
    const btnInvitar = document.getElementById("btnInvitar");
    const spanClose = document.getElementsByClassName("close")[0];
    const invitarForm = document.getElementById("invitarForm");
    const formStatus = document.getElementById("formStatus");
    const btnEnviarInvitacion = document.getElementById("btnEnviarInvitacion");

    // Variables Mapa
    let map;
    let markers = []; // Array para guardar referencias a los marcadores y poder borrarlos

    // --- 1. VERIFICAR SESIÓN Y CARGAR USUARIO ---
    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const d = await res.json();
          if (d.ok) {
            // Si hay un elemento para mostrar el nombre, lo actualizamos
            const welcomeMsg = document.querySelector("#welcome");
            if(welcomeMsg) welcomeMsg.textContent = `Bienvenido, ${d.user.name}`;
          }
        } else {
          window.location.href = "/login.html";
        }
      } catch (err) {
        window.location.href = "/login.html";
      }
    }
    loadUser();

    // --- 2. LOGOUT ---
    if (btnLogout) {
        btnLogout.addEventListener("click", async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/index.html"; // O login.html
        });
    }

    // --- 3. NAVEGACIÓN ENTRE VISTAS ---
    function mostrarVista(vista) {
        if(viewAlumnos) viewAlumnos.style.display = "none";
        if(viewMapa) viewMapa.style.display = "none";
        
        if(vista === 'alumnos' && viewAlumnos) {
            viewAlumnos.style.display = "block";
            cargarAlumnos(); // Recargar datos al volver a la vista
        }
        
        if(vista === 'mapa' && viewMapa) {
            viewMapa.style.display = "block";
            // Pequeño timeout para que el mapa detecte el tamaño correcto del div
            setTimeout(() => {
                if (!map) initMap();
                else map.resize();
                actualizarMarcadores();
            }, 100);
        }
    }

    if(navAlumnos) navAlumnos.addEventListener("click", (e) => { e.preventDefault(); mostrarVista('alumnos'); });
    if(navInicio) navInicio.addEventListener("click", (e) => { e.preventDefault(); mostrarVista('alumnos'); });
    if(navMapa) navMapa.addEventListener("click", (e) => { e.preventDefault(); mostrarVista('mapa'); });


    // --- 4. CARGAR TABLA DE ALUMNOS ---
    async function cargarAlumnos() {
        if(!alumnosTableBody) return;
        
        alumnosTableBody.innerHTML = "<tr><td colspan='6' style='text-align:center'>Cargando...</td></tr>";

        try {
            const res = await fetch("/api/alumnos");
            const alumnos = await res.json();
            renderTabla(alumnos);
        } catch (error) {
            console.error("Error:", error);
            alumnosTableBody.innerHTML = "<tr><td colspan='6' style='text-align:center; color:red'>Error al cargar datos.</td></tr>";
        }
    }

    function renderTabla(alumnos) {
        alumnosTableBody.innerHTML = "";

        if (!alumnos || alumnos.length === 0) {
            alumnosTableBody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No hay alumnos registrados.</td></tr>";
            return;
        }

        alumnos.forEach((alumno) => {
            const tr = document.createElement("tr");
            
            const nombre = alumno.nombre || "<i>(Pendiente)</i>";
            const matricula = alumno.matricula || "---";
            // Estado basado en si tiene coordenadas
            const tieneGPS = (alumno.lat && alumno.lng);
            const estado = tieneGPS 
                ? "<span style='color:green; font-weight:bold;'>● Activo</span>" 
                : "<span style='color:orange;'>● Sin Señal</span>";
            
            // Botón o texto de ubicación
            const ubicacion = tieneGPS 
                ? `<a href="#" style="color:#007bff; text-decoration:underline;" 
                      onclick="window.verEnMapa(${alumno.lat}, ${alumno.lng})">
                      Ver en mapa
                   </a>` 
                : "No disponible";

            tr.innerHTML = `
                <td>${nombre}</td>
                <td>${matricula}</td>
                <td>${alumno.email}</td>
                <td>${estado}</td>
                <td>${ubicacion}</td>
                <td>
                    <button class="btn-delete" style="background:none; border:none; cursor:pointer;" data-id="${alumno.id}" title="Eliminar">
                        🗑️
                    </button>
                </td>
            `;
            alumnosTableBody.appendChild(tr);
        });

        // Listeners para borrar
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                if(!confirm("¿Seguro que deseas eliminar a este alumno?")) return;
                const id = e.target.closest("button").dataset.id;
                await fetch(`/api/alumnos/${id}`, { method: "DELETE" });
                cargarAlumnos();
            });
        });
    }

    // Función global para saltar al mapa desde la tabla
    window.verEnMapa = (lat, lng) => {
        mostrarVista('mapa');
        setTimeout(() => {
            if(map) {
                map.flyTo({ center: [lng, lat], zoom: 15 });
                // Opcional: Abrir el popup del marcador correspondiente si se desea
            }
        }, 500);
    };


    // --- 5. MODAL Y ENVÍO EMAILJS ---
    if (btnInvitar) {
        btnInvitar.onclick = () => {
            if(modal) {
                modal.style.display = "block";
                if(invitarForm) invitarForm.reset();
                if(formStatus) formStatus.innerText = "";
            }
        };
    }

    if (spanClose && modal) {
        spanClose.onclick = () => modal.style.display = "none";
        window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
    }

    if (invitarForm) {
        invitarForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("correoInput").value;
            
            btnEnviarInvitacion.disabled = true;
            btnEnviarInvitacion.innerText = "Procesando...";
            formStatus.innerText = "";

            try {
                // A) Guardar en BD
                const res = await fetch("/api/alumnos/invitar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (!data.ok) throw new Error(data.msg || "Error al guardar.");

                // B) Enviar Email
                btnEnviarInvitacion.innerText = "Enviando correo...";
                const linkRegistro = `${window.location.origin}/registro.html?email=${email}`;

                const params = {
                    to_email: email,
                    link_registro: linkRegistro
                };
                
                // REEMPLAZA ESTOS VALORES CON LOS TUYOS
                await emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", params);

                alert(`✅ Invitación enviada a ${email}`);
                modal.style.display = "none";
                cargarAlumnos(); // Refrescar tabla

            } catch (error) {
                console.error(error);
                formStatus.innerText = "❌ " + error.message;
                formStatus.style.color = "red";
            } finally {
                btnEnviarInvitacion.disabled = false;
                btnEnviarInvitacion.innerText = "Enviar Invitación";
            }
        });
    }


    // --- 6. MAPA (MAPBOX) ---
    function initMap() {
        if (map) return; // Evitar reinicializar

        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-100.3161, 25.6866], // Mty
            zoom: 11
        });

        map.addControl(new mapboxgl.NavigationControl());
        
        // Actualizar marcadores periódicamente
        actualizarMarcadores();
        setInterval(actualizarMarcadores, 5000); 
    }

    async function actualizarMarcadores() {
        if(!map) return;

        try {
            const res = await fetch("/api/alumnos");
            const alumnos = await res.json();

            // Limpiar marcadores viejos para evitar duplicados (simple strategy)
            markers.forEach(m => m.remove());
            markers = [];

            alumnos.forEach(alumno => {
                if (alumno.lat && alumno.lng) {
                    // Crear Popup
                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<strong>${alumno.nombre || 'Sin nombre'}</strong><br>
                         ${alumno.matricula || ''}<br>
                         ${alumno.en_alerta ? "<b style='color:red'>¡ALERTA!</b>" : "Seguro"}`
                    );

                    // Elemento DOM del marcador
                    const el = document.createElement('div');
                    el.className = 'marker';
                    // Estilo bola roja o azul
                    el.style.backgroundColor = alumno.en_alerta ? '#ff0000' : '#3fb1ce';
                    el.style.width = '20px';
                    el.style.height = '20px';
                    el.style.borderRadius = '50%';
                    el.style.border = '2px solid white';
                    el.style.cursor = 'pointer';
                    // Si es alerta, que palpite (opcional con CSS)
                    if(alumno.en_alerta) el.style.boxShadow = "0 0 10px 5px red";

                    const marker = new mapboxgl.Marker(el)
                        .setLngLat([parseFloat(alumno.lng), parseFloat(alumno.lat)])
                        .setPopup(popup)
                        .addTo(map);
                    
                    markers.push(marker);
                }
            });
        } catch(e) { console.error("Error mapa:", e); }
    }

  } // Fin lógica Dashboard
});
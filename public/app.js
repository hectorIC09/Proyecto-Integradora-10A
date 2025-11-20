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
mapboxgl.accessToken = 'pk.eyJ1IjoiaGVjdG9yY29udHJlcmFzIiwiYSI6ImNtM254Y3RzZzA4bXQya3B4Z2o0aW80czYifQ.zKyjGjaMkyj07O-COHqT4A';

document.addEventListener("DOMContentLoaded", async () => {
    
    // --- REFERENCIAS DOM ---
    const alumnosTableBody = document.getElementById("alumnosTableBody");
    const btnLogout = document.getElementById("btn-logout");
    
    // Navegación
    const navAlumnos = document.getElementById("nav-alumnos");
    const navMapa = document.getElementById("nav-mapa");
    const viewAlumnos = document.getElementById("view-alumnos");
    const viewMapa = document.getElementById("view-mapa");
    const navInicio = document.getElementById("nav-inicio");

    // Modal
    const modal = document.getElementById("invitarModal");
    const btnInvitar = document.getElementById("btnInvitar");
    const spanClose = document.getElementsByClassName("close")[0];
    const invitarForm = document.getElementById("invitarForm");
    const formStatus = document.getElementById("formStatus");

    // Variables Mapa
    let map;
    let markers = [];

    // --- INICIALIZACIÓN ---
    console.log("App iniciada. Cargando alumnos...");
    cargarAlumnos();

    // --- FUNCIONES DE NAVEGACIÓN ---
    function mostrarVista(vista) {
        // Ocultar todas
        viewAlumnos.style.display = "none";
        viewMapa.style.display = "none";
        
        // Mostrar la seleccionada
        if(vista === 'alumnos') viewAlumnos.style.display = "block";
        if(vista === 'mapa') {
            viewMapa.style.display = "block";
            setTimeout(() => {
                if (!map) initMap();
                else map.resize();
                actualizarMarcadores();
            }, 100); // Pequeño delay para asegurar que el div sea visible
        }
    }

    navAlumnos.addEventListener("click", (e) => { e.preventDefault(); mostrarVista('alumnos'); });
    navInicio.addEventListener("click", (e) => { e.preventDefault(); mostrarVista('alumnos'); });
    navMapa.addEventListener("click", (e) => { e.preventDefault(); mostrarVista('mapa'); });

    // --- GESTIÓN DE ALUMNOS (TABLA) ---
    async function cargarAlumnos() {
        try {
            const res = await fetch("/api/alumnos");
            const alumnos = await res.json();
            renderTabla(alumnos);
        } catch (error) {
            console.error("Error cargando alumnos:", error);
            alumnosTableBody.innerHTML = "<tr><td colspan='6'>Error al cargar datos.</td></tr>";
        }
    }

    function renderTabla(alumnos) {
        alumnosTableBody.innerHTML = "";
        
        if(alumnos.length === 0) {
            alumnosTableBody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No hay alumnos registrados.</td></tr>";
            return;
        }

        alumnos.forEach((alumno) => {
            const tr = document.createElement("tr");
            
            const nombre = alumno.nombre || "<i>(Pendiente de registro)</i>";
            const matricula = alumno.matricula || "---";
            const estado = alumno.registrado 
                            ? (alumno.lat ? "<span style='color:green'>● Activo</span>" : "<span style='color:orange'>● Sin GPS</span>") 
                            : "<span style='color:gray'>○ Invitado</span>";
            
            const ubicacion = (alumno.lat && alumno.lng) 
                              ? `<a href="#" onclick="verEnMapa(${alumno.lat}, ${alumno.lng})">${alumno.lat.toFixed(4)}, ${alumno.lng.toFixed(4)}</a>`
                              : "No disponible";

            tr.innerHTML = `
                <td>${nombre}</td>
                <td>${matricula}</td>
                <td>${alumno.email}</td>
                <td>${estado}</td>
                <td>${ubicacion}</td>
                <td>
                    <button class="btn-icon btn-delete" data-id="${alumno.id}" title="Eliminar">
                        <i class="fas fa-trash"></i> 🗑️
                    </button>
                </td>
            `;
            alumnosTableBody.appendChild(tr);
        });

        // Asignar eventos a botones de eliminar
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                if(!confirm("¿Estás seguro de eliminar este alumno?")) return;
                const id = e.target.closest("button").dataset.id;
                
                try {
                    await fetch(`/api/alumnos/${id}`, { method: "DELETE" });
                    cargarAlumnos(); // Recargar tabla
                } catch(err) {
                    alert("Error al eliminar");
                }
            });
        });
    }

    // Función global para ir al mapa desde la tabla
    window.verEnMapa = (lat, lng) => {
        mostrarVista('mapa');
        setTimeout(() => {
            map.flyTo({ center: [lng, lat], zoom: 15 });
        }, 500);
    };

    // --- LÓGICA DE INVITACIÓN (MODAL + EMAILJS) ---
    
    // Abrir Modal
    btnInvitar.onclick = () => {
        modal.style.display = "block";
        invitarForm.reset();
        formStatus.innerText = "";
    };

    // Cerrar Modal
    spanClose.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

    invitarForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("correoInput").value;
        const btnSubmit = document.getElementById("btnEnviarInvitacion");
        
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Guardando...";
        formStatus.innerText = "";

        try {
            // 1. Guardar en Base de Datos primero
            const res = await fetch("/api/alumnos/invitar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Error al guardar en BD");
            }

            // 2. Enviar correo con EmailJS
            btnSubmit.innerText = "Enviando correo...";
            
            // Este link lleva al alumno a completar sus datos
            const linkRegistro = `${window.location.origin}/registro.html?email=${email}`;

            const templateParams = {
                to_email: email,
                link_registro: linkRegistro,
                // Agrega aquí otras variables si tu template las pide (ej: to_name)
            };

            // REEMPLAZA CON TUS DATOS DE EMAILJS
            await emailjs.send("service_tqq2bv2", "service_tqq2bv2", templateParams);

            // Todo salió bien
            alert(`✅ Invitación enviada a ${email}`);
            modal.style.display = "none";
            cargarAlumnos(); // Actualizar lista

        } catch (error) {
            console.error(error);
            formStatus.innerText = "❌ Error: " + error.message;
            formStatus.style.color = "red";
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Enviar Invitación";
        }
    });


    // --- MAPA (MAPBOX) ---
    function initMap() {
        if (map) return; // Evitar reinicializar

        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-100.3161, 25.6866], // Mty
            zoom: 10
        });

        map.addControl(new mapboxgl.NavigationControl());
    }

    async function actualizarMarcadores() {
        // Borrar marcadores viejos
        markers.forEach(m => m.remove());
        markers = [];

        try {
            const res = await fetch("/api/alumnos");
            const alumnos = await res.json();

            alumnos.forEach(alumno => {
                if (alumno.lat && alumno.lng) {
                    // Crear Popup
                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<strong>${alumno.nombre || 'Alumno'}</strong><br>
                         ${alumno.matricula || 'Sin matrícula'}<br>
                         <small>Última act: ${new Date(alumno.ultima_actualizacion).toLocaleTimeString()}</small>`
                    );

                    // Crear Marcador Rojo
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.style.backgroundColor = 'red';
                    el.style.width = '20px';
                    el.style.height = '20px';
                    el.style.borderRadius = '50%';
                    el.style.cursor = 'pointer';

                    const marker = new mapboxgl.Marker(el)
                        .setLngLat([parseFloat(alumno.lng), parseFloat(alumno.lat)])
                        .setPopup(popup)
                        .addTo(map);
                    
                    markers.push(marker);
                }
            });
        } catch(e) { console.error("Error actualizando mapa", e); }
    }

    // --- LOGOUT ---
    btnLogout.addEventListener("click", () => {
        // Limpiar sesión local si la usas
        // localStorage.removeItem('user'); 
        window.location.href = "/index.html";
    });
});
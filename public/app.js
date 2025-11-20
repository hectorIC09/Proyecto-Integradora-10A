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

  // ===================================================================
  //                     ***** MODO ALUMNO  *****
  // ===================================================================

  const btnSoyAlumno = document.getElementById("soy-alumno-btn");
  const loginForm = document.querySelector("#login-form");
  const regForm = document.querySelector("#register-form");
  const alumnoForm = document.getElementById("alumno-form");

  if (btnSoyAlumno && loginForm && alumnoForm) {
    btnSoyAlumno.addEventListener("click", () => {
      loginForm.classList.remove("active");
      regForm?.classList.remove("active");
      alumnoForm.classList.add("active");
      document.getElementById("form-title").textContent = "Acceso Alumno";
    });
  }

  // ===== Login alumno por matrícula =====
  if (alumnoForm) {
    alumnoForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const matricula = document.getElementById("matricula-alumno").value.trim();
      const msgAlumno = document.getElementById("msg-alumno");

      try {
        // Nota: Asegúrate de que este endpoint exista en tu nuevo controlador o usa el de login nuevo
        const res = await fetch(`/api/alumnos/login`, {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ matricula })
        });
        const d = await res.json();

        if (!res.ok || !d.ok) {
          msgAlumno.textContent = d.msg || "Matrícula no encontrada.";
          return;
        }

        // Guardar sesión alumno
        localStorage.setItem("alumno", JSON.stringify(d.alumno));
        window.location.href = "/dashboard-alumno.html"; // Redirige al nuevo dashboard

      } catch (err) {
        msgAlumno.textContent = "Error de conexión con el servidor.";
        console.error(err);
      }
    });
  }

  // ===================================================================
  //                     ***** FIN MODO ALUMNO  *****
  // ===================================================================


  // --- LÓGICA DE LOGIN / REGISTRO (ADMIN) ---
  const regForm2 = document.querySelector("#register-form");

  if (loginForm && regForm2) {
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
    regForm2.addEventListener("submit", async (e) => {
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
          regForm2.classList.remove("active");
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
      regForm2.classList.add("active");
      formTitle.textContent = "Crear Cuenta";
    });

    document.querySelector("#show-login").addEventListener("click", (e) => {
      e.preventDefault();
      regForm2.classList.remove("active");
      loginForm.classList.add("active");
      formTitle.textContent = "Iniciar Sesión";
    });
  }

  // ===================================================================
  //                  ***** LÓGICA DEL DASHBOARD *****
  // ===================================================================

  const isDashboard = document.body.classList.contains('dashboard-page');

  if (isDashboard) {
    console.log("Estoy en la página de Dashboard.");

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
    // Reemplaza con tu Token Real
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGVjdG9yY29udHJlcmFzIiwiYSI6ImNtM254Y3RzZzA4bXQya3B4Z2o0aW80czYifQ.zKyjGjaMkyj07O-COHqT4A';

    let map = null;
    const marcadores = {};

    function iniciarMapa() {
      const mapDiv = document.getElementById("map");
      if (!mapDiv) return;

      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-100.3161, 25.6866], // Coordenadas default (Mty)
        zoom: 12
      });

      map.addControl(new mapboxgl.NavigationControl());
    }

    // --- LÓGICA NUEVA: INVITAR ALUMNO CON EMAILJS ---
    const inviteForm = document.getElementById('invite-form');
    const inviteMsg = document.getElementById('invite-msg');
    const btnEnviarInvite = document.getElementById('btnEnviarInvite');

    if (inviteForm) {
        inviteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('invite-email').value;
            
            inviteMsg.style.display = 'block';
            inviteMsg.innerText = "Procesando...";
            inviteMsg.style.color = "blue";
            btnEnviarInvite.disabled = true;

            try {
                // 1. Guardar en BD (Backend)
                const res = await fetch('/api/alumnos/invitar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (!data.ok) throw new Error(data.msg);

                // 2. Enviar Correo (Frontend - EmailJS)
                const linkRegistro = `${window.location.origin}/registro.html?email=${email}`;
                
                const templateParams = {
                    to_email: email,
                    link_registro: linkRegistro,
                    // Si tu template usa otras variables, agrégalas aquí
                };

                // REEMPLAZA CON TUS DATOS DE EMAILJS
                await emailjs.send("service_vxuchkc", "template_oqgl00e", templateParams);

                inviteMsg.innerText = "✅ Invitación enviada con éxito.";
                inviteMsg.style.color = "green";
                inviteForm.reset();

            } catch (error) {
                console.error(error);
                inviteMsg.innerText = "❌ Error: " + error.message;
                inviteMsg.style.color = "red";
            } finally {
                btnEnviarInvite.disabled = false;
            }
        });
    }

    async function actualizarDatos() {
      try {
        const res = await fetch('/api/alumnos'); // Trae solo alumnos con ubicación válida
        const alumnos = await res.json();

        const listaAlertas = document.getElementById('alertas-lista');
        const listaAlumnos = document.getElementById('alumnos-lista');
        const msgNoAlertas = document.getElementById('no-alertas-msg');

        // Limpiar listas
        if (listaAlertas) listaAlertas.innerHTML = "";
        if (listaAlumnos) listaAlumnos.innerHTML = "";
        
        let hayAlertas = false;

        if (!alumnos || alumnos.length === 0) {
             if(listaAlumnos) listaAlumnos.innerHTML = "<p>No hay alumnos activos en el mapa.</p>";
             return;
        }

        alumnos.forEach(alumno => {
          const {
            id,
            nombre,
            matricula,
            lat,
            lng,
            en_alerta
          } = alumno;

          // Renderizar Alertas
          if (en_alerta && listaAlertas) {
            hayAlertas = true;
            const item = document.createElement("div");
            item.className = "alert-list-item";
            item.innerHTML = `
              <div>
                <strong>${nombre || 'Sin Nombre'}</strong>
                <br><small>${matricula || '---'}</small>
              </div>
              <button class="btn btn-safe" data-id="${id}">Marcar Seguro</button>
            `;
            listaAlertas.appendChild(item);
          }

          // Renderizar Lista de Alumnos (Solo mostrar básicos)
          if (listaAlumnos) {
            const itemAlumno = document.createElement("div");
            itemAlumno.className = "student-list-item";
            // Un borde de color para indicar si tiene GPS activo
            const estadoColor = (lat && lng) ? "green" : "gray"; 
            
            itemAlumno.innerHTML = `
                <div style="border-left: 4px solid ${estadoColor}; padding-left: 10px;">
                <strong>${nombre || 'Registrado (Sin datos)'}</strong>
                <br><small>${matricula || alumno.email}</small>
                </div>
                ${
                    en_alerta
                    ? `<button class="btn btn-safe" data-id="${id}">Seguro</button>`
                    : `<button class="btn btn-alert" data-id="${id}">Alerta</button>`
                }
            `;
            listaAlumnos.appendChild(itemAlumno);
          }

          // Actualizar Mapa
          if (!map) return;

          // Aseguramos que las coordenadas sean números válidos
          const latNum = parseFloat(lat);
          const lngNum = parseFloat(lng);

          if (isNaN(latNum) || isNaN(lngNum)) return;

          if (marcadores[id]) {
            marcadores[id].setLngLat([lngNum, latNum]);
            // Actualizar color si entra en alerta
             const el = marcadores[id].getElement();
             el.style.background = en_alerta ? "#ff4d4d" : "#3fa7ff";
          } else {
            const el = document.createElement("div");
            el.className = en_alerta ? "marker-alert" : "marker-normal";
            el.style.width = "22px";
            el.style.height = "22px";
            el.style.borderRadius = "50%";
            el.style.background = en_alerta ? "#ff4d4d" : "#3fa7ff";
            el.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
            el.style.cursor = "pointer";

            const marker = new mapboxgl.Marker(el)
              .setLngLat([lngNum, latNum])
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

        if (!hayAlertas && msgNoAlertas && listaAlertas) {
            listaAlertas.appendChild(msgNoAlertas);
            msgNoAlertas.style.display = "block";
            msgNoAlertas.textContent = "No hay alertas activas.";
        } else if (msgNoAlertas) {
            msgNoAlertas.style.display = "none";
        }

      } catch (err) {
        console.error("Error actualizando datos:", err);
      }
    }

    // Manejo de botones en los paneles (Alertas / Seguro)
    async function manejarClicPaneles(e) {
      const target = e.target;
      const id = target.dataset.id;

      if (!id) return;

      // Si clickean "Simular Alerta" (o Alerta), activamos la alerta
      // Si clickean "Marcar Seguro" (o Seguro), desactivamos la alerta
      let nuevoEstado = false;
      if (target.classList.contains("btn-alert")) nuevoEstado = true;
      else if (target.classList.contains("btn-safe")) nuevoEstado = false;
      else return; // Click en otro lado

      // Llamada a la API (asegúrate que tu backend tenga PUT /api/alumnos/alerta/:id)
      // Nota: En la reestructuración quizás usamos solo 'en_alerta' en la tabla
      try {
          // Aquí asumimos que tienes un endpoint para esto. 
          // Si no, habría que crearlo en alumnosRoutes/Controller.
          /* Si no existe el endpoint específico, se puede simular o crear.
             Asumiré que existe o que solo actualiza la UI por ahora si no tienes el endpoint.
          */
          console.log(`Cambiando alerta usuario ${id} a ${nuevoEstado}`);
          // await fetch(...) 
      } catch(err) {
          console.error(err);
      }

      actualizarDatos();
    }

    iniciarMapa();
    actualizarDatos();
    setInterval(actualizarDatos, 3000); // Polling cada 3 segundos

    const panelWrapper = document.querySelector(".panels-wrapper");
    if (panelWrapper) {
      panelWrapper.addEventListener("click", manejarClicPaneles);
    }
  }
});
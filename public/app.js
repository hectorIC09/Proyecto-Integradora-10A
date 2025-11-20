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


// app.js -- REEMPLAZAR TODO EL CONTENIDO con este archivo
// NOTA: No tocar nada del login (este archivo respeta eso).

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------
  // Service Worker (si existe)
  // ----------------------------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./serviceWorker.js")
        .then((reg) => console.log("✅ Service Worker registrado:", reg.scope))
        .catch((err) => console.error("❌ Error al registrar Service Worker:", err));
    });
  }

  // ----------------------------
  // Variables globales
  // ----------------------------
  const isDashboard = document.body.classList.contains("dashboard-page");

  // --- Mapbox token (mantén el tuyo si ya lo tienes) ---
  // Si tienes esta línea en otro archivo, no importa; se sobreescribe con el mismo token.
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGVjdG9yaWMwOSIsImEiOiJjbWkwaW5kM20wdm90MmtvcWVzNzRqODM5In0.iJMjm-vk0gHrO297w6F1Hg';

  // ----------------------------
  // Login / Registro (NO MODIFICAR) 
  // (Se deja intacto si ya lo tienes en otros archivos)
  // ----------------------------
  // Si tu login está en este mismo archivo, asegúrate de no borrar esa parte.
  // (En tu repo dijiste que funciona, así que no lo tocamos.)

  // ----------------------------
  // Dashboard logic
  // ----------------------------
  if (!isDashboard) return;

  console.log("Dashboard: iniciando lógica del dashboard...");

  // Navegación entre vistas
  const viewMapa = document.getElementById("view-mapa");
  const viewAlumnos = document.getElementById("view-alumnos");
  const navInicio = document.getElementById("nav-inicio");
  const navAlumnos = document.getElementById("nav-alumnos");
  const navMapa = document.getElementById("nav-mapa");
  const welcomeH1 = document.querySelector("#welcome");

  function showView(view) {
    // ocultar todas
    document.querySelectorAll(".panel-view").forEach(v => v.style.display = "none");
    if (view) view.style.display = "block";
  }

  // Default: mostrar alumnos
  showView(viewAlumnos);

  navInicio?.addEventListener("click", (e) => {
    e.preventDefault();
    showView(viewAlumnos);
  });
  navAlumnos?.addEventListener("click", (e) => {
    e.preventDefault();
    showView(viewAlumnos);
  });
  navMapa?.addEventListener("click", (e) => {
    e.preventDefault();
    showView(viewMapa);
    // si el mapa ya fue inicializado, resize
    if (map) map.resize();
  });

  // Logout (mantener igual)
  const btnLogout = document.getElementById('btn-logout');
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

  // Cargar info del admin/usuario para mostrar nombre
  async function loadUser() {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const d = await res.json();
        if (d.ok && d.user) {
          welcomeH1.textContent = `Bienvenido, ${d.user.name}`;
        }
      }
    } catch (err) {
      console.error("Error cargando usuario:", err);
    }
  }
  loadUser();

  // ---------------------------------------
  // Elementos DOM del dashboard
  // ---------------------------------------
  const alumnosTableBody = document.getElementById("alumnosTableBody");
  const btnInvitar = document.getElementById("btnInvitar");
  const invitarModal = document.getElementById("invitarModal");
  const invitarClose = invitarModal?.querySelector(".close");
  const invitarForm = document.getElementById("invitarForm");
  const correoInput = document.getElementById("correoInput");
  const formStatus = document.getElementById("formStatus");

  // ---------------------------------------
  // EmailJS (usa tu SERVICE_ID y TEMPLATE_ID)
  // ---------------------------------------
  // Asegúrate de haber inicializado emailjs en tu HTML con tu public key
  // Ejemplo en HTML:
  // <script>emailjs.init('tu_public_key');</script>
  //
  // Enviar email con:
  // emailjs.send('SERVICE_ID','TEMPLATE_ID', templateParams)
  //
  const EMAILJS_SERVICE_ID = "service_tqq2bv2";    // <- REEMPLAZA con tu service id (ej: 'service_xxx')
  const EMAILJS_TEMPLATE_ID = "template_oqgl00e"; // <- REEMPLAZA con tu template id (ej: 'template_xxx')

  // ---------------------------------------
  // Modal invitar
  // ---------------------------------------
  btnInvitar?.addEventListener("click", () => {
    if (!invitarModal) return;
    formStatus.textContent = "";
    correoInput.value = "";
    invitarModal.style.display = "block";
  });

  invitarClose?.addEventListener("click", () => {
    invitarModal.style.display = "none";
  });

  // Cerrar modal si se clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === invitarModal) invitarModal.style.display = "none";
  });

  // Enviar invitación (EmailJS + POST al backend para registrar email)
  invitarForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const correo = correoInput.value.trim();
    if (!correo) {
      formStatus.style.color = "crimson";
      formStatus.textContent = "Ingresa un correo válido.";
      return;
    }

    formStatus.style.color = "black";
    formStatus.textContent = "Enviando invitación...";

    try {
      // 1) Crear en BD (para que exista la fila vacía con email)
      const resDB = await fetch("/api/alumnos/invitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo })
      });
      const dbJson = await resDB.json();
      if (!resDB.ok) {
        formStatus.style.color = "crimson";
        formStatus.textContent = dbJson.msg || "Error creando invitación en BD.";
        return;
      }

      // 2) Enviar email via EmailJS (si lo tienes configurado)
      // templateParams puedes adaptar a tu template de EmailJS
      const templateParams = {
        to_email: correo,
        // PUEDE ser un link generado con lógica del backend (si prefieres)
        // Si quieres que el link lo genere el backend, pide que te devuelva el link en la respuesta /api/alumnos/invitar
        invite_link: `${window.location.origin}/registro-alumno.html?email=${encodeURIComponent(correo)}`
      };

      // Si EmailJS no está inicializado correctamente, este bloque fallará -> lo capturamos
      if (typeof emailjs !== "undefined" && EMAILJS_SERVICE_ID !== 'service_tqq2bv2' && EMAILJS_TEMPLATE_ID !== "template_oqgl00e") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      } else {
        console.warn("EmailJS: No enviado. Revisa SERVICE_ID / TEMPLATE_ID o inicialización.");
      }

      formStatus.style.color = "green";
      formStatus.textContent = "Invitación enviada correctamente.";
      invitarForm.reset();

      // refrescar lista
      await loadAlumnos();

    } catch (err) {
      console.error("Error invitando:", err);
      formStatus.style.color = "crimson";
      formStatus.textContent = "Error enviando invitación. Revisa consola.";
    }
  });

  // ---------------------------------------
  // MAPA y marcadores
  // ---------------------------------------
  let map = null;
  const marcadores = {}; // { id: mapboxgl.Marker }

  function iniciarMapa() {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    // Solo inicializar una vez
    if (map) return;

    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-100.510669, 25.692447],
      zoom: 15
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.on("load", () => {
      // crear marcador inicial si procede
    });
  }

  iniciarMapa();

  // ---------------------------------------
  // Cargar alumnos y poblar tabla + mapa
  // ---------------------------------------
  async function loadAlumnos() {
    try {
      const res = await fetch("/api/alumnos");
      if (!res.ok) {
        console.error("Error cargando alumnos:", res.status);
        return;
      }
      // Tu controlador devuelve un array: result.rows
      const alumnos = await res.json();

      // Limpiar tabla
      if (alumnosTableBody) alumnosTableBody.innerHTML = "";

      // Marcar si hay al menos 1 alumno para centrar mapa (opcional)
      let firstCoords = null;

      alumnos.forEach(alumno => {
        const id = alumno.id ?? alumno.ID ?? alumno._id;
        const nombre = alumno.nombre ?? alumno.name ?? "Sin nombre";
        const matricula = alumno.matricula ?? alumno.matricula_alumno ?? "";
        const email = alumno.email ?? "";
        const en_alerta = alumno.en_alerta === true || alumno.en_alerta === "true" || alumno.en_alerta === 1;
        // tu controller guarda lat y lng en columnas 'lat' y 'lng'
        const lat = parseFloat(alumno.lat ?? alumno.lat_actual ?? alumno.lat_inicial ?? 0) || null;
        const lng = parseFloat(alumno.lng ?? alumno.lng_actual ?? alumno.lng_inicial ?? 0) || null;
        const ultima = alumno.ultima_ubicacion ?? alumno.updated_at ?? "";

        // Tabla
        if (alumnosTableBody) {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${nombre}</td>
            <td>${matricula}</td>
            <td>${email}</td>
            <td class="status-cell">${ en_alerta ? "<span class='badge badge-alert'>ALERTA</span>" : "<span class='badge badge-safe'>Seguro</span>" }</td>
            <td>${ lat && lng ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "Sin ubicación" }</td>
            <td class="actions-cell">
              <button class="btn btn-small btn-toggle-alert" data-id="${id}" data-enalerta="${en_alerta}">${ en_alerta ? "Marcar Seguro" : "Activar Alerta" }</button>
              <button class="btn btn-small btn-view-map" data-lat="${lat}" data-lng="${lng}" data-nombre="${nombre}">Ver en Mapa</button>
              <button class="btn btn-small btn-delete" data-id="${id}">Eliminar</button>
            </td>
          `;
          alumnosTableBody.appendChild(tr);
        }

        // Map markers (si tenemos coords)
        if (lat && lng && map) {
          firstCoords = firstCoords || [lng, lat];

          if (marcadores[id]) {
            // mover marcador
            marcadores[id].setLngLat([lng, lat]);

            // actualizar estilos segun alerta
            const el = marcadores[id].getElement();
            if (en_alerta) {
              el.className = "marker marker-alert";
              el.style.background = "#ff4d4d";
            } else {
              el.className = "marker marker-normal";
              el.style.background = "#3fa7ff";
            }
          } else {
            // crear nuevo
            const el = document.createElement("div");
            el.className = en_alerta ? "marker marker-alert" : "marker marker-normal";
            el.style.width = "22px";
            el.style.height = "22px";
            el.style.borderRadius = "50%";
            el.style.boxShadow = "0 0 8px rgba(0,0,0,0.4)";
            el.style.background = en_alerta ? "#ff4d4d" : "#3fa7ff";

            const marker = new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(new mapboxgl.Popup().setHTML(`<strong>${nombre}</strong><br>${matricula}<br>${ en_alerta ? "<span style='color:#ff4d4d;font-weight:bold'>⚠ ALERTA</span>" : "" }`))
              .addTo(map);

            marcadores[id] = marker;
          }
        }
      });

      // Si hay coords iniciales, centramos (una vez)
      if (firstCoords && map) {
        map.flyTo({ center: firstCoords, zoom: 15 });
      }

      // Asociar eventos de los botones (delegación simple)
      attachTableEventHandlers();

    } catch (err) {
      console.error("Error en loadAlumnos:", err);
    }
  }

  // Manejo de eventos para los botones de la tabla
  function attachTableEventHandlers() {
    if (!alumnosTableBody) return;
    // toggle alert
    alumnosTableBody.querySelectorAll(".btn-toggle-alert").forEach(btn => {
      btn.removeEventListener("click", btn._listener);
      const listener = async (e) => {
        const id = btn.dataset.id;
        const enalerta = btn.dataset.enalerta === "true" || btn.dataset.enalerta === "1";
        const nuevoEstado = !enalerta;
        try {
          await fetch(`/api/alumnos/alerta/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ en_alerta: nuevoEstado })
          });
          // actualizar UI inmediatamente (optimista)
          await loadAlumnos();
        } catch (err) {
          console.error("Error toggling alerta:", err);
        }
      };
      btn.addEventListener("click", listener);
      btn._listener = listener;
    });

    // ver en mapa
    alumnosTableBody.querySelectorAll(".btn-view-map").forEach(btn => {
      btn.removeEventListener("click", btn._listener);
      const listener = (e) => {
        const lat = parseFloat(btn.dataset.lat);
        const lng = parseFloat(btn.dataset.lng);
        const nombre = btn.dataset.nombre;
        if (!isNaN(lat) && !isNaN(lng) && map) {
          showView(viewMapa);
          map.flyTo({ center: [lng, lat], zoom: 16 });
          // abrir popup si existe marcador
          // encontrar marcador por coordenada o nombre
          for (const key in marcadores) {
            try {
              const marker = marcadores[key];
              const lngLat = marker.getLngLat();
              if (Math.abs(lngLat.lat - lat) < 0.0001 && Math.abs(lngLat.lng - lng) < 0.0001) {
                marker.togglePopup();
                break;
              }
            } catch (e) { /* ignore */ }
          }
        } else {
          alert("Este alumno no tiene ubicación registrada.");
        }
      };
      btn.addEventListener("click", listener);
      btn._listener = listener;
    });

    // eliminar alumno
    alumnosTableBody.querySelectorAll(".btn-delete").forEach(btn => {
      btn.removeEventListener("click", btn._listener);
      const listener = async (e) => {
        const id = btn.dataset.id;
        if (!confirm("¿Eliminar alumno? Esta acción no se puede deshacer.")) return;
        try {
          const res = await fetch(`/api/alumnos/${id}`, { method: "DELETE" });
          const d = await res.json();
          if (res.ok) {
            await loadAlumnos();
          } else {
            alert(d.msg || "Error al eliminar");
          }
        } catch (err) {
          console.error("Error eliminando:", err);
        }
      };
      btn.addEventListener("click", listener);
      btn._listener = listener;
    });
  }

  // actualizar datos cada 3 segundos
  loadAlumnos();
  setInterval(loadAlumnos, 3000);

  // FIN dashboard
});

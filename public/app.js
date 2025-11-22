document.addEventListener("DOMContentLoaded", () => {

  /* ===============================================================
     SERVICE WORKER (GLOBAL)
  =============================================================== */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./serviceWorker.js")
        .then((reg) => console.log("Service Worker OK:", reg.scope))
        .catch((err) => console.error("SW error:", err));
    });
  }

  /* ===============================================================
     LOGIN Y REGISTRO (solo en index)
  =============================================================== */
  const loginForm = document.querySelector("#login-form");
  const regForm = document.querySelector("#register-form");

  if (loginForm && regForm) {
    console.log("Página de login detectada.");

    /* ---------------- LOGIN ---------------- */
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = document.querySelector("#email").value.trim();
      const passwordInput = document.querySelector("#password").value.trim();
      const msg = document.querySelector("#msg");

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput, password: passwordInput })
        });

        const d = await res.json();
        if (d.ok) {
          window.location.href = "/dashboard.html";
        } else {
          msg.textContent = d.message || "Credenciales incorrectas.";
        }
      } catch {
        msg.textContent = "Error de conexión.";
      }
    });

    /* ---------------- REGISTRO ---------------- */
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = rname.value.trim();
      const emailInput = remail.value.trim();
      const passwordInput = rpassword.value.trim();
      const msgReg = document.querySelector("#msg-reg");

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameInput,
            email: emailInput,
            password: passwordInput
          })
        });

        const d = await res.json();

        if (d.ok) {
          msgReg.textContent = "";
          loginForm.classList.add("active");
          regForm.classList.remove("active");
          document.querySelector("#msg").textContent = "Cuenta creada. Inicia sesión.";
        } else {
          msgReg.textContent = d.message;
        }
      } catch {
        msgReg.textContent = "Error en el servidor.";
      }
    });

    /* ----- TOGGLE LOGIN/REGISTER ------ */
    document.querySelector("#show-register").addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.remove("active");
      regForm.classList.add("active");
    });

    document.querySelector("#show-login").addEventListener("click", (e) => {
      e.preventDefault();
      regForm.classList.remove("active");
      loginForm.classList.add("active");
    });
  }

  /* ===============================================================
      DASHBOARD
  =============================================================== */

  const isDashboard = document.body.classList.contains("dashboard-page");

  if (isDashboard) {
    console.log("Dashboard detectado.");

    /* ---- MAPA ---- */
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGVjdG9yaWMwOSIsImEiOiJjbWkwaW5kM20wdm90MmtvcWVzNzRqODM5In0.iJMjm-vk0gHrO297w6F1Hg";

    let map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-100.5114, 25.6906],
      zoom: 13,
      pitch: 45,
      bearing: -20,
    });

    map.addControl(new mapboxgl.NavigationControl());

    const marcadores = {};

    /* ---- CARGAR ALUMNOS ---- */
    async function cargarAlumnos() {
      try {
        const res = await fetch("/api/alumnos/mis-alumnos");
        const data = await res.json();

        if (!data.ok) return;

        const lista = data.alumnos;
        const tableBody = document.getElementById("alumnosTableBody");
        tableBody.innerHTML = "";

        lista.forEach((a) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${a.nombre}</td>
            <td>${a.matricula}</td>
            <td>${a.en_alerta
              ? "<span class='badge badge-alert'>⚠ ALERTA</span>"
              : "<span class='badge badge-safe'>✓ Seguro</span>"}
            </td>
          `;

          tableBody.appendChild(tr);

          // Mapa: crear marcador o actualizarlo
          if (a.lat && a.lng) {
            if (!marcadores[a.id]) {
              const el = document.createElement("div");
              el.className = `marker ${a.en_alerta ? "marker-alert" : "marker-normal"}`;

              marcadores[a.id] = new mapboxgl.Marker(el)
                .setLngLat([a.lng, a.lat])
                .setPopup(
                  new mapboxgl.Popup().setHTML(`
                    <strong>${a.nombre}</strong><br>
                    ${a.matricula}<br>
                    ${a.email}
                  `)
                )
                .addTo(map);
            } else {
              marcadores[a.id].setLngLat([a.lng, a.lat]);
              const el = marcadores[a.id].getElement();
                 el.className = a.en_alerta ? "marker-alert" : "marker-normal";
            }
          }
        });
      } catch (error) {
        console.error("Error cargando alumnos:", error);
      }
    }

    cargarAlumnos();
    setInterval(cargarAlumnos, 3000);

    /* ---- LOGOUT ---- */
    document.getElementById("btn-logout").addEventListener("click", async () => {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/";
    });

    /* ---- MODAL ---- */
    const modal = document.getElementById("modalRegistrar");
    const abrirModal = document.getElementById("abrirModal");
    const cerrarModal = document.getElementById("cerrarModal");

    abrirModal.onclick = () => (modal.style.display = "flex");
    cerrarModal.onclick = () => (modal.style.display = "none");

    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };

    /* ---- REGISTRAR ALUMNO ---- */
    document.getElementById("formRegistrarAlumno").addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = alumnoNombre.value.trim();
      const matricula = alumnoMatricula.value.trim();
      const email = alumnoCorreo.value.trim();
      const msg = document.getElementById("msgRegistrar");

      msg.textContent = "Procesando...";
      msg.className = "form-message";

      try {
        // Guardar en BD
        const res = await fetch("/api/alumnos/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, matricula, email }),
        });

        const data = await res.json();

        if (!data.ok) {
          msg.textContent = data.msg || "Error al registrar alumno.";
          msg.classList.add("err");
          return;
        }

        // Mandar correo
        await emailjs.send("service_tqq2bv2", "template_oqgl00e", {
          alumno_nombre: nombre,
          alumno_matricula: matricula,
          alumno_correo: email,
          link_ubicacion: /*`https://proyecto-integradora-10a.onrender.com/ubicacion.html?matricula=${matricula}`*/'https://proyecto-integradora-10a.onrender.com/alumno-login.html',
        });

        msg.textContent = "Alumno registrado y correo enviado ✔";
        msg.classList.add("ok");

        cargarAlumnos();

        setTimeout(() => {
          modal.style.display = "none";
          msg.textContent = "";
        }, 1500);

      } catch (err) {
        msg.textContent = "Error en el servidor.";
        msg.classList.add("err");
      }
    });
  }
});

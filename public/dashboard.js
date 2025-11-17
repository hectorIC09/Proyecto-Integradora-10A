async function cargarAlumnos() {
  const res = await fetch("/api/alumnos");
  const data = await res.json();

  const tbody = document.getElementById("alumnosTabla");
  tbody.innerHTML = "";

  data.forEach(a => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${a.id}</td>
      <td>${a.nombre}</td>
      <td>${a.matricula}</td>
      <td>${a.en_alerta ? "🚨" : "✔️"}</td>
      <td>
        <button onclick="eliminar(${a.id})" class="btn-delete">Eliminar</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

async function eliminar(id) {
  if (!confirm("¿Eliminar alumno?")) return;

  await fetch(`/api/alumnos/${id}`, { method: "DELETE" });
  cargarAlumnos();
}

cargarAlumnos();
setInterval(cargarAlumnos, 5000);

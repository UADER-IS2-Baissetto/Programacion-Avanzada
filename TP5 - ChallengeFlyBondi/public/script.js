async function cargarViajes(maxPrice = null) {
  const url = maxPrice ? `/api/viajes?maxPrice=${maxPrice}` : "/api/viajes";
  const res = await fetch(url);
  const data = await res.json();
  const contenedor = document.getElementById("contenedor");

  if (data.length === 0) {
    contenedor.innerHTML = `<p class="sin-resultados">😕 No se encontraron vuelos dentro del presupuesto.</p>`;
    return;
  }

  contenedor.innerHTML = data
    .map(v => `
      <div class="card">
        <h3>${v.origen} ➜ ${v.destino}</h3>
        <p><strong>Precio total:</strong> $${v.precioTotal}</p>
        <p><strong>Fecha ida:</strong> ${new Date(v.fechaIda).toLocaleDateString()}</p>
        <p><strong>Fecha vuelta:</strong> ${new Date(v.fechaVuelta).toLocaleDateString()}</p>
        <p><strong>Días de estancia:</strong> ${v.dias}</p>
      </div>
    `)
    .join("");
}

function buscar() {
  const presupuesto = document.getElementById("presupuesto").value;
  if (presupuesto && presupuesto > 0) {
    cargarViajes(presupuesto);
  } else {
    alert("Ingresá un número válido para el precio máximo.");
  }
}

function resetear() {
  document.getElementById("presupuesto").value = "";
  cargarViajes();
}

window.onload = () => cargarViajes();

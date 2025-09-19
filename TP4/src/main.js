const API_URL = "https://api.spacexdata.com/v5/launches";
const app = document.getElementById("app");

async function fetchLaunches() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    window.launchData = data; 
    renderHome(data);
  } catch (err) {
    app.innerHTML = `<p>Error al cargar los lanzamientos 🚨</p>`;
    console.error(err);
  }
}

function renderHome(launches) {
  app.innerHTML = `
    <div class="grid">
      ${launches.map(l => `
        <div class="card" data-flight="${l.flight_number}">
          <h3>${l.name}</h3>
          <img src="${l.links.patch.small}" alt="${l.name}">
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const flightNumber = parseInt(card.dataset.flight, 10);
      renderDetail(flightNumber);
    });
  });
}

function renderDetail(flightNumber) {
  const launch = window.launchData.find(l => l.flight_number === flightNumber);

  app.innerHTML = `
    <div class="detail">
      <div class="back-container">
        <button class="back-btn" id="backBtn">⬅ Volver</button>
      </div>

      <div class="detail-content">
        <!-- Imagen a la izquierda -->
        <div class="detail-img">
          <img src="${launch.links.patch.large}" alt="${launch.name}">
        </div>

        <!-- Texto a la derecha -->
        <div class="detail-info">
          <h2>${launch.name}</h2>
          <p><strong>Número de vuelo:</strong> ${launch.flight_number}</p>
          <p><strong>Fecha:</strong> ${new Date(launch.date_utc).toLocaleString()}</p>
          <p><strong>Detalles:</strong> ${launch.details ?? "Sin información"}</p>
          <p><strong>Fallas:</strong> ${
            launch.failures.length > 0
              ? launch.failures.map(f => f.reason).join(", ")
              : "No hubo fallas"
          }</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => {
    renderHome(window.launchData);
  });
}

fetchLaunches();

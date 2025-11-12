import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

function obtenerViajes(maxPrice = null) {
  const data = JSON.parse(fs.readFileSync("./dataset.json", "utf8"));
  const resultados = [];

  data.forEach(ida => {
    const vueltas = data.filter(v =>
      v.origin === ida.destination &&
      v.destination === ida.origin &&
      new Date(v.date) > new Date(ida.date)
    );

    vueltas.forEach(vuelta => {
      const total = ida.price + vuelta.price;

      if (!maxPrice || total <= maxPrice) {
        const dias = Math.ceil((new Date(vuelta.date) - new Date(ida.date)) / (1000 * 60 * 60 * 24));
        resultados.push({
          origen: ida.origin,
          destino: ida.destination,
          precioTotal: total.toFixed(2),
          fechaIda: ida.date,
          fechaVuelta: vuelta.date,
          dias
        });
      }
    });
  });

  return resultados;
}

app.get("/api/viajes", (req, res) => {
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
  const viajes = obtenerViajes(maxPrice);
  res.json(viajes);
});

app.listen(PORT, () => console.log(`✅ Servidor iniciado en http://localhost:${PORT}`));

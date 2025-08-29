// 10) Dado un objeto que representa una topología de red, encuentra los nodos con
//más conexiones y sugiere optimizaciones.

//Ejercicio 9: Combinar datos de dispositivos y conexiones
//Combina información de dispositivos y conexiones para crear un informe
//detallado de la actividad de red.

const topologiaRed = {
  nodos: [
    { id: "A", tipo: "Router", ubicacion: "Planta 1" },
    { id: "B", tipo: "Switch", ubicacion: "Planta 1" },
    { id: "C", tipo: "Switch", ubicacion: "Planta 2" },
    { id: "D", tipo: "Switch", ubicacion: "Planta 3" },
    { id: "E", tipo: "Router", ubicacion: "Planta 3" }
  ],
  conexiones: [
    { origen: "A", destino: "B", ancho_banda: 1000 },
    { origen: "A", destino: "C", ancho_banda: 1000 },
    { origen: "B", destino: "C", ancho_banda: 100 },
    { origen: "B", destino: "D", ancho_banda: 100 },
    { origen: "C", destino: "D", ancho_banda: 100 },
    { origen: "C", destino: "E", ancho_banda: 1000 },
    { origen: "D", destino: "E", ancho_banda: 1000 }
  ]
};

// Inicializa el contador de conexiones
const conexionesPorNodo = {};
topologiaRed.nodos.forEach(nodo => {
  conexionesPorNodo[nodo.id] = 0;
});

// Contador conexiones (tanto origen como destino)
topologiaRed.conexiones.forEach(conexion => {
  conexionesPorNodo[conexion.origen]++;
  conexionesPorNodo[conexion.destino]++;
});
const nodosOrdenados = Object.entries(conexionesPorNodo)
  .sort((a, b) => b[1] - a[1]);

// optimizaciones
const sugerencias = [];
nodosOrdenados.forEach(([id, conexiones]) => {
  if (conexiones > 2) {
    const nodo = topologiaRed.nodos.find(n => n.id === id);
    sugerencias.push(
      `El nodo ${id} (${nodo.tipo}, ${nodo.ubicacion}) tiene ${conexiones} conexiones. ` +
      `Se recomienda revisar su ancho de banda o balancear carga.`
    );
  }
});

console.log("Conexiones por nodo:", conexionesPorNodo);
console.log("Nodos ordenados por número de conexiones:", nodosOrdenados);
console.log("Sugerencias de optimización:", sugerencias);
// Ejercicio 1: Crear objeto router
const router = {
  modelo: "Archer AX11000",
  marca: "TP-Link",
  puertos: 4,
  velocidad: 11000, 
  soportaWifi: true
};

console.log("Ejercicio 1:")
console.log("Objeto Router: ", router);

// Ejercicio 2: Array dispositivos de red
const dispositivosRed = [
  {tipo: "Router", marca: "NETGEAR", modelo: "Nighthawk RAXE500", precio: 498},
  { tipo: "Switch", marca: "TP-Link", modelo: "TL-SG108", precio: 150 },
  { tipo: "Firewall", marca: "Fortinet", modelo: "FortiGate 60E", precio: 600},
  { tipo: "Router", marca: "TP-Link", modelo: "Archer AX11000", precio: 250},
  { tipo: "Router", marca: "Asus", modelo: "RT-AX86U", precio: 200}
];

console.log("\n Ejercicio 2:")
console.log("Array de dispositivos red: ", dispositivosRed);

// EJercicio 3: Filtrar por marca (utilizando el array anterior)
const dispositivosFiltrados = dispositivosRed.filter(
  (dispositivo) => dispositivo.marca === "TP-Link"
);

console.log("\n Ejercicio 3:")
console.log("Dispositivos de la marca TP-Link:", dispositivosFiltrados);

// Ejercicio 4: Mapear IP
const servidores = [
{ nombre: "Servidor Web", ip: "192.168.1.10", sistema: "Linux" },
{ nombre: "Servidor de Base de Datos", ip: "192.168.1.11", sistema: "Windows" },
{ nombre: "Servidor de Correo", ip: "192.168.1.12", sistema: "Linux" },
{ nombre: "Servidor DNS", ip: "192.168.1.13", sistema: "Linux" },
{ nombre: "Servidor de Archivos", ip: "192.168.1.14", sistema: "Windows" }
];

const direccionesIP = servidores.map(servidor => servidor.ip);

console.log("\n Ejercicio 4:")
console.log("Direcciones IP:", direccionesIP);

// Ejercicio 5: Filtrar y ordenar paquetes
const paquetesDatos = [
{ id: 1, origen: "192.168.1.5", destino: "192.168.1.10", tamaño: 1200, prioridad: 3 },
{ id: 2, origen: "192.168.1.7", destino: "192.168.1.12", tamaño: 800, prioridad: 1 },
{ id: 3, origen: "192.168.1.3", destino: "192.168.1.11", tamaño: 1500, prioridad: 5 },
{ id: 4, origen: "192.168.1.8", destino: "192.168.1.14", tamaño: 950, prioridad: 2 },
{ id: 5, origen: "192.168.1.2", destino: "192.168.1.13", tamaño: 2000, prioridad: 4 }
];

const paquetesFiltrados = paquetesDatos.filter(paquete => paquete.tamaño > 1000);
const paquetesOrdenados = paquetesFiltrados.sort((a, b) => b.prioridad - a.prioridad);

console.log("\n Ejercicio 5:")
console.log("Paquetes filtrados y ordenados de mayor a menor: ", paquetesOrdenados);

// Ejercicio 6: Estadisticas de red
const traficoRed = {
"08:00": 1250, 
"09:00": 1870,
"10:00": 2100,
"11:00": 1950,
"12:00": 1600,
"13:00": 1300,
"14:00": 1700,
"15:00": 2200,
"16:00": 1800,
"17:00": 1500
};
const horas = Object.keys(traficoRed);
const valores = Object.values(traficoRed);
const totalDatos = valores.reduce((hora, MB) => hora + MB, 0);
let horaMax = horas[0];
let maxTrafico = valores[0];
horas.forEach(hora => {
  if (traficoRed[hora] > maxTrafico) {
    maxTrafico = traficoRed[hora];
    horaMax = hora;
  }
});

console.log("\n Ejercicio 6:")
console.log("Total de datos transferidos: ${totalDatos} MB");
console.log("Hora con mayor tráfico: ${horaMax} (${maxTrafico} MB)");

// Ejercicio 7: Analizador conexiones red
const conexiones = [
{ id: 1, origen: "192.168.1.5", destino: "192.168.1.10", protocolo: "HTTP" },
{ id: 2, origen: "192.168.1.7", destino: "192.168.1.12", protocolo: "FTP" },
{ id: 3, origen: "192.168.1.3", destino: "192.168.1.11", protocolo: "SSH" },
{ id: 4, origen: "192.168.1.8", destino: "192.168.1.14", protocolo: "HTTP" },
{ id: 5, origen: "192.168.1.2", destino: "192.168.1.13", protocolo: "HTTPS" },
{ id: 6, origen: "192.168.1.6", destino: "192.168.1.10", protocolo: "FTP" },
{ id: 7, origen: "192.168.1.9", destino: "192.168.1.15", protocolo: "SSH" },
{ id: 8, origen: "192.168.1.4", destino: "192.168.1.11", protocolo: "HTTP" }
];

const conexionesPorProtocolo = {};
conexiones.forEach(conexion => {
  const protocolo = conexion.protocolo;
  conexionesPorProtocolo[protocolo] = (conexionesPorProtocolo[protocolo] || 0) + 1;
});

console.log("\n Ejercicio 7:")
console.log("Conexiones por protocolo:", conexionesPorProtocolo);

// Ejercicio 8: Filtrar y transformar alertas de seguridad
const alertas = [
  { id: 1, dispositivo: "192.168.1.5", nivel: "alto", mensaje: "Intento de acceso no autorizado" },
  { id: 2, dispositivo: "192.168.1.7", nivel: "medio", mensaje: "Puerto no estándar abierto" },
  { id: 3, dispositivo: "192.168.1.10", nivel: "alto", mensaje: "Ataque DDoS detectado" },
  { id: 4, dispositivo: "192.168.1.11", nivel: "bajo", mensaje: "Actualización pendiente" }
];
const alertasCriticas = alertas
  .filter(alerta => alerta.nivel === "alto")
  .map(alerta => `NUEVA NOTIFICACIÓN: ${alerta.mensaje} en dispositivo ${alerta.dispositivo}`);

const dispositivos = [
{ id: 1, nombre: "PC-Desarrollo", ip: "192.168.1.5", tipo: "Estación de trabajo" },
{ id: 2, nombre: "PC-Marketing", ip: "192.168.1.7", tipo: "Estación de trabajo" },
{ id: 3, nombre: "Servidor-Web", ip: "192.168.1.10", tipo: "Servidor" },
{ id: 4, nombre: "Servidor-BD", ip: "192.168.1.11", tipo: "Servidor" }
];
const conexionesActivas = [
{ origen: "192.168.1.5", destino: "192.168.1.10", protocolo: "HTTP", bytes: 8500 },
{ origen: "192.168.1.7", destino: "192.168.1.11", protocolo: "MySQL", bytes: 12000 },
{ origen: "192.168.1.5", destino: "192.168.1.11", protocolo: "MySQL", bytes: 9200 }
];

const informeActividad = conexionesActivas.map(conexion => {
  const origen = dispositivos.find(d => d.ip === conexion.origen);
  const destino = dispositivos.find(d => d.ip === conexion.destino);

  return {
    origen: origen ? origen.nombre : conexion.origen,
    destino: destino ? destino.nombre : conexion.destino,
    protocolo: conexion.protocolo,
    datosTransferidos: `${conexion.bytes} bytes`
  };
});

console.log("\n Ejercicio 8:")
console.log("Alertas críticas para el administrador:");
console.log(alertasCriticas);
console.log("Informe de actividad de red:", informeActividad);

// EJercicio 9: Combinar datos de dispositivos y conexiones
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
const conexionesPorNodo = {};
topologiaRed.nodos.forEach(nodo => {
conexionesPorNodo[nodo.id] = 0;
});
topologiaRed.conexiones.forEach(conexion => {
  conexionesPorNodo[conexion.origen]++;
  conexionesPorNodo[conexion.destino]++;
});
const nodosOrdenados = Object.entries(conexionesPorNodo)
  .sort((a, b) => b[1] - a[1]);
  const sugerencias = [];

const informeTopologia = topologiaRed.conexiones.map(conexion => {
  const nodoOrigen = topologiaRed.nodos.find(n => n.id === conexion.origen);
  const nodoDestino = topologiaRed.nodos.find(n => n.id === conexion.destino);

  return {
    origen: `${nodoOrigen.id} (${nodoOrigen.tipo}, ${nodoOrigen.ubicacion})`,
    destino: `${nodoDestino.id} (${nodoDestino.tipo}, ${nodoDestino.ubicacion})`,
    ancho_banda: `${conexion.ancho_banda} Mbps`
  };
});

console.log("\n Ejercicio 9:")
console.log("Conexiones por nodo:", conexionesPorNodo);
console.log("Nodos ordenados por número de conexiones:", nodosOrdenados);
console.log("Informe detallado de conexiones:", informeTopologia);


// Ejercicio 10: Analizar y optimizar topología de red
nodosOrdenados.forEach(([nodo, conexiones]) => {
     if (conexiones > 3) {
    sugerencias.push(`El nodo ${nodo} tiene ${conexiones} conexiones. Sugerencia: los nodos con mas de 3 conexiones necesitan mas ancho de banda urgentemente`);
  } else if (conexiones > 2) {
    sugerencias.push(`El nodo ${nodo} tiene ${conexiones} conexiones. Sugerencia: revisar capacidad de ancho de banda.`);
  }
});

console.log("\n Ejercicio 10:")
console.log("Sugerencias de optimización:", sugerencias);

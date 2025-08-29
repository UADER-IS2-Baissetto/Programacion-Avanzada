//6) Dado un objeto con estadísticas de tráfico de red por hora, calcula el total de
// datos transferidos y la hora con mayor tráfico.

const traficoRed = {
"08:00": 1250, // MB transferidos
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

let totalDatosTransferidos = 0;
let horaMayorTrafico = "";
let mayorTrafico = 0;
for (let hora in traficoRed){
    let megabytes = traficoRed[hora];
    totalDatosTransferidos += megabytes;
    
    if (megabytes>mayorTrafico){
        mayorTrafico = megabytes;
        horaMayorTrafico = hora;
    }
}

console.log("El total de los datos transferidos es: ",totalDatosTransferidos," megabytes");
console.log("La hora con mayor trafico es ",horaMayorTrafico," con ",mayorTrafico," megabytes");
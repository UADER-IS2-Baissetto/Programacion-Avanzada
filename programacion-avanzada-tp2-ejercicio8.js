//8) Dado un array de alertas de seguridad de red, filtra las que sean de nivel "alto" y
//transfórmalas en mensajes para el administrador.

const alertas = [
    {tipo:"Malware", nivel:"alto"},
    {tipo:"Pishing", nivel:"medio"},
    {tipo:"Spam", nivel:"bajo"},
    {tipo:"Ataque Ddos", nivel:"alto"},
    {tipo:"Hackeo", nivel:"alto"}
]

const alertasFiltradas = alertas.filter(alerta => alerta.nivel=="alto");
for (let alerta in alertasFiltradas){
    console.log("ALERTA DE ALTO NIVEL:", alertasFiltradas[alerta].tipo)
}
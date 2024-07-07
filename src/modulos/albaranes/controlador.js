const db = require("../../DB/msqlsrv");

const TABLA = 'CabeceraAlbaran'
const TABLADETALLES = 'DetallesAlbaran'

function todos(){
    return db.todos(TABLA);
}

function todosDetalles(){
    return db.todos(TABLADETALLES);
}

function uno(columna,id){
    return db.uno(TABLA, columna ,id);
}

function unoDetalles(columna,id){
    return db.uno(TABLADETALLES, columna ,id);
}


async function agregar(body){
    NAlbaran = await db.obtenerUltKey( "NAlbaran",TABLA, "AñoAlbaran", body.AñoAlbaran, "NAlbaran");
    console.log(NAlbaran);


    // Obtener el valor actual de NAlbaran del primer objeto en el arreglo
    let valorActual = NAlbaran[0]?.NAlbaran;

    // Verificar si valorActual no es un número válido
    if (!valorActual || isNaN(parseInt(valorActual, 10))) {
        valorActual = 1; // Asignar 1 si valorActual es undefined, NaN o no es un número válido
    } else {
        valorActual = parseInt(valorActual, 10) + 1; // Sumar 1 al valor actual de NAlbaran
    }
    console.log(valorActual);

    return db.agregar(TABLA, body,"NAlbaran", valorActual);
}



async function agregarDetalles(body){

    //Ver la cantidad de detalles hay, y sumar cada linea
    NAlbaran = await db.obtenerUltKey( "NAlbaran",TABLA, "AñoAlbaran", body.AñoAlbaran, "NAlbaran");
    console.log(NAlbaran);


    // Obtener el valor actual de NAlbaran del primer objeto en el arreglo
    let valorActual = NAlbaran[0]?.NAlbaran;

    // Verificar si valorActual no es un número válido
    if (!valorActual || isNaN(parseInt(valorActual, 10))) {
        valorActual = 1; // Asignar 1 si valorActual es undefined, NaN o no es un número válido
    } else {
        valorActual = parseInt(valorActual, 10) + 1; // Sumar 1 al valor actual de NAlbaran
    }
    console.log(valorActual);

    // Crear un nuevo objeto sin el atributo "detalles"
    const { detalles, ...sinDetalles } = body;

    return db.agregar(TABLA, sinDetalles ,"NAlbaran", valorActual);



}

function eliminar(columna, valor){
    return db.eliminar(TABLA, columna, valor);
}

module.exports = {
    todos,
    uno,
    todosDetalles,
    unoDetalles,
    agregar,
    eliminar
}
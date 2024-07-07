const mssql = require('mssql');
const config = require("../config");

const dbconfig = {
    server: config.msqlsrv.server,
    user: config.msqlsrv.user,
    password: config.msqlsrv.password,
    database: config.msqlsrv.database,
    options: {
        encrypt: false, // Desactivar encriptación SSL/TLS
        trustServerCertificate: true, // Solo para pruebas locales
    }
};

let conexion;


async function conMsqlsrv() {
    try {

        conexion = await mssql.connect(dbconfig);
        console.log('Conexión establecida correctamente a SQL Server.');

    } catch (err) {
        // Capturar errores de conexión
        console.log('[db err]', err);
        setTimeout(conMsqlsrv, 2000); // Reintentar conexión después de 2 segundos
    }

}

conMsqlsrv();

function todos(tabla){
    return new Promise((resolve, reject) => {
        conexion.request().query(`SELECT * FROM ${tabla}`, (error, result) =>{
            return error ? reject (error) : resolve(result);
        })
    })
}

function uno(tabla, columna, id) {
    console.log(columna, id);
    return new Promise((resolve, reject) => {
        conexion.request().query(`SELECT * FROM ${tabla} WHERE ${columna} = ${id}`, (error, result) => {
            return error ? reject (error) : resolve(result.recordset);
        });
    });
}

function insertar(tabla, data, key, value){
    return new Promise((resolve, reject) => {
        const columns = Object.keys(data).join(', ');

        const values = Object.values(data).map(value => {
            if (value instanceof Date) {
                return value; // Deja que SQL Server maneje el parámetro de fecha
            } else if (typeof value === 'string') {
                return `'${value}'`; // Cadenas rodeadas por comillas simples
            } else {
                return value; // Números u otros tipos sin comillas
            }
        }).join(', ');

        const query = `INSERT INTO ${tabla} (${key}, ${columns}) VALUES ('${value}', ${values})`;
        // Imprimir la consulta con los parámetros
        console.log('Ejecutando consulta:', query);
        console.log('Con columnas:', values);

        //return verificarTipoDatos(query, data);
        
        conexion.request().query(`INSERT INTO ${tabla} (${key}, ${columns}) VALUES ('${value}', ${values})`, (error, result) => {
            return error ? reject (error) : resolve(result);
        });
        
    });

}

function actualizar(tabla, data){

    const setClause = Object.keys(data)
    .filter(key => key !== 'NAlbaran' && key !== 'AñoAlbaran' && key !== 'Tipo')
    .map(key => `${key} = @${key}`)
    .join(', ');

    const whereClause = `NAlbaran = @NAlbaran AND AñoAlbaran = @AñoAlbaran AND Tipo = @Tipo`;

    const query = `UPDATE ${tabla} SET ${setClause} WHERE ${whereClause}`;

    return verificarTipoDatos(query, data);

    /*
    return new Promise((resolve, reject) => {
        conexion.request().query(`UPDATE ${tabla} SET ? WHERE NAlbaran = ? AND AñoAlbaran = ? AND  Tipo = ?`, [data, data.NAlbaran, data.AñoAlbaran, data,Tipo], (error, result) => {
            return error ? reject (error) : resolve(result);
        });
    });
    */
}

function agregar(tabla, data, key, value){
    // Ejemplo de cómo verificar si existe data.NAlbaran en el arrayDeObjetos

    if(data && (value != 0 ) ){

        console.log("---->------>->");
        console.log(value);
        console.log("---->------>->");


        return insertar(tabla, data, key, value);
    }else{
        //return actualizar(tabla,data);
    }
}

function eliminar(tabla, columna, valor){
    const request = new mssql.Request(conexion);
    request.input('valor', mssql.VarChar, valor);  // Ajusta el tipo de dato según sea necesario
    const query = `DELETE FROM ${tabla} WHERE ${columna} = @valor`;
    
    request.query(query, (error, result) => {
        if (error) {
            return reject(error);
        }
        resolve(result);
    });

    /*
    return new Promise((resolve, reject) => {
        conexion.request().query(`DELETE FROM ${tabla} WHERE ${columna} = ?`, data.${columna}, (error, result) => {
            return error ? reject (error) : resolve(result);
        });
    });
    */
}

function verificarTipoDatos(query, params){
    return new Promise((resolve, reject) => {
        const request = new mssql.Request(conexion);

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] instanceof Date) {
                    request.input(key, mssql.DateTime, params[key]);
                } else if (typeof params[key] === 'number') {
                    request.input(key, mssql.Int, params[key]);
                } else {
                    request.input(key, mssql.VarChar, params[key]);
                }
            });
        }

        conexion.request().query(query, (error, result) => {
            return error ? reject (error) : resolve(result);
        });
    });
}

function obtenerUltKey( columna, tabla, condicion, valor, ordenado) {
    return new Promise((resolve, reject) => {
        conexion.request().query(`SELECT  TOP 1 ${columna} FROM ${tabla} WHERE ${condicion} = ${valor} ORDER BY ${ordenado} DESC;`, (error, result) => {
            return error ? reject (error) : resolve(result.recordset);
        });
    });
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    obtenerUltKey,
}


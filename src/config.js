require('dotenv').config();

module.exports = {
    app:{
        port: process.env.PORT || 4000,
    },
    msqlsrv:{
        server: process.env.SQLSRV_SERVER || 'localhost',
        user: process.env.SQLSRV_USER || 'api_connect',
        password: process.env.SQLSRV_PASSWORD || '',
        database: process.env.SQLSRV_DB || 'eurotaller',

    },
}
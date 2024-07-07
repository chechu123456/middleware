const express = require('express');
const config = require('./config');
const morgan = require('morgan');

const albaranes = require("./modulos/albaranes/rutas");
const error = require('./red/errors');

const app = express();

//Middleware
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Configuración
app.set('port', config.app.port)

//rutas
app.use("/api/albaranes", albaranes)
app.use(error)

module.exports = app;
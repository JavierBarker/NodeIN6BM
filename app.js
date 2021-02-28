'use strict'

//Variables Globales
const express = require("express");
const app = express();

const bodyParser = require("body-parser")//permite parsear los datos a JASON y que nos permita mandar los datos de una manera correcta
const cors = require("cors")


//IMPORTACION RUTAS
const usuario_ruta = require("./src/routes/usuario.rutas");
const encuesta_ruta = require("./src/routes/encuesta.rutas");

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())//parsea los datos que llegan a formato json

//CABECERAS
app.use(cors());

//CARGA DE RUTAS
app.use('/api', usuario_ruta, encuesta_ruta);

//Exportar
module.exports = app;
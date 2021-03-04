'use strict'

const express = require("express");
const encuestaControlador = require("../controllers/encuesta.controlador");
const md_autenticacion = require("../middlewares/authenticated");

const api = express.Router();

api.post('/agregarEncuesta', md_autenticacion.ensureAuth, encuestaControlador.agregarEncuesta);

api.get('/obtenerEncuestas', md_autenticacion.ensureAuth, encuestaControlador.obtenerEcuestas);

api.put('/agregarComentario/:idEncuesta', md_autenticacion.ensureAuth, encuestaControlador.agregarComentarioEncuesta);

api.put('/editarComentario/:idEncuesta/:idComentario', md_autenticacion.ensureAuth, encuestaControlador.editarComentarioEncuesta);

api.get('/obtenerComentario/:idEncuesta/:idComentario', md_autenticacion.ensureAuth, encuestaControlador.obtenerComentario)

api.delete('/eliminiarComentario/:idComentario', md_autenticacion.ensureAuth, encuestaControlador.eliminarComentario);

api.post('/obtenerComentarioforTexto', md_autenticacion.ensureAuth, encuestaControlador.obtenerComentarioforTexto);
module.exports = api;
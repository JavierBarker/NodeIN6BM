'use strict'

//IMPORTACIONES
const express = require("express");
const usuarioControlador = require("../controllers/usuario.controlador")

//MIDDLEWARES
var md_autenticacion = require("../middlewares/authenticated");

//RUTAS
var api = express.Router();
//api.get('/ejemplo', usuarioControlador.ejemplo);
api.get('/ejemplo', md_autenticacion.ensureAuth, usuarioControlador.ejemplo);//el md_autenticacion es para autenticar si estamos logeados o no

api.post('/registrarUsuario', usuarioControlador.registrar);

api.get('/obtenerUsuarios', usuarioControlador.obtenerUsuarios);

api.get('/obtenerUsuarioId/:idUsuario', usuarioControlador.obtenerUsuarioID);//asi se pone para crear variables y enviarlas

api.post('/login', usuarioControlador.login);

api.put('/editarUsuario/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarUsuario);

api.delete('/eliminarUsuario/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarUsuario);
module.exports = api;
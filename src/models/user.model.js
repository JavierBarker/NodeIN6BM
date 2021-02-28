const mongoose = require("mongoose");
var Schema = mongoose.Schema; //el esquema es como se va a organizar el modelo
/*
var UsuarioSchema = Schema({
    email: String,
    password: String,
    hobbies: [], //tipo array
    activo: Boolean,
    edad: Number
})

module.exports = mongoose.model('Usuarios', UsuarioSchema) //si no se exporta, no se puede usar afuera*/

var UsuarioSchema = Schema({//se modifico
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    rol: String,
    imagen: String
})

module.exports = mongoose.model('Usuarios', UsuarioSchema)
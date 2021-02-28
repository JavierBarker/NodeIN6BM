'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var EncuestaSchema = Schema({//una tabla dentro de una tabla
    titulo: String,
    descripcion: String,
    opinion: {
        si: Number,
        no: Number,
        ninguna: Number,
        usuariosEncuestados: []
    },
    listaComentarios: [{//subdocumento
        textoComentario: String,
        idUsuarioComentario: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
    }],
    creadorEncuesta: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
})

module.exports = mongoose.model('Encuestas', EncuestaSchema);
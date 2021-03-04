'use strict'
const Encuesta = require('../models/ecuesta.model');
const { options } = require('../routes/encuesta.rutas');

function agregarEncuesta(req, res) {
    var params = req.body;
    var encuestaModel = new Encuesta();//se llama para poder agregar

    if (params.titulo && params.descripcion){//esos son los datos necesarios para crear una encuesta
        //datos obligatorios al momento de crear la encuesta
        encuestaModel.titulo = params.titulo;
        encuestaModel.descripcion = params.descripcion;

        //datos en cero, no se le añaden datos hasta que alguien opine o alguien externo agregue informacion
        encuestaModel.opinion = {
            si: 0,
            no: 0,
            ninguna: 0,
            usuariosEncuestados: []
        };
        encuestaModel.creadorEncuesta = req.user.sub;

        encuestaModel.save((err, encuestaGuardada)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion Encuesta'});
            if (!encuestaGuardada) return res.status(500).send({mensaje: 'Error al agregar Encuesta'});
        
            return res.status(200).send({encuestaGuardada});
        });
    }else{
        res.status(500).send({
            mensaje: 'Rellene los datos necesarios para crear la Encuesta'
        })
    }
}

function obtenerEcuestas(req, res) {
    //lo que esta dentro del find es para indicar que datos quiero que vengan y que datos no quiero que vengan en la peticion
    //el 0 es para que no me lo traiga y el 1 es para que si me lo traiga
    //los primeros corchetes vacios identifican las peticiones a la base de datos, como un filtrado 
    //Regex: el Regex es para distinguir entre mayúsculas y minúsculas 
    //$options: 'i', esto me sirve para indicarle que tipo de opcion le dare de busqueda, y la letra "i" es para el case insensitive

    //en conclusion, sirve como filtrado los primeros corchetes y los otros regex y options ayudan para las busquedas
    //un buscador
    Encuesta.find({ titulo: {$regex: 'Opinion sobre Kinal 100', $options: 'i'}}, { listaComentarios: 0 }).populate('creadorEncuesta', 'nombre email').exec((err, encuestasEncontradas)=>{//el populate, me trajo los datos del usuario, y al agregar mas parametros, indico que campos quiero que muestre
        if (err) return res.status(500).send({mensaje: 'Error en la peticion de Encuestas'});
        if (!encuestasEncontradas) return res.status(500).send({mensaje: 'Error al obtener las encuestas'});
        return res.status(200).send({encuestasEncontradas});
    })
}

function agregarComentarioEncuesta(req, res) {
    var encuestaID = req.params.idEncuesta;//id de la encuesta a la cual quiero agregar el comentario
    var params = req.body;
                                        //                              se pone llaves por que es un objeto el que voy a enviar
    Encuesta.findByIdAndUpdate(encuestaID, {$push: {listaComentarios: { textoComentario: params.comentario, idUsuarioComentario: req.user.sub }}},
        {new: true, useFindAndModify: false}, (err, comentarioAgregado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del comentario'});
            if (!comentarioAgregado) return res.status(500).send({ mensaje: 'Erroral agregar el comentario en la encuesta'});
            return res.status(200).send({comentarioAgregado});
        })
}

function editarComentarioEncuesta(req, res) {
    var encuestaID = req.params.idEncuesta;
    var comentarioID = req.params.idComentario;
    var params = req.body;
                                                                                        //el signo de dolar es para indicar que va a editar un solo parametro
    Encuesta.findOneAndUpdate({ _id: encuestaID, "listaComentarios._id": comentarioID, "listaComentarios.idUsuarioComentario": req.user.sub/*esto es para verificar si el usuario es el mismo usuario del comentario*/}, 
    { "listaComentarios.$.textoComentario": params.comentario},
    {new: true, useFindAndModify: false}, (err, comentarioEditado) =>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion del comentario', err});
        if (!comentarioEditado) return res.status(500).send({ mensaje: 'Error al editar el comentario en la encuesta'});
        return res.status(500).send({comentarioEditado});
    })
}

function obtenerComentario(req, res) {
    var encuestaID = req.params.idEncuesta;
    var comentarioID = req.params.idComentario;
                                                                              //es una proyeccion, el 1, me va a mostrar lo que quiero, el 0 no me lo muestra
    Encuesta.findOne({_id: encuestaID, "listaComentarios._id": comentarioID}, {"listaComentarios.$": 1, titulo: 1}, (err, comentarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Encuestas', err});
        if (!comentarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el comentario en la encuesta'});
        return res.status(500).send({comentarioEncontrado});
    })
}

function eliminarComentario(req, res) {
    var idComentario = req.params.idComentario;

    Encuesta.findOneAndUpdate({"listaComentarios._id": idComentario}, {$pull: {listaComentarios: {_id: idComentario}}}
    ,{new: true, useFindAndModify: false}, (err, comentarioEliminado) =>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Comentario', err});
        if (!comentarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el Comentario'});
        return res.status(200).send({comentarioEliminado});
    })
}

/*function obtenerComentarioPorTexto(req, res) {
    var bodyTextoComentario = req.body.textoComentario;
                                            //el regex es para buscar y filtrar algo     El options es para distinguir mayusculas
    Encuesta.find({"listaComentarios.textoComentario": {$regex: bodyTextoComentario, $options: 'i' } }, {"listaComentarios.$": 1}, (err, encuestasEncontradas) =>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Comentario', err});
        if (!encuestasEncontradas) return res.status(500).send({ mensaje: 'Error al Obtener los Comentarios'});
        return res.status(200).send({encuestasEncontradas});
    }).populate('listaComentarios.idUsuarioComentario')
}*/
/*
function obtenerComentarioPorTexto(req, res) {
    var textoComentario ​ = req.body.textoComentario;

    Encuesta.aggregate([

        {​​
        
        $unwind: "$listaComentarios"
        
        }​​,
        
        {​​
        
        $match: {​​"listaComentarios.textoComentario": {​​$regex: textoComentario, $options: 'i'}​​}​​
        
        }​​,
        
        {​​
        
        $group: {​​"_id": "$_id", "listaComentarios": {​​$push: "$listaComentarios"}​​}​​
        
        }​​
        
        ]).exec((err, resp) => {​​
        
        res.send(resp)
        
        }​​);

}*/
function obtenerComentarioforTexto(req, res) {
    var textoComentario = req.body.textoComentario;
    Encuesta.aggregate([{$unwind: "$listaComentarios"}, {$match: {"listaComentarios.textoComentario":{$regex: textoComentario, $options: 'i'}}}, {$group: {"_id": "$_id", "listaComentarios": {$push: "$listaComentarios"}}}]).exec((err, resp) =>{
        //if (err) return res.status
        return res.status(200).send({resp});
    })
}

module.exports = {
    agregarEncuesta,
    obtenerEcuestas,
    agregarComentarioEncuesta,
    editarComentarioEncuesta,
    obtenerComentario,
    eliminarComentario,
    obtenerComentarioforTexto
}

//lol
//{​​​​new: true, useFindAndModify: false}​​​​
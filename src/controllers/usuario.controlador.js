'use strict'
//IMPORTACIONES
const Usuario = require("../models/user.model");//los dos puntos es para salirse de una carpeta
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');

//FUNCION EJEMPLO
/*
function ejemplo(req, res) {
    res.status(200).send({mensaje: 'hola, soy un ejemplo!'})
}*/
function ejemplo(req, res) {
    res.status(200).send({mensaje: `hola, mi nombre es ${req.user.nombre + ' - ' +req.user.email}`})//req.user es el que tiene el payload, esta en el authenticated
}

function registrar(req, res) {
    var usuarioModel = new Usuario()
    var params = req.body; 
    //el params es para que todos los datos que envie dentro del cuerpo de datos los añada a nuestro modelo
    //son los datos que van a venir, no los de la base de datos
    if (params.usuario && params.email && params.password) {
        usuarioModel.nombre = params.nombre;//aqui mando a la base de datos (usuarioModel.nombre) el nombre que viene de params.nombre
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        usuarioModel.rol = 'ROL_USUARIO';
        usuarioModel.imagen = null;

        Usuario.find({ $or:[//significa que puede cumplir uno u otro
            { usuario: usuarioModel.usuario },// busca y verifica si existe ese usuario en la base de datos
            { email: usuarioModel.email }// busca y verifica si existe ese email en la base de datos
        ]}).exec((err, usuariosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del usuario'})
            if (usuariosEncontrados && usuariosEncontrados.length >= 1){
                return res.status(500).send({ mensaje: 'El usuario ya existe' })
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) =>{//llamamos la variable y usamos hash que es para encriptar, y le mandamoe el dato a encriptar
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) =>{
                        if (err) return res.status(500).send({ mensaje: 'Error al guardar Usuario'}) 
                        if (usuarioGuardado) {
                            res.status(200).send(usuarioGuardado)
                        }else{
                            res.status(404).send({ mensaje: 'No se ha podido registrar el Usuario'})
                        }
                    })
                })
            }
        })
    }
}

function obtenerUsuarios(req, res) {
    Usuario.find((err, usuariosEncontrados) =>{
        if (err) return res.status(500).send({mensaje: 'Error en la peticion de Obtener Usuarios'})
        if (!usuariosEncontrados) return res.status(500).send({mensaje: 'Error en la consulta Usuario'})
        //usuariosEncontrados === [datos] || !usuariosEncontrados === [] <-- no trae nada
        return res.status(200).send({usuariosEncontrados})
        

    })
}

function obtenerUsuarioID(req, res) {
    var idUsuario = req.params.idUsuario//el de params no es la misma variable
    //User.find({ _id: idUsuario}, (err, usuarioEncontrado)=>{}) <---- Me retorna un Array = [] || usuarioEncontrado[0].nombre
    //User.findOne <--- Me retorna un objeto = {} || usuarioEncontrado.nombre
    Usuario.findById(idUsuario, (err, usuarioEncontrado) =>{
        if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'})
        if(!usuarioEncontrado) return res.status(500).send({mensaje: 'Error en obtener los datos del Usuario'})
        console.log(usuarioEncontrado.email, usuarioEncontrado.usuario)
        return res.status(200).send({usuarioEncontrado})
    })
}
  
function login(req, res) {
    var params = req.body;//traemos el cuerpo de datos
    Usuario.findOne({ email: params.email}, (err, usuarioEncontrado)=>{
        if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
        
        if(usuarioEncontrado){                                            //puede ser true o false el passCorrecta
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta)=>{// debe de ser un correo con una contraseña encriptada
                if (passCorrecta) { 
                    if (params.obtenerToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        })
                    }else{
                        usuarioEncontrado.password = undefined;//elimina la contraseña, no la muestra
                        return res.status(200).send({usuarioEncontrado});
                    }
                }else{
                    return res.status(404).send({mensaje: 'El Usuario no se ha podido identificar', err});
                }
                
            })
        }else{
            return res.status(404).send({mensaje: 'El usuario no se ha podido ingresar'});
        }
    })
}

function editarUsuario(req, res) {//esto edita mi propio usuario
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    //borrar la propiedad de password para que no se pueda editar
    delete params.password;
    //req.user es del authenticated y pasa por ese middleware y ahi se guarda el usuario logeado
    if (idUsuario != req.user.sub) {
        return res.status(500).send({mensaje: 'No posees los permisos nescesarios para editar este Usuario.'});

    }                                          //es para que retorne los datos nuevos ya actualizados
    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) =>{//los params, son los datos que uno desea modificar, cualquier campo
        if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if (!usuarioActualizado) return res.status(500).send({mensaje: 'No se ha podido Actualizar al Usuario'});
        //usuarioActualizado.password = undefined;//para eliminar la contraseña en la respuesta
        return res.status(200).send({usuarioActualizado});
    })
}

function eliminarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;

    if (idUsuario != req.user.sub) {
        return res.status(500).send({mensaje: 'No posees los permisos nescesarios para editar este Usuario.'});
    } 
    Usuario.findByIdAndRemove(idUsuario, (err, usuarioEliminado) =>{
        if (err) return res.status(500).send({mensaje: 'Error en la peticion de Eliminar'});
        if (!usuarioEliminado) return res.status(500).send({mensaje: 'Error al elimnar el usuario'});
        return res.status(200).send({usuarioEliminado});
    })
}

module.exports = {
    ejemplo,
    registrar,
    obtenerUsuarios,
    obtenerUsuarioID,
    login,
    editarUsuario,
    eliminarUsuario
}
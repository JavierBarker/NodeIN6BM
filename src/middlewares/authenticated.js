'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta_IN6BM'

exports.ensureAuth = function (req, res, next) {//este es el middleware que vamos a utilizar para identificar si trae el token o no lo trae
    //con esa variable next es para que cuando cumpla el middleware, continue con lo que sigue
    if (!req.headers.authorization) {//el authorization es para lo del token, si quiere entrar a una ruta, necesita el token, y para eso es el authorization
        return res.status(401).send({mensaje: 'La peticion no tiene la cabecera de Autorizacion'})

    }
    var token = req.headers.authorization.replace(/['"]+/g, '')//entra a la cabecera y remplaza lo que hay
    //con esta expresion regular, busca en los datos que encuentre, con eso lo remplace
    //lo que esta entre corchetes es lo que va a buscar, y va a agregar globalmente (g, remplazar) un dato vacio con las comillas simples
    try {
        var payload = jwt.decode(token, secret)//decode es decodificar el token, con esto vamos a averiguar si trae algo el token, 
        //y si lo podemos desencriptar con la clave secreta
        //exp = variable que contiene el tiempo de expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                mensaje: 'El Token ha expirado'
            });
        }
    } catch (error) {
        return res.status(404).send({
            mensaje: 'El Token no es valido'
        })
    }

    req.user = payload;//cuando se esta usando voy a poder acceder a los datos del 
    //usuario que se encuentra logeado 
    next();
}
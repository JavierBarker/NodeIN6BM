'use strict'
//aqui creamos el token
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_IN6BM';//tiene que ser la misma al del authenticated.js


exports.createToken = function (usuario) {
    var payload = {
        sub: usuario._id,//almacena el id del dato que vamos a enviar 
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        email: usuario.email,
        rol: usuario.rol,
        imagen: usuario.imagen,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()//le decimos que a partir de aqui tome 10 dias a partir de ese momento
        //y a partir de eso el token ya no se va a poder utilizar
    }//aqui dependera que datos quiero enviar, no necesariamente todos los tengo que enviar

    return jwt.encode(payload, secret);
}

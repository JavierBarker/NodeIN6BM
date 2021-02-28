'use strict'
//const express = require("express");
const mongoose = require("mongoose")
const app = require('./app')
/*const app = express();
const Usuario = require("./src/models/user.model")

app.get('/obtenerUsuarios', (req, res)=>{
    Usuario.find((err, usuariosObtenidos) =>{
        console.log(usuariosObtenidos);
        return res.status(200).send({usuarios: usuariosObtenidos})//el 200 significa que funciono
    })
})*/



mongoose.Promise = global.Promise;//las promesas son funciones
//que prometen que se va a hacer pero no promete que lo cumplira, ya 
//dependera si lo hice bien
mongoose.connect('mongodb://localhost:27017/EjemploDB', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('se encuentra conectado a la base de datos');

    app.listen(3000, function (){
        console.log('El servidor esta corriendo en el puerto: 3000');
    })
    
}).catch(err => console.log(err))

/*app.post('/kinal', (req, res) => {
    console.log("trabajo bien hecho");
})*/


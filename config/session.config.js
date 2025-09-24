const session = require('express-session') //usa la ram del browser


const MongoStore = require("connect-mongo") // se importa como una clase

const mongoose = require('mongoose')

module.exports = app => {      //funcion que espera app como argumento (en app.js hacer require(..ruta)(app))
    app.use(
        session({
            secret: process.env.SESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 60000 },
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI, //le dice a connect mongo conectate a la base de datos definida en .env bajo la variable MONGODB_URI y guarda las sesiones
                ttl: 60 * 60 * 24
            })
        })
    );
};

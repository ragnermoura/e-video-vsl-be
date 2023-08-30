const http = require('http');
const app = require('./app')
require('dotenv').config()
const conn = require('./db/conn')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const {Server} = require("socket.io")
const socketContent = require('./socket')

const io = new Server(server, {
    path: '/socket', 
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
})

conn.sync().then(() => {

    server.listen(port);
    console.log('foi iniciado na porta' + port)

    io.on("connection", (socket) => socketContent(socket, io))
    

   }).catch((err) => console.error(err)); 
const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const ContenedorMemoria = require('../contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('../contenedores/ContenedorArchivo.js')
const productosApi = require('../contenedores/ContenedorMemoria.js')
//--------------------------------------------
// instancio servidor, socket y api
const app = express();
const productoApi = new productosApi();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const mensajes = []



app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

//--------------------------------------------
// configuro el socket

io.on('connection', async socket => {
    console.log('Cliente conectado')
    
    socket.emit('productos',    
        productoApi
    );

    socket.on('nuevoProducto', data => {
        console.log(data);
        productoApi.guardar(data);
        const prod = productoApi.listarAll();
        io.sockets.emit('productos', prod);
    });

    socket.emit('mensajes', mensajes);

    socket.on('nuevoMensaje', data => {
        mensajes.push(data)
        //Este evento envía un nuevo mensaje a todos los clientes que estén conectado en ese momento
        io.sockets.emit('mensajes', mensajes);
    });


   
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

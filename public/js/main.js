const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault() 
    let producto = {
        title : document.getElementById('nombre').value,
        price :document.getElementById('precio').value,
        thumbnail : document.getElementById('foto').value
    };
    socket.emit("nuevoProducto" , producto);
   // formAgregarProducto.reset();
    //Armar objeto producto y emitir mensaje a evento update
})

socket.on('productos', async (productos) => {
    const html = await makeHtmlTable(productos);
    document.getElementById('productos').innerHTML = html;
    //generar el html y colocarlo en el tag productos llamando al funcion makeHtmlTable
});

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    const  nuevoMensaje = {
        autor : inputUsername.value,
        mensaje : inputMensaje.value
    }
    socket.emit("nuevoMensaje", nuevoMensaje)
    //Armar el objeto de mensaje y luego emitir mensaje al evento nuevoMensaje con sockets
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('mensajes', mensajes => {
    console.log(mensajes);
    const html = makeHtmlList(mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    return mensajes.map(elem => {
        return (`<div><strong>${elem.autor}</strong>:<em>${elem.mensaje}</em></div>`)
    }).join(" ");
    
    //Armar nuestro html para mostrar los mensajes como lo hicimos en clase
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})

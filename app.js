const stockProductos = [];
let carrito = [];

const contenedor = document.querySelector('#contenedor'),
  carritoContenedor = document.querySelector('#carritoContenedor'),
  vaciarCarrito = document.querySelector('#vaciarCarrito'),
  precioTotal = document.querySelector('#precioTotal'),
  procesarCompra = document.querySelector('#procesarCompra'),
  activarFuncion = document.querySelector('#activarFuncion'),
  totalProceso = document.querySelector('#totalProceso'),
  formulario = document.querySelector('#procesar-pago')

  if(activarFuncion){
  activarFuncion.addEventListener('click', procesarPedido)
  }

  if(formulario){
    formulario.addEventListener('submit', enviarPedido)
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    carrito = JSON.parse(localStorage.getItem('carrito')) || []
    mostrarCarrito()

    if(activarFuncion){
    document.querySelector('#activarFuncion').click(procesarPedido)
    }

})

function renderServicios(arr){
  for(const item of arr){
    contenedor.innerHTML += `
    <div class="card mt-3" style="width: 18rem;">
    <img class="card-img-top mt-2" src="${item.img}" alt="Card image cap">
    <div class="card-body">
    <h5 class="card-title">${item.nombre}</h5>
    <p class="card-text">Precio: $${item.precio}</p>
    <p class="card-text">Descripcion:${item.desc}</p>
    <p class="card-text">Cantidad:${item.cantidad}</p>     
  
    <button class="btn btn-primary btn-card" onclick="agregarProducto(${item.id})">Agregar Producto</button>
    </div>
    </div>
    `
    stockProductos.push(item)
}}

//CONEXION A ARCHIVO JSON
 
fetch('datos/datos.json')
.then(res=>res.json())
.then(data=>{
  renderServicios(data)
})

if(procesarCompra){
procesarCompra.addEventListener('click', ()=>{
  if(carrito.length ===0){
    Swal.fire({
          title: "¡Tu carrito está vacio!",
          text: "Compra algo para continuar con la compra",
          icon: "error",
          confirmButtonText: "Aceptar",
          })
  }else{
      location.href = "compra.html"  
  }

})
}

if(vaciarCarrito){
vaciarCarrito.addEventListener('click',()=>{
  carrito.length = []
  mostrarCarrito()
})
}

function agregarProducto(id){

  const existe = carrito.some(prod => prod.id === id)

  if(existe){
    const prod = carrito.map(prod=>{
      if(prod.id ===id){
        prod.cantidad++
      }
    })
  }else{
    
    const item = stockProductos.find((prod)=> prod.id ===id)
    carrito.push(item)

  }
  
  mostrarCarrito()
}

const mostrarCarrito = ()=>{
  const modalBody =document.querySelector('.modal .modal-body')
  if(modalBody){
  modalBody.innerHTML = ''
  carrito.forEach((prod)=>{
    const {id,nombre,img,desc,cantidad,precio} = prod
    modalBody.innerHTML += `
    <div class="modal-contenedor">
    <div>
    <img class="img-fluid img-carrito" src="${img}"/>
    </div>
    
    <div>
    <p>Producto: ${nombre}</p>
    <p>Precio: $${precio}</p>
    <p>Cantidad: ${cantidad}</p>

    <button onclick="eliminarProducto(${id})" class="btn btn-danger">Eliminar producto</button>
    </div>
    </div>
    `
  })
}

if(carrito.length === 0){
  modalBody.innerHTML = `
  <p class="text-center text-primary parrafo">El carrito está vacio</p>
  `
}

  carritoContenedor.textContent = carrito.length

  if(precioTotal){
  precioTotal.textContent = carrito.reduce((acc,prod)=>acc + prod.cantidad * prod.precio, 0)

  }
  guardarStorage()
}

function eliminarProducto(id){
  const prodId = id
  carrito = carrito.filter((prod)=>prod.id !== prodId)
  mostrarCarrito()
}

function guardarStorage(){
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

function procesarPedido(){

  carrito.forEach((prod)=>{
    const listaCompra = document.querySelector('#lista-compra tbody')
    const {id, nombre,precio,cantidad,img} = prod

    const row = document.createElement('tr')
    row.innerHTML += `
      <td>
      <img class="img-fluid img-carrito" src="${img}"/>
      </td>
      <td>${nombre}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td>${precio*cantidad}</td>
    `

    listaCompra.appendChild(row)
  })
  totalProceso.innerText = carrito.reduce((acc,prod)=>acc + prod.cantidad * prod.precio, 0)
}

function enviarPedido(e){
  e.preventDefault()
  const cliente = document.querySelector('#persona').value,
        correo = document.querySelector('#correo').value
  
  if(correo === '' || cliente ===''){
    Swal.fire({
      title: "Completar nombre y email",
      text: "Rellena los campos",
      icon: "error",
      confirmButtonText: "Aceptar",
    })
  }else{
     const spinner = document.querySelector('#spinner')
     spinner.classList.add('d-flex')
     spinner.classList.remove('d-none')

     setTimeout(()=>{
      spinner.classList.remove('d-flex')
      spinner.classList.add('d-none')
      formulario.reset()
     }, 3000)

     const alertExito = document.createElement('p')
     alertExito.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-md-12', 'mt-2', 'alert-success')
     alertExito.textContent = "Compra realizada correctamente"
     formulario.appendChild(alertExito)

     setTimeout(()=>{
      alertExito.remove()
     }, 3000)
     localStorage.clear()
  }
}



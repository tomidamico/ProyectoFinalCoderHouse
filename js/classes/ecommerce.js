class Ecommerce {
    constructor() {
        this.carrito = new Carrito();
        if (localStorage.carrito) {
            this.carrito.productos = JSON.parse(localStorage.carrito);
            this.carrito.totalCarrito = JSON.parse(localStorage.totalCarrito);
            this.carrito.cantidad = JSON.parse(localStorage.cantidadCarrito);
        }
        this.productos = [];
        this.cupones = [];
        this.favoritos = [];
        this.costoDeEnvio = [];
        this.formasDePago = [];
        this.lugarRetiro = [];
        this.title = "Mod Indumentaria";
    }
    async mostrarArrayProductos() {
        const response = await fetch("../productos.json")
        this.productos = await response.json();
        let acumular = ``;
        this.productos.forEach(producto => {
            acumular += `
            <div class="card" style="width: 18rem;">
                <img class="card-img-top" src="${producto.img}" alt="${producto.title}">
                <div class="card-body">
                    <h5 class="card-title">${producto.title}</h5>
                    <h6>Precio: $${producto.price}</h6>
                    <button data-idproducto="${producto.id}" class="btn btn-secondary btn-agregar-carrito">Agregar al Carrito</button>
                </div>
            </div>`
        });
        document.getElementById("cards").innerHTML = acumular;
        this.cargarBotones();
    }

    mostrarCarrito() {
        let acumular = ``;
        let descripcion = ``;
        this.carrito.productos.forEach(producto => {
            acumular += `
            <div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${producto.title}</h5>
                            <h6>Precio: $${producto.price}</h6>
                            <button id="card" data-idproducto="${producto.id}" class="btn btn-dark btn-eliminar-carrito">Eliminar del Carrito</button>
                        </div>
                    </div>
                </div>
            </div>`
        });
        descripcion = `
        <h3>El total del pedido es de: $${this.carrito.totalCarrito}</h3>
        <h4>Hay ${this.carrito.cantidad} elemento/s en el carrito</h4>
        <button class="btn btn-primary btn-lg col-12" onclick="miTienda.procesarPago()">Ir a Pagar</button>`
        $('#carrito').html(acumular);
        $('#desc-carrito').html(descripcion);
        this.cargarBotones();
    }
    
    cargarBotones() {
        const arrayDeBotonesAgregar = Array.from(document.getElementsByClassName('btn-agregar-carrito')) // Conversion Array
        arrayDeBotonesAgregar.forEach(boton => {
            boton.onclick = (event) => {
                const responsableID = event.target.getAttribute("data-idproducto");
                this.agregarAlCarrito(responsableID)
            }
        })
        const arrayDeBotonesEliminar = Array.from(document.getElementsByClassName('btn-eliminar-carrito')) // Conversion Array
        arrayDeBotonesEliminar.forEach(boton =>{
            boton.onclick = (event) => {
                const responsableID = event.target.getAttribute("data-idproducto");
                this.borrarDelCarrito(responsableID);
            }
        })
    }
    ordenarArrayProductos() {
        this.productos.sort((producto1, producto2) => producto1.price - producto2.price);
    }
    agregarAlCarrito(id) {
        const productoAAgregar = this.productos.find(producto => producto.id == id);
        this.carrito.agregarProducto(productoAAgregar);
        this.carrito.calcularTotal();
        this.carrito.cantidadDeElementos();
    }
    borrarDelCarrito(id) {
        this.carrito.eliminarDelCarrito(id);
        this.carrito.calcularTotal();
        this.carrito.cantidadDeElementos();
        this.mostrarCarrito();
    }
    async procesarPago() {
        let carrito2 = {
            "items": [{
                title : this.carrito.productos.title,
                description : ".",
                picture_url : this.carrito.productos.img,
                category_id : this.carrito.category,
                quantity : 1,
                currency_id : "ARS",
                unit_price : this.carrito.totalCarrito
            }
        ]}

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer TEST-4217619531576726-102800-f497d07e40baac6dd63bd5e3a21d054d-278559209',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carrito2)
        });
        const data = await response.json();
        window.open(data.init_point,"_blank");
        console.log(data);
    }
}
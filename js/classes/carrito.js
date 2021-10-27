class Carrito{
    constructor(){
        this.productos = [];
        this.totalCarrito = 0;
        this.cantidad = 0;
    }
    cantidadDeElementos(){
       this.cantidad = this.productos.length;
       localStorage.cantidadCarrito = JSON.stringify(this.cantidad);
    }
    
    calcularTotal(){
        this.totalCarrito = 0
        this.productos.forEach(producto => {
            this.totalCarrito += producto.price
        })
        localStorage.totalCarrito = JSON.stringify(this.totalCarrito);
    }
    agregarProducto(producto){
        this.productos.push(producto);
        localStorage.carrito = JSON.stringify(this.productos);
    }
    eliminarDelCarrito(id){
        const indice = this.productos.findIndex(producto => producto.id == id);
        this.productos.splice(indice, 1);
        localStorage.carrito = JSON.stringify(this.productos);
    }
}
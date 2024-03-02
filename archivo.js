document.addEventListener('DOMContentLoaded', () => {
    //objetos

    class Producto {
        constructor(id, nombre, precio, imagen) {
            this.id = id;
            this.nombre = nombre;
            this.precio = precio;
            this.imagen = imagen;
        }
    }

    // Variables

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;
    let productos = [];

    // Funciones

    /**
     * Dibuja todos los productos a partir de una api. 
     */
    function renderizarProductos() {
        fetch('https://maidavalencia123.000webhostapp.com/api.php')
            .then(response => response.json())
            .then(data => {
                let datos = data.productos
                productos = datos.map(producto => new Producto(producto.id, producto.nombre, producto.precio, producto.imagen, ));
                console.log('Productos cargados:', productos);
                // usa con los datos JSON
                productos.forEach((info) => {

                    const miNodo = document.createElement('div');
                    miNodo.classList.add('card', 'col-sm-4');

                    const miNodoCardBody = document.createElement('div');
                    miNodoCardBody.classList.add('card-body');

                    const miNodoTitle = document.createElement('h5');
                    miNodoTitle.classList.add('card-title');
                    miNodoTitle.textContent = info.nombre;

                    const miNodoImagen = document.createElement('img');
                    miNodoImagen.classList.add('img-fluid');
                    miNodoImagen.setAttribute('src', './imagen/' + info.imagen);

                    const miNodoPrecio = document.createElement('p');
                    miNodoPrecio.classList.add('card-text');
                    miNodoPrecio.textContent = info.precio + divisa;

                    const miNodoBoton = document.createElement('button');
                    miNodoBoton.classList.add('btn', 'btn-primary');
                    miNodoBoton.textContent = '+';
                    miNodoBoton.setAttribute('marcador', info.id);
                    miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);

                    miNodoCardBody.appendChild(miNodoImagen);
                    miNodoCardBody.appendChild(miNodoTitle);
                    miNodoCardBody.appendChild(miNodoPrecio);
                    miNodoCardBody.appendChild(miNodoBoton);
                    miNodo.appendChild(miNodoCardBody);
                    DOMitems.appendChild(miNodo);
                });
            })
            .catch(error => {
                console.error('Error al obtener el archivo JSON:', error);
            });

    }

    /**
     * funcion para añadir un elemento
     */
    function anyadirProductoAlCarrito(evento) {
        let id = evento.target.getAttribute('marcador')
        let filteredItems = productos.filter(item => item.id == id);
        swal("Producto añadido!", filteredItems[0].nombre, "success");

        carrito.push(evento.target.getAttribute('marcador'))

        renderizarCarrito();

        guardarCarritoEnLocalStorage();
    }

    /**
     *  funcion para mostrar los productos en el carrito
     */
    function renderizarCarrito() {
        //uso del DOM
        DOMcarrito.textContent = '';

        const carritoSinDuplicados = [...new Set(carrito)];

        carritoSinDuplicados.forEach((item) => {

            const miItem = productos.filter((itemProducto) => {

                return itemProducto.id === parseInt(item);
            });

            const numeroUnidadesItem = carrito.reduce((total, itemId) => {

                return itemId === item ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = numeroUnidadesItem + ' x ' + miItem[0].nombre + ' - ' + miItem[0].precio + divisa;

            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);

            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });

        DOMtotal.textContent = calcularTotal();
    }

    /**
     * FUNCION para borrar un elemento del carrito
     */
    function borrarItemCarrito(evento) {


        const id = evento.target.dataset.item;
        let filteredItems = productos.filter(item => item.id == id);
        swal("producto eliminado!", filteredItems[0].nombre, "info");

        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });

        renderizarCarrito();

        guardarCarritoEnLocalStorage();

    }

    /**
     * funcion para calcular el precio 
     */
    function calcularTotal() {

        return carrito.reduce((total, item) => {

            const miItem = productos.filter((itemProducto) => {
                return itemProducto.id === parseInt(item);
            });

            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        swal({
                title: "Esta seguro de eliminar los productos del carrito?",
                text: "una vez eliminado no se podran volver a recuperar!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    swal("Se eliminaron todos los productos!", {
                        icon: "success",
                    });

                    carrito = [];

                    renderizarCarrito();

                    localStorage.clear();
                } else {
                    swal("No se borro ningun producto del carrito!");
                }
            });


    }

    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {

        if (miLocalStorage.getItem('carrito') !== null) {

            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    DOMbotonVaciar.addEventListener('click', vaciarCarrito);


    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});
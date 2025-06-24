let carrito = [];

// Recuperar carrito del localStorage o iniciar vacío
if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  actualizarVista();
}

// Función para agregar producto al carrito
function agregarProducto(nombre, precio, cantidad) {
  const index = carrito.findIndex(item => item.nombre === nombre);

  if (index >= 0) {
    // Si producto ya está, sumamos cantidad
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, cantidad });
  }

  guardarCarrito();
  actualizarVista();
}

// Función para eliminar producto del carrito
function eliminarProducto(nombre) {
  carrito = carrito.filter(item => item.nombre !== nombre);
  guardarCarrito();
  actualizarVista();
}

// Función para actualizar la vista del carrito en la tabla
function actualizarVista() {
  const tbody = document.querySelector('#carrito tbody');
  tbody.innerHTML = '';

  carrito.forEach(item => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>$${item.precio}</td>
      <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
      <td><button class="btn-eliminar" data-nombre="${item.nombre}">Eliminar</button></td>
    `;

    tbody.appendChild(tr);
  });

  // Actualizar total
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  document.getElementById('total').textContent = total.toFixed(2);

  // Agregar eventos a botones eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', e => {
      const nombre = e.target.getAttribute('data-nombre');
      eliminarProducto(nombre);
    });
  });
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Configurar botones Agregar en productos
document.querySelectorAll('.producto').forEach(div => {
  const btn = div.querySelector('.btn-agregar');
  btn.addEventListener('click', () => {
    const nombre = div.getAttribute('data-nombre');
    const precio = Number(div.getAttribute('data-precio'));
    const cantidadInput = div.querySelector('.cantidad');
    let cantidad = Number(cantidadInput.value);

    if (cantidad < 1 || isNaN(cantidad)) {
      alert('Por favor ingresa una cantidad válida (mayor o igual a 1).');
      cantidadInput.value = 1;
      return;
    }

    agregarProducto(nombre, precio, cantidad);
    cantidadInput.value = 1;
  });
});

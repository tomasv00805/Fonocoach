

// Obtener el formulario de inicio de sesión
const loginForm = document.getElementById('loginForm');

// Agregar un evento de escucha para el envío del formulario
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los valores del formulario
    const usuario = loginForm.usuario.value;
    const contrasena = loginForm.contrasena.value;

    try {
        // Realizar la solicitud HTTP POST al backend para iniciar sesión
        const response = await fetch('http://localhost:9000/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, password: contrasena })
        });

        // Verificar si la respuesta es exitosa
        if (response.ok) {
            const data = await response.json();
            // Aquí puedes redirigir al usuario a otra página o realizar alguna otra acción
            console.log('Inicio de sesión exitoso. ID del administrador:', data.adminId);
        } else {
            const errorData = await response.json();
            console.error('Error en inicio de sesión:', errorData.message);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});

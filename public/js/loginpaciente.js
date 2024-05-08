document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el envío del formulario

    const dni = document.getElementById('dni').value;

    try {
        const response = await fetch('http://localhost:9000/api/pacientes/loginpaciente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dni })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar pacienteId en sessionStorage
            sessionStorage.setItem('pacienteId', data.pacienteId);
            // Redireccionar o hacer cualquier otra acción necesaria después del login
            window.location.href = '/dashboard'; // Redireccionar a la página de dashboard, por ejemplo
        } else {
            console.error(data.message);
            // Mostrar mensaje de error al usuario, por ejemplo
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error del servidor:', error);
        // Mostrar mensaje de error al usuario, por ejemplo
        alert('Error del servidor. Por favor, inténtelo de nuevo más tarde.');
    }
});
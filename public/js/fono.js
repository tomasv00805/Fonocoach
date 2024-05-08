// Obtener el botón de salida
const logoutBtn = document.getElementById('logoutBtn');

// Agregar un evento de clic para salir
logoutBtn.addEventListener('click', () => {
    // Limpiar el sessionStorage
    sessionStorage.removeItem('adminId');
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = './index.html';
});

// Mostrar el formulario para agregar paciente
const showAddPatientFormBtn = document.getElementById('showAddPatientFormBtn');
const addPatientForm = document.getElementById('addPatientForm');

showAddPatientFormBtn.addEventListener('click', () => {
    addPatientForm.classList.remove('hidden');
});

// Ocultar el formulario para agregar paciente
const cancelBtn = document.getElementById('cancelBtn');

cancelBtn.addEventListener('click', () => {
    addPatientForm.classList.add('hidden');
});

// Agregar paciente
const patientForm = document.getElementById('patientForm');

patientForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los valores del formulario
    const nombre = patientForm.nombre.value;
    const dni = patientForm.dni.value;
    const edad = patientForm.edad.value;
    const obraSocial = patientForm.obraSocial.value;
    const antecedentes = patientForm.antecedentes.value;

    // Obtener el ID del administrador desde sessionStorage
    const adminId = sessionStorage.getItem('adminId');

    try {
        // Realizar la solicitud HTTP POST para agregar un nuevo paciente
        const response = await fetch(`http://localhost:9000/api/pacientes/${adminId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                dni,
                edad,
                obraSocial,
                antecedentes
            })
        });

        if (response.ok) {
            // Si la respuesta es exitosa, recargar la página para actualizar el carrusel
            window.location.reload();
        } else {
            const errorData = await response.json();
            console.error('Error al agregar paciente:', errorData.message);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});

// Función para manejar la expansión de los detalles del paciente
function toggleDetails(btn) {
    console.log('Botón:', btn);
    const details = btn.nextElementSibling;
    console.log('Siguiente elemento:', details);

    // Comprobar si los detalles están expandidos
    const isExpanded = details.classList.contains('expanded');

    // Toggle de la clase 'expanded' para mostrar u ocultar los detalles
    if (isExpanded) {
        details.classList.remove('expanded');
    } else {
        details.classList.add('expanded');
    }
}

// Obtener el carrusel de pacientes
const pacienteCarousel = document.getElementById('pacienteCarousel');

// Cargar los pacientes al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el ID del administrador desde sessionStorage
    const adminId = sessionStorage.getItem('adminId');

    try {
        // Realizar la solicitud HTTP GET para obtener los pacientes del administrador
        const response = await fetch(`http://localhost:9000/api/admin/${adminId}`);

        if (response.ok) {
            const data = await response.json();
            const pacientesIds = data.pacientesCreados;

            // Limpiar el carrusel antes de agregar nuevos pacientes
            pacienteCarousel.innerHTML = '';

            // Iterar sobre cada ID de paciente y agregarlo al carrusel
            pacientesIds.forEach(async pacienteId => {
                const pacienteResponse = await fetch(`http://localhost:9000/api/pacientes/${pacienteId}`);
                if (pacienteResponse.ok) {
                    const pacienteData = await pacienteResponse.json();
                    const paciente = pacienteData.paciente;

                    const pacienteHTML = `
                        <div class="flex-none w-64 p-4 bg-gray-200 rounded-md mx-2 relative">
                        <h3 class="font-semibold text-lg mb-2">${paciente.nombre}</h3>
                        <button class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600" onclick="toggleDetails(this)">Ver Detalles</button>
                        <!-- Detalles del paciente (oculto por defecto) -->
                        <div class="paciente-details mt-4 hidden" 
                            data-nombre="${paciente.nombre}" 
                            data-dni="${paciente.dni}" 
                            data-edad="${paciente.edad}" 
                            data-obra-social="${paciente.obraSocial}" 
                            data-antecedentes="${paciente.antecedentes}">
                        </div>
                    </div>
                    `;
                    pacienteCarousel.insertAdjacentHTML('beforeend', pacienteHTML);
                } else {
                    console.error('Error al obtener detalles del paciente:', pacienteResponse.statusText);
                }
            });
        } else {
            const errorData = await response.json();
            console.error('Error al cargar pacientes:', errorData.message);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}); 

// Función para abrir el modal y llenar los detalles del paciente
function openModal(paciente) {
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    // Llenar el título del modal con el nombre del paciente
    modalTitle.textContent = `Detalles de ${paciente.nombre}`;

    // Llenar el contenido del modal con los detalles del paciente
    modalContent.innerHTML = `
        <p><strong>DNI:</strong> ${paciente.dni}</p>
        <p><strong>Edad:</strong> ${paciente.edad} años</p>
        <p><strong>Obra Social:</strong> ${paciente.obraSocial}</p>
        <p><strong>Antecedentes:</strong> ${paciente.antecedentes}</p>
        <!-- Botón para agregar una sesión adicional -->
        <button id="addSessionBtn" class="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600">Agregar Sesión</button>
    `;

    // Mostrar el modal
    document.getElementById('patientDetailsModal').classList.remove('hidden');
}

// Cerrar el modal cuando se hace clic en el botón "Cerrar"
document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('patientDetailsModal').classList.add('hidden');
});

// Función para manejar la expansión de los detalles del paciente
function toggleDetails(btn) {
    const details = btn.nextElementSibling;

    // Llamar a la función openModal cuando se hace clic en "Ver Detalles"
    openModal({
        nombre: details.dataset.nombre,
        dni: details.dataset.dni,
        edad: details.dataset.edad,
        obraSocial: details.dataset.obraSocial,
        antecedentes: details.dataset.antecedentes
    });
}



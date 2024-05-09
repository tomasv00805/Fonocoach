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
                            <button class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600" onclick="toggleDetails(this)" data-id="${paciente._id}">Ver Detalles</button>
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

                    // Obtener el botón "Agregar sesión" y guardar el ID del paciente
                    const agregarSesionBtn = document.getElementById('agregarsesionBtn');
                    agregarSesionBtn.dataset.pacienteId = paciente._id;
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
async function openModal(pacienteId) {
    try {
        const response = await fetch(`http://localhost:9000/api/pacientes/${pacienteId}`);
        if (response.ok) {
            const pacienteData = await response.json();
            const paciente = pacienteData.paciente;

            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            const sesionescontent = document.getElementById('sesionescontent')
            sesionescontent.innerHTML = '';
            // Llenar el título del modal con el nombre del paciente
            modalTitle.textContent = `Detalles de ${paciente.nombre}`;

            // Llenar el contenido del modal con los detalles del paciente y sus sesiones de juego
            modalContent.innerHTML = `
                <p><strong>Nombre:</strong> ${paciente.nombre}</p>
                <p><strong>DNI:</strong> ${paciente.dni}</p>
                <p><strong>Edad:</strong> ${paciente.edad} años</p>
                <p><strong>Obra Social:</strong> ${paciente.obraSocial}</p>
                <p><strong>Antecedentes:</strong> ${paciente.antecedentes}</p>
                <h4 class="text-lg font-semibold mb-2">Sesiones de Juego:</h4>
                <ul id="sesionesList" class="pl-4 overflow-y-auto max-h-40"> <!-- Agregando scroll vertical con Tailwind -->                    <!-- Aquí se llenarán dinámicamente las sesiones de juego -->
                </ul>
                <!-- Botón para agregar una sesión adicional -->
                <button id="addSessionBtn" class="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600" data-paciente-id="${paciente._id}" onclick="openAddSessionModal(this.dataset.pacienteId)">Agregar Sesión</button>
            `;
            
            // Obtener la lista de sesiones de juego y llenarla
            const sesionesList = document.getElementById('sesionesList');
            for (const sesionId of paciente.sesionesDeJugo) {
                const sesionResponse = await fetch(`http://localhost:9000/api/juego/${sesionId}`);
                if (sesionResponse.ok) {
                    const sesionData = await sesionResponse.json();
                    const sesionItem = document.createElement('li');
                    const fechaHora = new Date(sesionData.createdAt).toLocaleString();
                    sesionItem.insertAdjacentHTML('beforeend', `<strong>${fechaHora}</strong><br>Juego: ${sesionData.nombreDelJuego} <br>Dificultad: ${sesionData.nivel}<br>Intentos: ${sesionData.cantidadDeIntentos}`);
                    sesionesList.appendChild(sesionItem);
                } else {
                    console.error('Error al obtener detalles de la sesión de juego:', sesionResponse.statusText);
                }
            }
            for(const sesion of paciente.sesiones){
                const sesioncont = document.createElement('li');
                sesioncont.textContent =`Sesion:${sesion}`
                sesionescontent.appendChild(sesioncont)
            }
            // Mostrar el modal
            document.getElementById('patientDetailsModal').classList.remove('hidden');
        } else {
            console.error('Error al obtener detalles del paciente:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
// Función para abrir el modal de agregar sesión con el ID del paciente
function openAddSessionModal(pacienteId) {
    console.log(pacienteId)
    // Obtener el modal de agregar sesión
    const addSessionModal = document.getElementById('addSessionModal');
    // Mostrar el modal
    addSessionModal.classList.remove('hidden');

    // Obtener el textarea del modal
    const sesionTextarea = document.getElementById('sesionTextarea');

    // Agregar evento al botón de guardar sesión
    const guardarSesionBtn = document.getElementById('guardarSesionBtn');
    guardarSesionBtn.addEventListener('click', async function() {
        const sesion = sesionTextarea.value;
        console.log(sesion)
        try {
            // Realizar la solicitud HTTP POST para registrar la sesión
            const response = await fetch(`http://localhost:9000/api/pacientes/${pacienteId}/sesiones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sesion })
            });
            if (response.ok) {
                // Si la respuesta es exitosa, cerrar el modal
                addSessionModal.classList.add('hidden');
                // Recargar los detalles del paciente para reflejar los cambios
                openModal(pacienteId);
            } else {
                console.error('Error al agregar sesión:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    });

    // Agregar evento al botón de cancelar
    const cancelarBtn = document.getElementById('cancelarBtn');
    cancelarBtn.addEventListener('click', function() {
        // Si se cancela, cerrar el modal
        addSessionModal.classList.add('hidden');
    });
}


// Cerrar el modal cuando se hace clic en el botón "Cerrar"
document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('patientDetailsModal').classList.add('hidden');
});

// Función para manejar la expansión de los detalles del paciente
function toggleDetails(btn) {
    const pacienteId = btn.dataset.id; // Obtener la ID del paciente del botón
    openModal(pacienteId);
}



const Paciente = require('../models/paciente');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

exports.registrarPaciente = async (req, res) => {
  const {creadorId} = req.params;
  const { nombre, dni, edad, obraSocial, antecedentes} = req.body;
  
  
  try {
    // Crear un nuevo paciente
    const paciente = new Paciente({
      nombre,
      dni,
      edad,
      obraSocial,
      antecedentes,
      creador: creadorId
    });

    // Guardar el paciente en la base de datos
    //await paciente.save();

    // Guardar el ID del paciente en el array de pacientes creados por el administrador
    const admin = await Admin.findById(creadorId);
    admin.pacientesCreados.push(paciente._id);
    await Promise.allSettled([paciente.save(),admin.save()])

    res.status(201).json({ message: 'Paciente registrado exitosamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


exports.registrarSesion = async (req, res) => {
    const { pacienteId } = req.params;
    const { sesion } = req.body;
  
    try {
      // Buscar al paciente por su ID
      const paciente = await Paciente.findById(pacienteId);
  
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente no encontrado' });
      }
  
      // Agregar la nueva sesión al array de sesiones del paciente
      paciente.sesiones.push(sesion);
      await paciente.save();
  
      res.status(201).json({ message: 'Sesión registrada exitosamente' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };

  // controladorPaciente.js


// Controlador para encontrar un paciente por su ID
exports.encontrarPacientePorId = async (req, res) => {
  const pacienteId = req.params.id;

  try {
    // Buscar al paciente por su ID
    const paciente = await Paciente.findById(pacienteId);

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.status(200).json({ paciente });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.loginPaciente = async (req, res) => {
  const { dni } = req.body;

  try {
    // Buscar al paciente por su DNI
    const paciente = await Paciente.findOne({ dni });

    // Si el paciente no existe
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.status(200).json({ pacienteId: paciente._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

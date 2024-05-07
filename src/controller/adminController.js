const Admin = require("../models/admin")
const Paciente = require("../models/paciente")
const jwt = require('jsonwebtoken');

exports.nuevoAdmin = async (req, res) => {
    const admin = req.body;
    const nuevoAdmin= new Admin(admin);
    try{
        await nuevoAdmin.save();
        res.status(201).json(nuevoAdmin);
    }catch (error){
        res.status(409).json({mensage: error.mensage})
    }
}


exports.loginAdmin = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // Buscar al administrador por su nombre de usuario
    const admin = await Admin.findOne({ usuario });

    // Si el administrador no existe
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // Verificar si la contraseña es correcta
    if (password !== admin.password) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Devolver solo el ID del administrador
    res.status(200).json({ adminId: admin._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.obtenerPacientesCreadosPorAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Buscar al administrador por su ID
    const admin = await Admin.findById(adminId);

    // Si el administrador no existe
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // Obtener los IDs de los pacientes creados por el administrador
    const pacientesCreados = admin.pacientesCreados;

    res.status(200).json({ pacientesCreados });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
const Paciente = require('../models/paciente');
const Admin = require('../models/admin');
const SesionDeJuego = require('../models/sesionDeJuego');

exports.registrarSesionDeJuego= async(req,res) =>{
    const {pacienteID} = req.params;
    const { nombreDelJuego, nivel, cantidadDeIntentos} = req.body;

    try{
        const sesiondejuego1= new SesionDeJuego({
            nombreDelJuego,
            nivel,
            cantidadDeIntentos,
            paciente: pacienteID
        });
        const paciente = await Paciente.findById(pacienteID)
        paciente.sesionesDeJugo.push(sesiondejuego1._id)
        await Promise.allSettled([sesiondejuego1.save(), paciente.save()])
        res.status(201).json({ message: 'Sesion registrado exitosamente' });

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
      } 
}
exports.obtenerSesionDeJuegoPorId = async (req, res) => {
    const { id } = req.params; // Obtiene el ID de la sesión de juego de los parámetros de la solicitud
    try {
        const sesionDeJuego = await SesionDeJuego.findById(id); // Busca la sesión de juego por su ID
        if (!sesionDeJuego) {
            return res.status(404).json({ mensaje: 'Sesión de juego no encontrada' });
        }
        res.status(200).json(sesionDeJuego); // Devuelve la sesión de juego encontrada
    } catch (error) {
        console.error('Error al obtener la sesión de juego por ID:', error);
        res.status(500).json({ mensaje: 'Error del servidor al obtener la sesión de juego' });
    }
};

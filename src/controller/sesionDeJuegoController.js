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

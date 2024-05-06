const mongoose = require("mongoose");


const sesionDeJuegoSchema = mongoose.Schema({
    nombreDelJuego: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        required: true
    },
    cantidadDeIntentos: {
        type: Number,
        required: true
    },
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jugador' // Aquí asumo que tienes un modelo de jugador con el nombre 'Jugador'
    }
},{
    timestamps:true
});

module.exports = mongoose.model('SesionDeJuego', sesionDeJuegoSchema)



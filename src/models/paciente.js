const mongoose = require("mongoose");

const pacienteSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },
    dni:{
        type: Number,
        require: true,
        unique: true
    },
    edad:{
        type: Number,
        require: true
    },
    obraSocial:{
        type: String
    },
    antecedentes:{
        type:String,
        require:true
    },
    sesiones: [{
        type: String
    }],
    sesionesDeJugo:[{
        type: mongoose.Types.ObjectId,
        ref: 'Sesiondejuego'
    }],
    creador:{
        type: mongoose.Types.ObjectId,
        ref: 'Admin'
    }
},{
    timestamps:true
});
 
module.exports = mongoose.model('Paciente', pacienteSchema)
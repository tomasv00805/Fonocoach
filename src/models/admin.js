const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    usuario:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    pacientesCreados: [{
        type: mongoose.Types.ObjectId,
        ref: 'Paciente'
    }]
},{
    timestamps:true
});


module.exports = mongoose.model('Admin', adminSchema)
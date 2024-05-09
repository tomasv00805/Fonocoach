const express = require("express")
const mongoose = require("mongoose")//se utiliza para conectarse con la base de datos
require("dotenv").config() //para no dejar expuesto la conecion a la base de datos
const cors = require('cors');



const app = express()
app.use(express.json());
const prot= process.env.PORT || 9000

app.use(cors());
// Importar las rutas 
const routes = require('./routes'); 

// Middleware para parsear el cuerpo de las solicitudes


//concecion con mongodb
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('conectado con mongodb')).catch((error) => console.error(error))
console.log(process.env.MONGODB_URI)

// Registrar las rutas en la aplicación
app.use('/api', routes);
 
app.listen(prot, () => console.log("server listening port", prot))
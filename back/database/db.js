const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected');
});

mongoose.connection.on('error', err => {
    console.error('Error en la conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB Disconnected');
});

module.exports = connectDB;

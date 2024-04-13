const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const connectDB = require("./database/db");
const { OAuth2Client } = require("google-auth-library");
const User = require("./models/User"); // Asegúrate de que este sea el camino correcto a tu modelo de usuario
const userRoutes = require('./routes/userRoutes'); // Asegúrate de que este sea el camino correcto a tu archivo de rutas de usuario

require("dotenv").config();

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID); // Asegúrate de que tu ID de cliente de Google esté en tus variables de entorno

app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // Necesario para poder parsear el cuerpo de las solicitudes POST

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/auth/google", async (req, res) => {
    try {
      console.log('Token:', req.body.token); // Log the token
  
      const token = req.body.token;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload();
  
      console.log('Payload:', payload); // Log the payload
  
      let user = await User.findOne({ googleId: payload.sub });
  
      console.log('User:', user); // Log the user
  
      if (!user) {
        user = new User({
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture, // Guarda la URL de la imagen del perfil
        });
        await user.save();
        console.log('User created:', user); // Log the user after it's created
      }
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  });

app.use('/api/users', userRoutes); // Usa las rutas de usuario en '/api/users'

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
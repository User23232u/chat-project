const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./database/db");
const { OAuth2Client } = require("google-auth-library");
const User = require("./models/User");
const Message = require("./models/Message"); // Asegúrate de tener este modelo
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const http = require("http");
const { generateAuthToken } = require('./jwt/authToken');
const socketIo = require("socket.io");
let users = {};
let userCount = 0;

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});
const client = new OAuth2Client(process.env.CLIENT_ID);

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/auth/google", async (req, res) => {
  try {
    const token = req.body.token;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        username: payload.name,
        picture: payload.picture,
      });
      await user.save();
    }

    // Generar un token JWT para el usuario
    const jwtToken = await generateAuthToken(user);

    console.log('Token:', jwtToken);

    // Enviar el token JWT al cliente
    res.send({ token: jwtToken });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

io.on("connection", (socket) => {
  console.log("a user connected");
  userCount++;
  console.log("Number of connected users:", userCount);

  // Cuando un usuario se conecta, guarda su socket en el objeto 'users'
  socket.on('user connected', (userId) => {
    users[userId] = socket;
    socket.emit('user connected');
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userCount--;
    console.log("Number of connected users:", userCount);
    // Cuando un usuario se desconecta, elimina su socket del objeto 'users'
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });

  socket.on('get messages', async (data) => {
    const messages = await Message.find({
      $or: [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender }
      ]
    });

    console.log("Messages:", messages);
  
    socket.emit('chat message', messages);
  });
  socket.on('chat message', async (msg) => {
    const message = new Message(msg);
    await message.save();

    console.log("Message:", message);
  
    const receiverSocket = users[msg.receiver];
    if (receiverSocket) {
      receiverSocket.emit('chat message', msg);
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

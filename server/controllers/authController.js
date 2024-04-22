const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateAuthToken } = require('../jwt/authToken');

const authController = {
    async register (req, res) {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = new User({ username, email, password: hashedPassword });
                await user.save();
            res.status(201).send(user);
        } catch (error) {
            res.status(400).send(error);
        }
    },

    async login (req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(400).send({ error: 'Invalid login credentials' });
            }
    
            // Comparar la contraseña proporcionada con la almacenada en la base de datos
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send({ error: 'Invalid login credentials' });
            }
    
            const token = await generateAuthToken(user);
    
            res.send({ token });
        } catch (error) {
            res.status(400).send(error);
        }
    },

    async logout (req, res) {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token;
            });
            await req.user.save();
            res.send();
        } catch (error) {
            res.status(500).send(error);
        }
    },

}

module.exports = authController;
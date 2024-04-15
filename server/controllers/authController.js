const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const authController = {
    async register (req, res) {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = new User({ name, email, password: hashedPassword });
            await user.save();
            res.status(201).send(user);
        } catch (error) {
            res.status(400).send(error);
        }
    },

    async login (req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByCredentials(email, password);
            //const token = await user.generateAuthToken();
            res.send({ user, token });
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

    //async logout
    //

}

module.exports = authController;
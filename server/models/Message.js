const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Cambiado de 'recipient' a 'receiver'
  text: { type: String, required: true },
  createdAt: { type: Date }
});

module.exports = mongoose.model('Message', MessageSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' } // 👈 यहाँ आपकी अपलोड हुई फोटो का लाइव लिंक सेव होगा
});

module.exports = mongoose.model('User', userSchema);
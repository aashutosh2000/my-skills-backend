const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true, default: 'Learning' },
  category: { type: String, required: true, default: 'Frontend' } // 👈 यह नई लाइन जोड़ें
});

module.exports = mongoose.model('Skill', skillSchema);
const crypto = require('crypto'); // 👈 यह लाइन सबसे ऊपर जोड़ें
const mongoose = require ('mongoose');
// यहाँ हम तय कर रहे हैं कि हमारे डेटा का स्ट्रक्चर कैसा होगा
const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true }
});

// इसे एक्सपोर्ट कर रहे हैं ताकि server.js में इसका इस्तेमाल कर सकें
module.exports = mongoose.model('Skill', SkillSchema);

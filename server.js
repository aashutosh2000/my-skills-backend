require('dotenv').config(); // 👈 यह हमेशा नंबर 1 पर ही होनी चाहिए!

const crypto = require('crypto'); 
global.crypto = crypto; 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { protect } = require('./middleware/authMiddleware');
const upload = require('./config/cloudinaryConfig');
const Skill = require('./models/Skill'); 
const User = require('./models/User'); // 👈 सारे मॉडल्स अब .env लोड होने के बाद आएंगे

const app = express();
app.use(cors()); 
app.use(express.json());

// पोर्ट और डेटाबेस की वैल्यू .env फाइल से आएगी
const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URI; 

const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.cluster0.uyjw0sz.mongodb.net', (err, addresses) => {
    console.log("DNS Error:", err);
    console.log("Addresses:", addresses);
});

// मोंगोडीबी से कनेक्शन
mongoose.connect(dbURI)
  .then(() => console.log('लोकल MongoDB सफलतापूर्वक कनेक्ट हो गया है! ✅'))
  .catch(err => {
      console.log('Database Connection Error:');
      console.error(err.stack);
  });

// होम पेज का रूट
app.get('/', (req, res) => {
    res.send("<h1>नमस्ते आशुतोष! आपका सुरक्षित एक्सप्रेस बैकएंड सर्वर लाइव है! 🚀</h1>"); 
});

// POST Route: यूजर की प्रोफाइल फोटो अपलोड करने के लिए (यह रूट पूरी तरह सुरक्षित है)
app.post('/api/user/upload-profile', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'कृपया कोई इमेज फाइल चुनें!' });
        }

        const imageUrl = req.file.path;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId, 
            { profileImage: imageUrl }, 
            { new: true }
        ).select('-password');

        res.json({ 
            message: 'प्रोफाइल फोटो सफलतापूर्वक अपलोड हो गई! 📸', 
            profileImage: imageUrl,
            user: updatedUser
        });
    } catch (err) {
        console.error('अपलोड एरर:', err);
        res.status(500).json({ error: 'इमेज अपलोड करने में दिक्कत आई।' });
    }
});

// GET Route: डेटाबेस से सारा डेटा वापस मंगाने के लिए
app.get('/api/skills', protect, async (req, res) => {
    try {
        const allSkills = await Skill.find(); 
        res.json(allSkills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
});

// POST Route: असली डेटाबेस में नया डेटा सेव करने के लिए
app.post('/api/skills', protect, async (req, res) => {
    try {
        const newSkill = new Skill(req.body); 
        await newSkill.save(); 
        res.json({ message: "डेटाबेस में 😊 स्किल सुरक्षित हो गई! ✅", data: newSkill });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Route: डेटाबेस से डेटा डिलीट करने के लिए
app.delete('/api/skills/:id', protect, async (req, res) => {
    try {
        const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
        if (!deletedSkill) {
            return res.status(404).json({ message: "स्किल नहीं मिली!" });
        }
        res.json({ message: "डेटाबेस से स्किल सफलतापूर्वक डिलीट हो गई! ❌" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔄 UPDATE Route: अब यह स्किल का नाम, कैटेगरी और स्टेटस तीनों चीज़ें अपडेट कर सकता है!
app.put('/api/skills/:id', protect, async (req, res) => {
    try {
        const { name, status, category } = req.body; 
        
        const updatedSkill = await Skill.findByIdAndUpdate(
            req.params.id, 
            { name, status, category }, 
            { new: true }
        );
        
        if (!updatedSkill) {
            return res.status(404).json({ message: "स्किल नहीं मिली!" });
        }
        res.json({ message: "स्किल सफलतापूर्वक अपडेट हो गई! 🔄", data: updatedSkill });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SIGNUP ROUTE: नया यूजर बनाने के लिए
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "यूजर बन गया! अब लॉगिन करें।" });
    } catch (err) {
        res.status(500).json({ error: "साइनअप में दिक्कत आई।" });
    }
});

// LOGIN ROUTE: लॉगिन करने और टोकन + फोटो पाने के लिए
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ 
                token, 
                profileImage: user.profileImage || '' 
            });
        } else {
            res.status(401).json({ error: "गलत ईमेल या पासवर्ड!" });
        }
    } catch (err) {
        res.status(500).json({ error: "लॉगिन में दिक्कत आई।" });
    }
});

// 🌐 पोर्टफोलियो के लिए पब्लिक राउट (इसमें टोकन नहीं लगेगा)
app.get('/api/skills/public', async (req, res) => {
  try {
    const Skill = require('./models/Skill'); 
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🤖 AI Route: स्किल्स का विश्लेषण करके अगली बेस्ट स्किल का सुझाव पाना
app.post('/api/ai-suggestions', protect, async (req, res) => {
    try {
        const skills = await Skill.find();
        
        if (!skills || skills.length === 0) {
            return res.json({ suggestion: "अभी आपके डैशबोर्ड में कोई स्किल नहीं है। कृपया पहले कुछ स्किल्स जोड़ें ताकि AI उनका विश्लेषण कर सके! 💡" });
        }

        const skillListText = skills.map(s => `- ${s.name} (${s.category} - ${s.status})`).join('\n');

        // 🌟 आपके पैकेज वर्ज़न (0.24.1) के लिए बिल्कुल सही और सटीक सिंटैक्स
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "सर्वर पर GEMINI_API_KEY सेट नहीं है।" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert MERN stack tech lead and career coach. Here is the current list of IT skills of candidate Ashutosh:\n${skillListText}\n\nBased on these skills, analyze the gaps and strictly suggest the top 2 highly relevant next tech skills he must learn in 2026 to get a high-paying software engineer job. Give your answer in clean, short, professional Hinglish (Hindi + English mix) within 4-5 bullet points. Keep it super actionable.`;

        const result = await model.generateContent(prompt);
        
        // 🌟 रिस्पॉन्स टेक्स्ट निकालने का सही तरीका
        const responseText = result.response.text();

        res.json({ suggestion: responseText });
    } catch (err) {
        console.error('Gemini AI Error:', err);
        res.status(500).json({ error: 'एआई से सुझाव प्राप्त करने में कुछ समस्या आई।' });
    }
});

// सर्वर को चालू करें
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`सुरक्षित सर्वर सफलतापूर्वक चालू हो गया है!`);
    console.log(`यहाँ क्लिक करके देखें: http://localhost:${PORT}`);
    console.log(`=========================================`);
});
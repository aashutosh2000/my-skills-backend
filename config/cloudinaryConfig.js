const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. क्लाउडीनरी को अपनी .env की चाबियों से कनेक्ट करें
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. स्टोरेज सेटिंग बनाएं (कि फाइल कहाँ और कैसे सेव होगी)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles', // क्लाउडीनरी पर इस नाम का फोल्डर बनेगा
    allowed_formats: ['jpg', 'png', 'jpeg'], // सिर्फ यही इमेजेस एलाऊ होंगी
    transformation: [{ width: 150, height: 150, crop: 'fill' }] // अपने आप प्रोफाइल साइज (स्क्वायर) में क्रॉप हो जाएगी
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
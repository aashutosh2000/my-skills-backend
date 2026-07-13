# ⚙️ MERN Stack Skills Dashboard (Back-End API)

यह मेरे लाइव पोर्टफोलियो और एडमिन डैशबोर्ड को पावर देने वाला एक सुरक्षित एक्सप्रेस (Express.js) सर्वर है। यह डेटाबेस मैनेजमेंट और सुरक्षित एपीआई राउट्स को हैंडल करता है।

## 🔗 Live Links
- **Live API Endpoint:** https://my-skills-api-p955.onrender.com
- **Live Portfolio Website:** https://aashutosh2000.github.io/Portfolio-project/

## 🚀 मुख्य फीचर्स (Key Features)
- **🔒 Secure JWT Authentication:** `bcryptjs` और `jsonwebtoken` का उपयोग करके सुरक्षित एडमिन लॉगिन।
- **🛡️ Custom Auth Middleware:** केवल ऑथेंटिकेटेड यूजर ही स्किल्स को मैनेज (Add, Edit, Delete) कर सकते हैं।
- **🌐 Public API Route:** पोर्टफोलियो वेबसाइट के लिए बिना टोकन का पब्लिक रूट (`/api/skills/public`) जहाँ से लाइव स्किल्स सिंक होती हैं।
- **📸 Cloudinary Integration:** प्रोफाइल इमेज को क्लाउड पर सुरक्षित स्टोर करने के लिए `multer-storage-cloudinary` का सेटअप।
- **🗄️ MongoDB Atlas Setup:** डेटा को परसिस्टेंट रखने के लिए क्लाउड डेटाबेस का इस्तेमाल।

## 🛠️ टेक स्टैक (Tech Stack)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Security:** JWT (JSON Web Tokens), Bcrypt.js, CORS
- **Media Storage:** Cloudinary

## 📦 लोकल मशीन पर कैसे चलाएं (Installation)

1. रिपोजिटरी को क्लोन करें:
   ```bash
   git clone [https://github.com/aashutosh2000/my-skills-backend.git](https://github.com/aashutosh2000/my-skills-backend.git)
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // चेक करें कि रिक्वेस्ट के हेडर में टोकन आ रहा है या नहीं
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer <token>" में से सिर्फ टोकन को अलग करें
            token = req.headers.authorization.split(' ')[1];

            // टोकन को वेरीफाई करें
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // यूजर की आईडी को रिक्वेस्ट ऑब्जेक्ट में जोड़ दें ताकि आगे इस्तेमाल हो सके
            req.user = decoded;

            // सब सही है, तो अगले फंक्शन (Route) पर जाएँ
            next();
        } catch (error) {
            console.error("टोकन वेरिफिकेशन में एरर:", error);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token found' });
    }
};

module.exports = { protect };
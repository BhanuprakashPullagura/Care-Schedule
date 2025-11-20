import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.dtoken;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Authorization token missing' });
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔥 FIX: attach correct variable  
        req.userId = decoded.id;

        next();

    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authDoctor;

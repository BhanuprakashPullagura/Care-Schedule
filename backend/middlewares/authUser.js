import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();
    } catch (error) {
        console.log("User Auth Error:", error);
        return res.json({ success: false, message: 'Invalid or expired token. Login again.' });
    }
};

export default authUser;

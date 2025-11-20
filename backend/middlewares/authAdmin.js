import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = (req, res, next) => {
    try {
        let token = "";

        // Accept BOTH headers:
        // 1. Authorization: Bearer <token>
        // 2. atoken: <token>
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.headers.atoken) {
            token = req.headers.atoken;
        }

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check admin role
        if (!decoded || decoded.role !== "admin") {
            return res.json({
                success: false,
                message: "Access Denied. Admin only."
            });
        }

        req.admin = decoded;
        next();

    } catch (error) {
        console.log("Admin Auth Error:", error);
        return res.json({
            success: false,
            message: "Invalid or expired token. Login again."
        });
    }
};

export default authAdmin;

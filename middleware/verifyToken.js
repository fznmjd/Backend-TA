const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Forbidden

        req.email = decoded.email;
        req.username = decoded.username;
        req.role = decoded.role;
        if (req.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied, admin only',
            });
        }

        next(); 
    });
};

module.exports = verifyToken;

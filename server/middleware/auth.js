const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication token is required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        const user = await User.findById(decoded.userId);
        if(!user || !user.isActive) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }
        req.user = {
            userId : user._id,
            role : user.role
        }
        next();
    }catch(error){
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Invalid authentication token' });
    }
}
module.exports = authMiddleware;
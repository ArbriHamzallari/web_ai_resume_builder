import jwt from 'jsonwebtoken'

const protect = async (req, res, next) => {
    // Check for token in cookie first (preferred for production), then Authorization header
    let token = req.cookies?.token || req.headers.authorization;
    
    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
        token = token.substring(7);
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default protect;
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) return res.status(401).json({ message: 'unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ message: 'unauthorized' });

        req.userId = decoded.userId;

        next();

    }
    catch (error) {
        res.status(401).json({ message: 'unauthorized', error: error.message});
    }
}

export default authorize;
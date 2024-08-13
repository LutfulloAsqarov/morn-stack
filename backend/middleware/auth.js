import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            msg: "Access denied. No token provided.",
            variant: "error",
            payload: null,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            msg: "Invalid token.",
            variant: "error",
            payload: null,
        });
    }
};

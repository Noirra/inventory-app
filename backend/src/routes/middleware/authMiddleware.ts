import {Context, Next} from "hono";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "admin1234";

export const authMiddleware = async (c: Context, next: Next) => {
    const path = c.req.path
    if (path.startsWith("/uploads/")) return await next();

    try {
        const authHeader = c.req.header("Authorization");


        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({success: false, message: "Authorization header missing or invalid."}, 401);
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return c.json({success: false, message: "Token has been logged out."}, 401);
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        c.set("jwtPayload", decodedToken);

        await next();
    } catch (error) {
        if (error instanceof Error) {
            return c.json({success: false, message: "Invalid or expired token.", error: error.message}, 401);
        }
        return c.json({success: false, message: "Invalid or expired token.", error: "Unknown error"}, 401);
    }
};
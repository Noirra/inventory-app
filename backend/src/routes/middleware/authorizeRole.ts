import { Context, Next } from "hono";

const authorizeRole = (allowedRoles: string[]) => {
    return async (c: Context, next: Next) => {
        const user = c.get("jwtPayload");

        if (!user || !allowedRoles.includes(user.role)) {
            return c.json({ success: false, message: "Unauthorized access" }, 403);
        }

        await next();
    };
};

export default authorizeRole;

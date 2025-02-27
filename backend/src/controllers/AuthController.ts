import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { z } from "zod";
import { Context } from "hono";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "admin1234";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const login = async (c: Context) => {
    try {
        const body = await c.req.json();
        const parse = loginSchema.safeParse(body);
        if (!parse.success) {
            return c.json({ success: false, message: "Invalid credentials format" }, 400);
        }

        const user = await prisma.user.findUnique({
            where: { email: body.email },
            include: { roles: { include: { role: true } } },
        });

        if (!user || !(await compare(body.password, user.password))) {
            return c.json({ success: false, message: "Invalid email or password" }, 401);
        }

        const userRoles = user.roles.map((r) => r.role.name);
        const validRoles = ["employee", "admin", "owner"];
        const filteredRoles = userRoles.filter((role) => validRoles.includes(role));

        if (filteredRoles.length === 0) {
            return c.json({ success: false, message: "Unauthorized role" }, 403);
        }

        const token = jwt.sign(
            { id: user.id, roles: filteredRoles },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        return c.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                roles: filteredRoles,
                userId: user.id,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};

export const logout = async (c: Context) => {
    return c.json({ success: true, message: "Logged out successfully" }, 200);
};
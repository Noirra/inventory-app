import { PrismaClient } from "@prisma/client";
import { sign } from "hono/jwt";
import { compare } from "bcryptjs";
import { z } from "zod";
import { Context } from "hono";

const prisma = new PrismaClient();
const JWT_SECRET = "admin123";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const login = async (c: Context) => {
    const body = await c.req.json();
    const parse = loginSchema.safeParse(body);
    if (!parse.success) return c.json({ error: "Invalid credentials" }, 400);

    const user = await prisma.user.findUnique({
        where: { email: body.email },
        include: { roles: { include: { role: true } } },
    });

    if (!user || !(await compare(body.password, user.password))) {
        return c.json({ error: "Invalid email or password" }, 401);
    }

    const userRoles = user.roles.map((r) => r.role.name);
    const validRoles = ["employee", "admin", "owner"];
    const userRole = validRoles.find((role) => userRoles.includes(role));

    if (!userRole) {
        return c.json({ error: "Unauthorized role" }, 403);
    }

    const token = await sign(
        { id: user.id, email: user.email, role: userRole },
        JWT_SECRET,
        );

    return c.json({ token, role: userRole, user: { id: user.id, email: user.email } });
};
export const logout = async (c: Context) => {
    return c.json({ message: "Logged out successfully" }, 200);
};

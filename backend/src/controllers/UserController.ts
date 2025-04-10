import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { Context } from "hono";

const prisma = new PrismaClient();

export const getUsers = async (c: Context) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                roles: {
                    some: {
                        role: {
                            name: "employee",
                        },
                    },
                },
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        return c.json({ success: true, users }, 200);
    } catch (error) {
        console.error("Error fetching users:", error);
        return c.json({ success: false, error: "Internal Server Error" }, 500);
    }
};

export const getUserById = async (c: Context) => {
    try {
        const userId = c.req.param("id");

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { roles: { include: { role: true } } },
        });

        if (!user) {
            return c.json({ success: false, message: "User not found" }, 404);
        }

        return c.json({ success: true, user }, 200);
    } catch (error) {
        return c.json({ success: false, error: "Internal Server Error" }, 500);
    }
};

export const registerUser = async (c: Context) => {
    try {
        const { email, password, name } = await c.req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return c.json({ error: "User already exists" }, 400);

        const hashedPassword = await hash(password, 10);

        const employeeRole = await prisma.role.findUnique({
            where: { name: "employee" },
        });

        if (!employeeRole) {
            return c.json({ error: "Role 'employee' not found" }, 500);
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                roles: {
                    create: {
                        roleId: employeeRole.id,
                    },
                },
            },
        });

        return c.json({ success: true, message: "User registered", user }, 201);
    } catch (error) {
        return c.json({ success: false, error: "Internal Server Error" }, 500);
    }
};

export const updateUser = async (c: Context) => {
    try {
        const userId = c.req.param("id");
        const { email, name } = await c.req.json();

        if (!userId) {
            return c.json({ error: "User ID is required" }, 400);
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email, name },
        });

        return c.json({ success: true, message: "User updated", user: updatedUser }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ success: false, error: "Internal Server Error" }, 500);
    }
};

export const deleteUser = async (c: Context) => {
    try {
        const userId = c.req.param("id");

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return c.json({ success: false, message: "User not found" }, 404);
        }

        await prisma.user.delete({ where: { id: userId } });

        return c.json({ success: true, message: "User deleted" }, 200);
    } catch (error) {
        return c.json({ success: false, error: "Internal Server Error" }, 500);
    }
};
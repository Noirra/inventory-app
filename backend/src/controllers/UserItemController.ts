import { Context } from "hono";
import prisma from "../../prisma/client";

export async function createUserItem(c: Context) {
    try {
        const body = await c.req.json();
        const { userId, itemId } = body;

        const userItem = await prisma.userItem.create({
            data: { userId, itemId }
        });

        return c.json({
            success: true,
            message: "UserItem successfully created!",
            data: userItem,
        }, 201);
    } catch (e: unknown) {
        console.error(`Error creating UserItem: ${e}`);
        return c.json({
            success: false,
            message: "Failed to create UserItem.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function getAllUserItems(c: Context) {
    try {
        const userItems = await prisma.userItem.findMany({
            include: { user: true, item: true },
            orderBy: { createdAt: "desc" },
        });

        return c.json({
            success: true,
            message: "List of all UserItems!",
            data: userItems,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving UserItems: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve UserItems.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function getUserItemById(c: Context) {
    try {
        const id = c.req.param("id");

        const userItem = await prisma.userItem.findUnique({
            where: { id },
            include: { user: true, item: true },
        });

        if (!userItem) {
            return c.json({
                success: false,
                message: "UserItem not found!",
            }, 404);
        }

        return c.json({
            success: true,
            message: "UserItem details retrieved successfully!",
            data: userItem,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving UserItem: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve UserItem.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function updateUserItem(c: Context) {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        const { userId, itemId } = body;

        const updatedUserItem = await prisma.userItem.update({
            where: { id },
            data: { userId, itemId },
        });

        return c.json({
            success: true,
            message: "UserItem successfully updated!",
            data: updatedUserItem,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error updating UserItem: ${e}`);
        return c.json({
            success: false,
            message: "Failed to update UserItem.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function deleteUserItem(c: Context) {
    try {
        const id = c.req.param("id");

        await prisma.userItem.delete({ where: { id } });

        return c.json({
            success: true,
            message: "UserItem successfully deleted!",
        }, 200);
    } catch (e: unknown) {
        console.error(`Error deleting UserItem: ${e}`);
        return c.json({
            success: false,
            message: "Failed to delete UserItem.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

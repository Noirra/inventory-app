import { Context } from "hono";
import prisma from "../../prisma/client";
import { ItemStatus } from "@prisma/client";

export async function createUserItem(c: Context) {
    try {
        const body = await c.req.json();
        const { userId, itemId } = body;

        if (!userId || !itemId) {
            return c.json({ success: false, message: "User ID and Item ID are required!" }, 400);
        }

        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            return c.json({ success: false, message: "User not found!" }, 404);
        }

        const existingUserItem = await prisma.userItem.findFirst({ where: { itemId } });
        if (existingUserItem) {
            return c.json({ success: false, message: "Item already assigned to another user!" }, 400);
        }

        const userItem = await prisma.userItem.create({
            data: { userId, itemId }
        });

        await prisma.item.update({
            where: { id: itemId },
            data: { status: ItemStatus.USED }
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

export async function getUserItemsByUserId(c: Context) {
    try {
        const userId = c.req.param("userId");
        if (!userId) {
            return c.json({ success: false, message: "User ID is required!" }, 400);
        }

        const userItems = await prisma.userItem.findMany({
            where: { userId },
            include: { user: true, item: true },
            orderBy: { createdAt: "desc" },
        });

        if (userItems.length === 0) {
            return c.json({
                success: false,
                message: "No UserItems found for this user!",
            }, 404);
        }

        return c.json({
            success: true,
            message: "List of UserItems for the user!",
            data: userItems,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving UserItems by userId: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve UserItems.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function updateUserItem(c: Context) {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();
        const { userId, itemId } = body;

        if (!userId || !itemId) {
            return c.json({ success: false, message: "User ID and Item ID are required!" }, 400);
        }

        const existingUserItem = await prisma.userItem.findFirst({ where: { itemId, NOT: { id } } });
        if (existingUserItem) {
            return c.json({ success: false, message: "Item already assigned to another user!" }, 400);
        }

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

        const userItem = await prisma.userItem.delete({
            where: { id }
        });

        await prisma.item.update({
            where: { id: userItem.itemId },
            data: { status: ItemStatus.UNUSED }
        });

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

export async function getUnusedItems(c: Context) {
    try {
        const items = await prisma.item.findMany({
            where: {
                status: ItemStatus.UNUSED
            },
            orderBy: {
                name: "asc"
            }
        });

        return c.json({
            success: true,
            message: "List of unused items",
            data: items
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving unused items: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve unused items.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

import { Context } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createGroupCode(c: Context) {
    try {
        const { name } = await c.req.json();
        if (!name) return c.json({ success: false, message: "Name is required." }, 400);

        const groupCode = await prisma.groupCode.create({ data: { name } });
        return c.json({ success: true, message: "GroupCode created successfully!", data: groupCode }, 201);
    } catch (e) {
        return c.json({ success: false, message: "Failed to create GroupCode.", error: (e as Error).message }, 500);
    }
}

export async function deleteGroupCode(c: Context) {
    try {
        const groupCodeId = c.req.param("id");

        // Cek apakah GroupCode ada
        const existingGroup = await prisma.groupCode.findUnique({ where: { id: groupCodeId } });
        if (!existingGroup) return c.json({ success: false, message: "GroupCode not found!" }, 404);

        // Hapus semua item terkait sebelum menghapus groupCode
        await prisma.itemGroup.deleteMany({ where: { groupId: groupCodeId } });
        await prisma.groupCode.delete({ where: { id: groupCodeId } });

        return c.json({ success: true, message: "GroupCode deleted successfully!" }, 200);
    } catch (e) {
        return c.json({ success: false, message: "Failed to delete GroupCode.", error: (e as Error).message }, 500);
    }
}

export async function getAllGroupCodes(c: Context) {
    try {
        const groupCodes = await prisma.groupCode.findMany();
        return c.json({ success: true, message: "List of all GroupCodes!", data: groupCodes }, 200);
    } catch (e) {
        return c.json({ success: false, message: "Failed to retrieve GroupCodes.", error: (e as Error).message }, 500);
    }
}

export async function getItemsByGroupCode(c: Context) {
    try {
        const groupCodeId = c.req.param("groupCodeId");

        const existingGroup = await prisma.groupCode.findUnique({
            where: { id: groupCodeId }
        });

        if (!existingGroup) {
            return c.json({ success: false, message: "GroupCode not found!" }, 404);
        }

        const items = await prisma.itemGroup.findMany({
            where: { groupId: groupCodeId },
            include: { item: true }
        });

        return c.json({
            success: true,
            message: "Items in GroupCode",
            data: items.map(i => i.item)
        }, 200);

    } catch (e) {
        return c.json({
            success: false,
            message: "Failed to retrieve items.",
            error: (e as Error).message
        }, 500);
    }
}


export async function addItemToGroupCode(c: Context) {
    try {
        const { itemId, groupCodeId } = await c.req.json();

        // Cek apakah item dan groupCode ada
        const itemExists = await prisma.item.findUnique({ where: { id: itemId } });
        const groupExists = await prisma.groupCode.findUnique({ where: { id: groupCodeId } });

        if (!itemExists || !groupExists) {
            return c.json({ success: false, message: "Item or GroupCode not found." }, 404);
        }

        const existing = await prisma.itemGroup.findFirst({ where: { itemId, groupId: groupCodeId } });

        if (existing) return c.json({ success: false, message: "Item already exists in this GroupCode." }, 400);

        const itemGroup = await prisma.itemGroup.create({ data: { itemId, groupId: groupCodeId } });
        return c.json({ success: true, message: "Item added to GroupCode!", data: itemGroup }, 201);
    } catch (e) {
        return c.json({ success: false, message: "Failed to add item to GroupCode.", error: (e as Error).message }, 500);
    }
}

export async function removeItemFromGroupCode(c: Context) {
    try {
        const itemId = c.req.param("itemId");
        const groupCodeId = c.req.param("groupCodeId");

        // Cek apakah GroupCode dan Item ada sebelum menghapus
        const existingGroup = await prisma.groupCode.findUnique({ where: { id: groupCodeId } });
        const existingItem = await prisma.item.findUnique({ where: { id: itemId } });

        if (!existingGroup || !existingItem) {
            return c.json({ success: false, message: "Item or GroupCode not found!" }, 404);
        }

        const deleted = await prisma.itemGroup.deleteMany({
            where: { itemId, groupId: groupCodeId }
        });

        if (deleted.count === 0) {
            return c.json({ success: false, message: "Item is not in this GroupCode." }, 400);
        }

        return c.json({ success: true, message: "Item removed from GroupCode!" }, 200);
    } catch (e) {
        return c.json({
            success: false,
            message: "Failed to remove item from GroupCode.",
            error: (e as Error).message
        }, 500);
    }
}

import { Context } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Membuat GroupCode (Hanya Mengisi Name)
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

// Menghapus GroupCode dan ItemGroup terkait
export async function deleteGroupCode(c: Context) {
    try {
        const groupCodeId = c.req.param("id");
        await prisma.itemGroup.deleteMany({ where: { groupId: groupCodeId } });
        await prisma.groupCode.delete({ where: { id: groupCodeId } });

        return c.json({ success: true, message: "GroupCode deleted successfully!" }, 200);
    } catch (e) {
        return c.json({ success: false, message: "Failed to delete GroupCode.", error: (e as Error).message }, 500);
    }
}

// Mendapatkan Semua GroupCode
export async function getAllGroupCodes(c: Context) {
    try {
        const groupCodes = await prisma.groupCode.findMany();
        return c.json({ success: true, message: "List of all GroupCodes!", data: groupCodes }, 200);
    } catch (e) {
        return c.json({ success: false, message: "Failed to retrieve GroupCodes.", error: (e as Error).message }, 500);
    }
}

// Melihat Item di dalam GroupCode
export async function getItemsByGroupCode(c: Context) {
    try {
        const groupCodeId = c.req.param("id");
        const items = await prisma.itemGroup.findMany({
            where: { groupId: groupCodeId },
            include: { item: true }
        });

        return c.json({ success: true, message: "Items in GroupCode", data: items.map(i => i.item) }, 200);
    } catch (e) {
        return c.json({ success: false, message: "Failed to retrieve items.", error: (e as Error).message }, 500);
    }
}

// Menambahkan Item ke GroupCode
export async function addItemToGroupCode(c: Context) {
    try {
        const { itemId, groupCodeId } = await c.req.json();
        const existing = await prisma.itemGroup.findFirst({ where: { itemId, groupId: groupCodeId } });

        if (existing) return c.json({ success: false, message: "Item already exists in this GroupCode." }, 400);

        const itemGroup = await prisma.itemGroup.create({ data: { itemId, groupId: groupCodeId } });
        return c.json({ success: true, message: "Item added to GroupCode!", data: itemGroup }, 201);
    } catch (e) {
        return c.json({ success: false, message: "Failed to add item to GroupCode.", error: (e as Error).message }, 500);
    }
}

// Menghapus Item dari GroupCode
export async function removeItemFromGroupCode(c: Context) {
    try {
        const { itemId, groupCodeId } = await c.req.json();
        await prisma.itemGroup.deleteMany({ where: { itemId, groupId: groupCodeId } });

        return c.json({ success: true, message: "Item removed from GroupCode!" }, 200);
    } catch (e) {
        return c.json({ success: false, message: "Failed to remove item from GroupCode.", error: (e as Error).message }, 500);
    }
}

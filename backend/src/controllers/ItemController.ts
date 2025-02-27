import { Context } from "hono";
import { randomBytes } from "crypto";
import dayjs from "dayjs";
import { PrismaClient, ItemStatus } from "@prisma/client";
import { writeFile } from "fs/promises";

const prisma = new PrismaClient();

export async function getAllItems(c: Context) {
    try {
        const items = await prisma.item.findMany({
            orderBy: { createdAt: "desc" },
        });

        return c.json({
            success: true,
            message: "List of all items!",
            data: items,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving items: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve items.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function getItemById(c: Context) {
    try {
        const itemId = c.req.param("id");

        const item = await prisma.item.findUnique({
            where: { id: itemId },
        });

        if (!item) {
            return c.json({
                success: false,
                message: "Item not found!",
            }, 404);
        }

        return c.json({
            success: true,
            message: `Item details for ID: ${itemId}`,
            data: item,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving item: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve item.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function getItemsByGroupCode(c: Context) {
    try {
        const groupCode = c.req.param("groupCode");

        const items = await prisma.item.findMany({
            where: { groupCode: groupCode },
            orderBy: { createdAt: "desc" },
        });

        if (items.length === 0) {
            return c.json({
                success: false,
                message: `No items found with groupCode: ${groupCode}`,
            }, 404);
        }

        return c.json({
            success: true,
            message: `List of items with groupCode: ${groupCode}`,
            data: items,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving items by groupCode: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve items by groupCode.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

const saveFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const fileName = `uploads/${Date.now()}-${file.name}`;
    await writeFile(fileName, Buffer.from(buffer));
    return fileName;
};

export async function uploadItemFiles(c: Context) {
    try {
        const body = await c.req.parseBody();
        const formData = await c.req.formData();

        const categoryId = typeof body["categoryId"] === "string" ? body["categoryId"] : undefined;
        const areaId = typeof body["areaId"] === "string" ? body["areaId"] : undefined;
        const name = typeof body["name"] === "string" ? body["name"] : undefined;
        const price = parseInt(typeof body["price"] === "string" ? body["price"] : "0");
        const photo = formData.get("photo") as File | null;
        const receipt = formData.get("receipt") as File | null;
        const examinationPeriod = parseInt(typeof body["examinationPeriod"] === "string" ? body["examinationPeriod"] : "0");
        const groupCode = typeof body["groupCode"] === "string" ? body["groupCode"] : null;

        if (!categoryId || !areaId || !name || !photo || !receipt || !price) {
            return c.json({
                success: false,
                message: "All fields are required.",
            }, 400);
        }

        const photoPath = await saveFile(photo);
        const receiptPath = await saveFile(receipt);

        const code = randomBytes(3).toString("hex").toUpperCase();
        const examinationDate = examinationPeriod > 0 ? dayjs().add(examinationPeriod * 30, "day").toISOString() : null;

        const item = await prisma.item.create({
            data: {
                categoryId,
                areaId,
                name,
                price,
                photo: photoPath,
                receipt: receiptPath,
                code,
                examinationPeriod: examinationDate,
                groupCode,
            },
        });

        return c.json({
            success: true,
            message: "Item successfully created!",
            data: item,
        }, 201);
    } catch (e: unknown) {
        console.error(`Error creating item: ${e}`);
        return c.json({
            success: false,
            message: "Failed to create item.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function updateItemFiles(c: Context) {
    try {
        const itemId = c.req.param("id");
        const body = await c.req.parseBody();
        const formData = await c.req.formData();

        const existingItem = await prisma.item.findUnique({ where: { id: itemId } });

        if (!existingItem) {
            return c.json({
                success: false,
                message: "Item not found!",
            }, 404);
        }

        const categoryId = typeof body["categoryId"] === "string" ? body["categoryId"] : existingItem.categoryId;
        const areaId = typeof body["areaId"] === "string" ? body["areaId"] : existingItem.areaId;
        const photo = formData.get("photo") as File | null;
        const receipt = formData.get("receipt") as File | null;

        const updatedData: any = {
            categoryId,
            areaId,
        };

        if (photo) updatedData.photo = await saveFile(photo);
        if (receipt) updatedData.receipt = await saveFile(receipt);

        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: updatedData,
        });

        return c.json({
            success: true,
            message: "Item successfully updated!",
            data: updatedItem,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error updating item: ${e}`);
        return c.json({
            success: false,
            message: "Failed to update item.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function deleteItem(c: Context) {
    try {
        const user = c.get("jwtPayload");

        if (user.role !== "owner") {
            return c.json({
                success: false,
                message: "You are not authorized to delete this item.",
            }, 403);
        }

        const itemId = c.req.param("id");

        const existingItem = await prisma.item.findUnique({ where: { id: itemId } });

        if (!existingItem) {
            return c.json({
                success: false,
                message: "Item not found!",
            }, 404);
        }

        await prisma.item.delete({ where: { id: itemId } });

        return c.json({
            success: true,
            message: "Item successfully deleted!",
        }, 200);
    } catch (e: unknown) {
        console.error(`Error deleting item: ${e}`);
        return c.json({
            success: false,
            message: "Failed to delete item.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function getUpcomingExaminations(c: Context) {
    try {
        const today = dayjs();
        const oneWeekAhead = today.add(7, "day");

        const items = await prisma.item.findMany({
            where: {
                examinationPeriod: {
                    not: null,
                },
            },
        });

        const upcomingExaminations = items.filter((item) => {
            const examinationDate = dayjs(item.examinationPeriod);
            return examinationDate.isAfter(today) && examinationDate.isBefore(oneWeekAhead);
        });

        return c.json({
            success: true,
            message: "List of items nearing examination period!",
            data: upcomingExaminations,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving upcoming examinations: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve upcoming examinations.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}
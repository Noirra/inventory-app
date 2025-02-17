import { Context } from "hono";
import prisma from "../../prisma/client";
import { randomBytes } from "crypto";
import { Status } from "@prisma/client";

export const getItemRequests = async (c: Context) => {
    try {
        const user = c.get("jwtPayload");
        const itemRequests = await prisma.itemRequest.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return c.json({
            success: true,
            message: "List of Item Requests!",
            data: itemRequests,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error getting item requests: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve item requests.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
};

export async function getItemRequestById(c: Context) {
    try {
        const user = c.get("jwtPayload");
        const requestId = c.req.param("id");

        const itemRequest = await prisma.itemRequest.findUnique({
            where: { id: requestId, userId: user.id },
        });

        if (!itemRequest) {
            return c.json({
                success: false,
                message: "Item Request Not Found!",
            }, 404);
        }

        return c.json({
            success: true,
            message: `Item Request Details for ID: ${requestId}`,
            data: itemRequest,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error finding item request: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve item request.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function createItemRequest(c: Context) {
    try {
        const user = c.get("jwtPayload");
        const body = await c.req.parseBody();

        const name = typeof body["name"] === "string" ? body["name"] : "";
        const desc = typeof body["desc"] === "string" ? body["desc"] : "";
        const priceRange = typeof body["priceRange"] === "string" ? body["priceRange"] : "";
        const referenceLink = typeof body["referenceLink"] === "string" ? body["referenceLink"] : "";
        const code = randomBytes(4).toString("hex").toUpperCase();

        if (!name || !desc || !priceRange || !referenceLink) {
            return c.json({
                success: false,
                message: "All fields are required.",
            }, 400);
        }

        const itemRequest = await prisma.itemRequest.create({
            data: { userId: user.id, name, desc, priceRange, referenceLink, code },
        });

        return c.json({
            success: true,
            message: "Item Request Created Successfully!",
            data: itemRequest,
        }, 201);
    } catch (e: unknown) {
        console.error(`Error creating item request: ${e}`);
        return c.json({
            success: false,
            message: "Failed to create item request.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function updateItemRequest(c: Context) {
    try {
        const user = c.get("jwtPayload");
        const requestId = c.req.param("id");
        const body = await c.req.parseBody();

        const existingRequest = await prisma.itemRequest.findUnique({
            where: { id: requestId, userId: user.id },
        });

        if (!existingRequest) {
            return c.json({
                success: false,
                message: "Item Request Not Found!",
            }, 404);
        }

        const statusValues: Status[] = Object.values(Status);
        const newStatus = body["status"] as Status | undefined;

        if (!newStatus || !statusValues.includes(newStatus)) {
            return c.json({
                success: false,
                message: "Invalid status value.",
            }, 400);
        }

        const updatedRequest = await prisma.itemRequest.update({
            where: { id: requestId },
            data: { status: newStatus },
        });

        return c.json({
            success: true,
            message: "Item Request Status Updated Successfully!",
            data: updatedRequest,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error updating item request: ${e}`);
        return c.json({
            success: false,
            message: "Failed to update item request.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

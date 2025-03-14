import { Context } from "hono";
import prisma from "../../prisma/client";
import { randomBytes } from "crypto";
import { Status } from "@prisma/client";

export const getItemRequests = async (c: Context) => {
    try {
        const user = c.get("jwtPayload");
        const itemRequests = await prisma.itemRequest.findMany({
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

export async function createItemRequest(c: Context) {
    try {
        const user = c.get("jwtPayload");
        const body = await c.req.json();

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

export async function approveAdmin(c: Context) {
    try {
        const requestId = c.req.param("id");
        const user = c.get("jwtPayload");

        const existingRequest = await prisma.itemRequest.findUnique({
            where: { id: requestId },
        });

        if (!existingRequest) {
            return c.json({
                success: false,
                message: "Item Request Not Found!",
            }, 404);
        }

        await prisma.requestApproved.create({
            data: { requestId, userId: user.id },
        });

        return c.json({
            success: true,
            message: "Item Request Approved!",
        }, 200);
    } catch (e: unknown) {
        console.error(`Error approving item request: ${e}`);
        return c.json({
            success: false,
            message: "Failed to approve item request.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function approveOwner(c: Context) {
    try {
        const user = c.get("jwtPayload");
        const requestId = c.req.param("id");

        const existingRequest = await prisma.itemRequest.findUnique({
            where: { id: requestId },
        });

        if (!existingRequest) {
            return c.json({
                success: false,
                message: "Item Request Not Found!",
            }, 404);
        }

        if (existingRequest.status !== "PENDING") {
            return c.json({
                success: false,
                message: "Request sudah diproses sebelumnya!",
            }, 400);
        }

        const updatedRequest = await prisma.itemRequest.update({
            where: { id: requestId },
            data: { status: "APPROVED" },
        });

        return c.json({
            success: true,
            message: "Item Request Approved by Owner!",
            data: updatedRequest,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error approving item request by owner: ${e}`);
        return c.json({
            success: false,
            message: "Failed to approve item request by owner.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function rejectItemRequest(c: Context) {
    try {
        const requestId = c.req.param("id");

        const existingRequest = await prisma.itemRequest.findUnique({
            where: { id: requestId },
        });

        if (!existingRequest) {
            return c.json({
                success: false,
                message: "Item Request Not Found!",
            }, 404);
        }

        await prisma.itemRequest.update({
            where: { id: requestId },
            data: { status: Status.REJECTED },
        });

        return c.json({
            success: true,
            message: "Item Request Rejected!",
        }, 200);
    } catch (e: unknown) {
        console.error(`Error rejecting item request: ${e}`);
        return c.json({
            success: false,
            message: "Failed to reject item request.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function completeItemRequest(c: Context) {
    try {
        const requestId = c.req.param("id");

        const existingRequest = await prisma.itemRequest.findUnique({
            where: { id: requestId },
        });

        if (!existingRequest) {
            return c.json({
                success: false,
                message: "Item Request Not Found!",
            }, 404);
        }

        await prisma.itemRequest.update({
            where: { id: requestId },
            data: { status: Status.COMPLETED },
        });

        return c.json({
            success: true,
            message: "Item Request Marked as Completed!",
        }, 200);
    } catch (e: unknown) {
        console.error(`Error completing item request: ${e}`);
        return c.json({
            success: false,
            message: "Failed to complete item request.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

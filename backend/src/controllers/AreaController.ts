import { Context } from "hono";
import prisma from "../../prisma/client";

export const getAreas = async (c: Context) => {
    try {
        const areas = await prisma.area.findMany({ orderBy: { id: "desc" } });

        return c.json({
            success: true,
            message: "List Data Area!",
            data: areas,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error getting areas: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve areas.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
};

export async function getAreaById(c: Context) {
    try {
        const areaId = c.req.param("id");

        const area = await prisma.area.findUnique({
            where: { id: areaId },
        });

        if (!area) {
            return c.json({
                success: false,
                message: "Area Not Found!",
            }, 404);
        }

        return c.json({
            success: true,
            message: `Detail Data Area By ID: ${areaId}`,
            data: area,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error finding area: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve area.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function createArea(c: Context) {
    try {
        const body = await c.req.json();

        const name = typeof body["name"] === "string" ? body["name"] : "";
        const code = typeof body["code"] === "string" ? body["code"] : "";

        if (!code || code.length > 3) {
            return c.json({
                success: false,
                message: "code (max 3 characters) are required.",
            }, 400);
        }

        const area = await prisma.area.create({
            data: { name, code },
        });

        return c.json({
            success: true,
            message: "Area Created Successfully!",
            data: area,
        }, 201);
    } catch (e: unknown) {
        console.error(`Error creating area: ${e}`);
        return c.json({
            success: false,
            message: "Failed to create area.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function updateArea(c: Context) {
    try {
        const areaId = c.req.param("id");
        const body = await c.req.json();

        const name = typeof body["name"] === "string" ? body["name"] : "";
        const code = typeof body["code"] === "string" ? body["code"] : "";

        if (code && code.length > 3) {
            return c.json({
                success: false,
                message: "Code must be at most 3 characters.",
            }, 400);
        }

        const existingArea = await prisma.area.findUnique({
            where: { id: areaId },
        });

        if (!existingArea) {
            return c.json({
                success: false,
                message: "Area Not Found!",
            }, 404);
        }

        const updatedArea = await prisma.area.update({
            where: { id: areaId },
            data: {
                name: name || undefined,
                code: code || undefined,
            },
        });

        return c.json({
            success: true,
            message: "Area Updated Successfully!",
            data: updatedArea,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error updating area: ${e}`);
        return c.json({
            success: false,
            message: "Failed to update area.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function deleteArea(c: Context) {
    try {
        const areaId = c.req.param("id");

        const existingArea = await prisma.area.findUnique({
            where: { id: areaId },
        });

        if (!existingArea) {
            return c.json({
                success: false,
                message: "Area Not Found!",
            }, 404);
        }

        await prisma.area.delete({
            where: { id: areaId },
        });

        return c.json({
            success: true,
            message: "Area Deleted Successfully!",
        }, 200);
    } catch (e: unknown) {
        console.error(`Error deleting area: ${e}`);
        return c.json({
            success: false,
            message: "Failed to delete area.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}
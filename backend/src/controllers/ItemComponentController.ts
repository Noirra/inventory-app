import { Context } from "hono";
import prisma from "../../prisma/client";
import { randomBytes } from "crypto";

export async function getComponentsByItemId(c: Context) {
    try {
        const itemId = c.req.param("itemId");

        const components = await prisma.component.findMany({
            where: { itemId },
            orderBy: { createdAt: "desc" },
        });

        return c.json({
            success: true,
            message: `Components for item ID: ${itemId}`,
            data: components,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving components: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve components.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function getComponentById(c: Context) {
    try {
        const itemId = c.req.param("itemId");
        const componentId = c.req.param("componentId");

        const component = await prisma.component.findFirst({
            where: { id: componentId, itemId },
        });

        if (!component) {
            return c.json({
                success: false,
                message: "Component not found!",
            }, 404);
        }

        return c.json({
            success: true,
            message: `Component details for item ID: ${itemId} and component ID: ${componentId}`,
            data: component,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error retrieving component: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve component.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function createComponent(c: Context) {
    try {
        const itemId = c.req.param("itemId");
        const body = await c.req.json();
        const name = typeof body["name"] === "string" ? body["name"] : undefined;
        const photo = typeof body["photo"] === "string" ? body["photo"] : undefined;

        if (!name || !photo) {
            return c.json({
                success: false,
                message: "Name and photo are required.",
            }, 400);
        }

        const code = randomBytes(3).toString("hex").toUpperCase();

        const component = await prisma.component.create({
            data: { itemId, name, photo, code },
        });

        return c.json({
            success: true,
            message: "Component successfully created!",
            data: component,
        }, 201);
    } catch (e: unknown) {
        console.error(`Error creating component: ${e}`);
        return c.json({
            success: false,
            message: "Failed to create component.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function updateComponent(c: Context) {
    try {
        const itemId = c.req.param("itemId");
        const componentId = c.req.param("componentId");
        const body = await c.req.json();

        const existingComponent = await prisma.component.findFirst({
            where: { id: componentId, itemId },
        });

        if (!existingComponent) {
            return c.json({
                success: false,
                message: "Component not found!",
            }, 404);
        }

        const updatedComponent = await prisma.component.update({
            where: { id: componentId },
            data: {
                name: typeof body["name"] === "string" ? body["name"] : existingComponent.name,
                photo: typeof body["photo"] === "string" ? body["photo"] : existingComponent.photo,
            },
        });

        return c.json({
            success: true,
            message: "Component successfully updated!",
            data: updatedComponent,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error updating component: ${e}`);
        return c.json({
            success: false,
            message: "Failed to update component.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}

export async function deleteComponent(c: Context) {
    try {
        const itemId = c.req.param("itemId");
        const componentId = c.req.param("componentId");

        const existingComponent = await prisma.component.findFirst({
            where: { id: componentId, itemId },
        });

        if (!existingComponent) {
            return c.json({
                success: false,
                message: "Component not found!",
            }, 404);
        }

        await prisma.component.delete({ where: { id: componentId } });

        return c.json({
            success: true,
            message: "Component successfully deleted!",
        }, 200);
    } catch (e: unknown) {
        console.error(`Error deleting component: ${e}`);
        return c.json({
            success: false,
            message: "Failed to delete component.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
}
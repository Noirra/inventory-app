import { Context } from "hono";
import prisma from "../../prisma/client";
import { randomBytes } from "crypto";
import {writeFile} from "fs/promises";

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

const saveFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const fileName = `uploads/${Date.now()}-${file.name}`;
    await writeFile(fileName, Buffer.from(buffer));
    return fileName;
};

export async function createComponent(c: Context) {
    try {
        const itemId = c.req.param("itemId");
        const formData = await c.req.formData();
        const name = formData.get("name");
        const photo = formData.get("photo") as File | null;

        if (!name || typeof name !== "string" || !photo) {
            return c.json({
                success: false,
                message: "Name and photo are required.",
            }, 400);
        }

        const code = randomBytes(3).toString("hex").toUpperCase();
        const photoPath = await saveFile(photo);

        const component = await prisma.component.create({
            data: { itemId, name, photo: photoPath, code },
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
        const formData = await c.req.formData();
        const name = formData.get("name");
        const photo = formData.get("photo") as File | null;

        const existingComponent = await prisma.component.findFirst({
            where: { id: componentId, itemId },
        });

        if (!existingComponent) {
            return c.json({
                success: false,
                message: "Component not found!",
            }, 404);
        }

        let photoPath = existingComponent.photo;
        if (photo) {
            photoPath = await saveFile(photo);
        }

        const updatedComponent = await prisma.component.update({
            where: { id: componentId },
            data: {
                name: typeof name === "string" ? name : existingComponent.name,
                photo: photoPath,
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
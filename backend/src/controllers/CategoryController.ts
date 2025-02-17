import { Context } from "hono";
import prisma from "../../prisma/client";

export const getCategories = async (c: Context) => {
    try {
        const categories = await prisma.category.findMany({ include: { items: true } });
        return c.json({
            success: true,
            message: "List Data Categories!",
            data: categories,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error getting categories: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve categories.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
};

export const getCategoryById = async (c: Context) => {
    try {
        const categoryId = c.req.param("id");
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { items: true },
        });

        if (!category) {
            return c.json({
                success: false,
                message: "Category Not Found!",
            }, 404);
        }

        return c.json({
            success: true,
            message: `Detail Data Category By ID: ${categoryId}`,
            data: category,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error finding category: ${e}`);
        return c.json({
            success: false,
            message: "Failed to retrieve category.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
};

export const createCategory = async (c: Context) => {
    try {
        const body = await c.req.parseBody();
        const name = typeof body["name"] === "string" ? body["name"] : "";
        const code = typeof body["code"] === "string" ? body["code"] : "";

        if (!name || !code || code.length > 3) {
            return c.json({
                success: false,
                message: "Name is required and code must be at most 3 characters.",
            }, 400);
        }

        const category = await prisma.category.create({
            data: { name, code },
        });

        return c.json({
            success: true,
            message: "Category Created Successfully!",
            data: category,
        }, 201);
    } catch (e: unknown) {
        console.error(`Error creating category: ${e}`);
        return c.json({
            success: false,
            message: "Failed to create category.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
};

export const updateCategory = async (c: Context) => {
    try {
        const categoryId = c.req.param("id");
        const body = await c.req.parseBody();
        const name = typeof body["name"] === "string" ? body["name"] : "";
        const code = typeof body["code"] === "string" ? body["code"] : "";

        if (code && code.length > 3) {
            return c.json({
                success: false,
                message: "Code must be at most 3 characters.",
            }, 400);
        }

        const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!existingCategory) {
            return c.json({
                success: false,
                message: "Category Not Found!",
            }, 404);
        }

        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name: name || undefined,
                code: code || undefined,
            },
        });

        return c.json({
            success: true,
            message: "Category Updated Successfully!",
            data: updatedCategory,
        }, 200);
    } catch (e: unknown) {
        console.error(`Error updating category: ${e}`);
        return c.json({
            success: false,
            message: "Failed to update category.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
};

export const deleteCategory = async (c: Context) => {
    try {
        const categoryId = c.req.param("id");
        const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!existingCategory) {
            return c.json({
                success: false,
                message: "Category Not Found!",
            }, 404);
        }

        await prisma.category.delete({ where: { id: categoryId } });

        return c.json({
            success: true,
            message: "Category Deleted Successfully!",
        }, 200);
    } catch (e: unknown) {
        console.error(`Error deleting category: ${e}`);
        return c.json({
            success: false,
            message: "Failed to delete category.",
            error: e instanceof Error ? e.message : "Unknown error",
        }, 500);
    }
};

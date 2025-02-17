import { Hono } from "hono";
import { getComponentsByItemId, createComponent, getComponentById, updateComponent, deleteComponent } from "../controllers/ItemComponentController";

const componentRouter = new Hono();

componentRouter.get("/items/:itemId/components", getComponentsByItemId);
componentRouter.post("/items/:itemId/components", createComponent);
componentRouter.get("/items/:itemId/components/:componentId", getComponentById);
componentRouter.patch("/items/:itemId/components/:componentId", updateComponent);
componentRouter.delete("/items/:itemId/components/:componentId", deleteComponent);

export { componentRouter as ComponentRoutes };

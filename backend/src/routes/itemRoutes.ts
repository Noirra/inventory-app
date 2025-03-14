import { Hono } from "hono";
import { getAllItems, uploadItemFiles, getItemById, updateItemFiles, deleteItem, getUpcomingExaminations } from "../controllers/ItemController";

const itemRouter = new Hono();

itemRouter.get("/", getAllItems);
itemRouter.post("/", uploadItemFiles);
itemRouter.get("/:id", getItemById);
itemRouter.patch("/:id", updateItemFiles);
itemRouter.delete("/:id", deleteItem);
itemRouter.get("/examination/check", getUpcomingExaminations);

export { itemRouter as ItemRoutes };

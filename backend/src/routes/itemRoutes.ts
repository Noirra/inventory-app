import { Hono } from "hono";
import { getAllItems, uploadItemFiles, getItemById, updateItemFiles, deleteItem, getUpcomingExaminations, getItemsByGroupCode } from "../controllers/ItemController";

const itemRouter = new Hono();

itemRouter.get("/", getAllItems);
itemRouter.post("/", uploadItemFiles);
itemRouter.get("/:id", getItemById);
itemRouter.get("/group-code/:groupCode", getItemsByGroupCode);
itemRouter.patch("/:id", updateItemFiles);
itemRouter.delete("/:id", deleteItem);
itemRouter.get("/examination/check", getUpcomingExaminations);

export { itemRouter as ItemRoutes };

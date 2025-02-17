import { Hono } from "hono";
import { getAllItems, uploadItemFiles, getItemById, updateItemFiles, deleteItem, checkItemExamination } from "../controllers/ItemController";

const itemRouter = new Hono();

itemRouter.get("/", getAllItems);
itemRouter.post("/", uploadItemFiles);
itemRouter.get("/:id", getItemById);
itemRouter.patch("/:id", updateItemFiles);
itemRouter.delete("/:id", deleteItem);
itemRouter.get("/examination/check", checkItemExamination);

export { itemRouter as ItemRoutes };

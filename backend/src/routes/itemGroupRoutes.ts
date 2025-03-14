import {Hono} from "hono";
import { getItemsByGroupCode,getAllGroupCodes, createGroupCode, deleteGroupCode, addItemToGroupCode, removeItemFromGroupCode } from "../controllers/ItemGroupController";

const groupCodeRouter = new Hono();

groupCodeRouter.get("/", getAllGroupCodes);
groupCodeRouter.post("/", createGroupCode);
groupCodeRouter.delete("/:id", deleteGroupCode);
groupCodeRouter.get("/:groupCodeId/items", getItemsByGroupCode);
groupCodeRouter.post("/:groupCodeId/items", addItemToGroupCode);
groupCodeRouter.delete("/:groupCodeId/items/:itemId", removeItemFromGroupCode);

export { groupCodeRouter as GroupCodeRoutes };

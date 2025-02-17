import { Hono } from "hono";
import { getItemRequests, createItemRequest, getItemRequestById, updateItemRequest } from "../controllers/ItemRequestController";
import authorizeRole from "./middleware/authorizeRole";

const itemRequestRouter = new Hono();

itemRequestRouter.get("/", getItemRequests);
itemRequestRouter.post("/", createItemRequest);
itemRequestRouter.get("/:id", getItemRequestById);
itemRequestRouter.patch("/:id", authorizeRole(["owner"]), updateItemRequest);

export { itemRequestRouter as ItemRequestRoutes };

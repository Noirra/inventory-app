import { Hono } from "hono";
import { getItemRequests, createItemRequest, approveAdmin, approveOwner, rejectItemRequest, completeItemRequest } from "../controllers/ItemRequestController";
import authorizeRole from "./middleware/authorizeRole";

const itemRequestRouter = new Hono();

itemRequestRouter.get("/", getItemRequests);
itemRequestRouter.post("/", createItemRequest);
itemRequestRouter.patch("/:id/approve-admin", approveAdmin);
itemRequestRouter.patch("/:id/approve-owner", approveOwner);
itemRequestRouter.patch("/:id/reject", rejectItemRequest);
itemRequestRouter.patch("/:id/complete", completeItemRequest);

export { itemRequestRouter as ItemRequestRoutes };

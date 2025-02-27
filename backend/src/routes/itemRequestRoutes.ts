import { Hono } from "hono";
import { getItemRequests, createItemRequest, approveAdmin, approveOwner, rejectItemRequest, completeItemRequest } from "../controllers/ItemRequestController";
import authorizeRole from "./middleware/authorizeRole";

const itemRequestRouter = new Hono();

itemRequestRouter.get("/", authorizeRole(["admin"]), getItemRequests);
itemRequestRouter.post("/", createItemRequest);
itemRequestRouter.patch("/:id/approve-admin", authorizeRole(["admin"]), approveAdmin);
itemRequestRouter.patch("/:id/approve-owner", authorizeRole(["owner"]), approveOwner);
itemRequestRouter.patch("/:id/reject", authorizeRole(["admin", "owner"]), rejectItemRequest);
itemRequestRouter.patch("/:id/complete", authorizeRole(["admin"]), completeItemRequest);

export { itemRequestRouter as ItemRequestRoutes };

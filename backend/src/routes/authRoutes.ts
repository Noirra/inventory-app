import { Hono } from "hono";
import { login, logout } from "../controllers/AuthController";

const authRouter = new Hono();

authRouter.post("/login", login);
authRouter.post("/logout", logout);

export { authRouter as AuthRoutes };

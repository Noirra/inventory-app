import { Hono } from "hono";
import { jwt } from "hono/jwt";
import authorizeRole from "./routes/middleware/authorizeRole";
import { serveStatic } from 'hono/bun'
import { AreaRoutes } from "./routes/areaRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { AuthRoutes } from "./routes/authRoutes";
import { CategoriesRoutes } from "./routes/categoryRoutes";
import { ItemRoutes } from "./routes/itemRoutes";
import { ItemRequestRoutes } from "./routes/itemRequestRoutes";
import { ComponentRoutes } from "./routes/itemComponentRoutes";
import { userItemRoutes } from "./routes/userItemRoutes";
import { authMiddleware } from "./routes/middleware/authMiddleware";
import { GroupCodeRoutes } from "./routes/itemGroupRoutes";
import { getRouterName, showRoutes } from 'hono/dev'
import {cors} from "hono/cors";

const secureRoute = new Hono();
const JWT_SECRET = "admin123";

secureRoute.use("*", authMiddleware);

secureRoute.get("/profile", async (c) => {
  const user = c.get("jwtPayload");
  return c.json({ user });
});

secureRoute.route("/users", UserRoutes);
secureRoute.route("/areas", AreaRoutes);
secureRoute.route("/categories", CategoriesRoutes);
secureRoute.route("/items", ItemRoutes);
secureRoute.route("/components", ComponentRoutes);
secureRoute.route("/item-request", ItemRequestRoutes);
secureRoute.route("item-group", GroupCodeRoutes);
secureRoute.route("/user-items", userItemRoutes);


const app = new Hono();
app.use("*", cors());
app.use('/uploads/*', serveStatic({ root: './' }))
app.route("/auth", AuthRoutes);
app.route("/", secureRoute);

showRoutes(app);

export default {
  port: 3000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};

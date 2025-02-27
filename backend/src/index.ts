import { Hono } from "hono";
import { jwt } from "hono/jwt";
import authorizeRole from "./routes/middleware/authorizeRole";
import { AreaRoutes } from "./routes/areaRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { AuthRoutes } from "./routes/authRoutes";
import { CategoriesRoutes } from "./routes/categoryRoutes";
import { ItemRoutes } from "./routes/itemRoutes";
import { ItemRequestRoutes } from "./routes/itemRequestRoutes";
import { ComponentRoutes } from "./routes/itemComponentRoutes";
import { userItemRoutes } from "./routes/userItemRoutes";
import { authMiddleware } from "./routes/middleware/authMiddleware";
import { getRouterName, showRoutes } from 'hono/dev'

const app = new Hono();
const JWT_SECRET = "admin123";

app.route("/auth", AuthRoutes);

// app.use("*", authMiddleware)
//
// app.use("*", async (c, next) => {
//   if (!c.req.path.startsWith("/auth")) {
//     return jwt({ secret: JWT_SECRET })(c, next);
//   }
//   await next();
// });

app.get("/profile", async (c) => {
  const user = c.get("jwtPayload");
  return c.json({ user });
});

app.route("/users", UserRoutes);
app.route("/areas", AreaRoutes);
app.route("/categories", CategoriesRoutes);
app.route("/items", ItemRoutes);
app.route("/", ComponentRoutes);
app.route("/item-request", ItemRequestRoutes);
app.route("/user-items", userItemRoutes);

showRoutes(app);

export default app;
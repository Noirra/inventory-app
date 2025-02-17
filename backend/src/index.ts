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

const app = new Hono();
const JWT_SECRET = "admin123";

app.route("/auth", AuthRoutes);

app.use("*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return c.json({ success: false, message: "Token has been logged out." }, 401);
    }
  }
  await next();
});

app.use("*", async (c, next) => {
  if (!c.req.path.startsWith("/auth")) {
    return jwt({ secret: JWT_SECRET })(c, next);
  }
  await next();
});

app.get("/profile", async (c) => {
  const user = c.get("jwtPayload");
  return c.json({ user });
});

const adminRoutes = [""];

adminRoutes.forEach((route) => {
  app.use(route, authorizeRole(["admin"]));
});

app.route("/users", UserRoutes);
app.route("/areas", AreaRoutes);
app.route("/categories", CategoriesRoutes);
app.route("/items", ItemRoutes);
app.route("/", ComponentRoutes);
app.route("/item-request", ItemRequestRoutes);

export default app;
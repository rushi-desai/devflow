import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error";
import organizationRoutes from "./routes/organization.routes";
import projectRoutes from "./routes/project.routes";
import boardRoutes from "./routes/board.routes";
import taskRoutes from "./routes/task.routes";
import commentRoutes from "./routes/comment.routes";
import activityRoutes from "./routes/activity.routes";
import { swaggerUi, swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      name: "DevFlow API",
      version: "1.0.0",
      status: "online",
      message: "DevFlow API is running",
      documentation: "/docs"
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/organizations", organizationRoutes);
app.use("/organizations/:organizationId/projects", projectRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:projectId/boards", boardRoutes);
app.use("/boards", boardRoutes);
app.use("/boards/:boardId/tasks", taskRoutes);
app.use("/tasks", taskRoutes);
app.use("/tasks/:taskId/comments", commentRoutes);
app.use("/activities", activityRoutes);

app.use(errorHandler);

export default app;
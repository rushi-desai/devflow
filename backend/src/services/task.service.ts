import { BoardStatus } from "@prisma/client";
import prisma from "../config/prisma";
import { logActivity } from "../utils/activity";

export type TaskInput = {
  title: string;
  description?: string | undefined;
  status?: BoardStatus | undefined;
  assigneeId?: number | null | undefined;
};

export const listTasks = (boardId: number) => {
  return prisma.task.findMany({
    where: { boardId },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { createdAt: "asc" }
  });
};

export const getTaskById = async (taskId: number) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: "asc" }
      },
      board: {
        include: {
          project: {
            include: {
              organization: {
                include: {
                  members: {
                    include: {
                      user: { select: { id: true, name: true, email: true } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  return task;
};

export const createTask = async (userId: number, boardId: number, data: TaskInput) => {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      ...(data.description ? { description: data.description } : {}),
      status: data.status || BoardStatus.TODO,
      boardId,
      ...(data.assigneeId ? { assigneeId: Number(data.assigneeId) } : {})
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      comments: true
    }
  });

  await logActivity(userId, "created", "task", task.id, { title: task.title, status: task.status });
  return task;
};

export const updateTask = async (
  userId: number,
  taskId: number,
  data: Partial<TaskInput>
) => {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.assigneeId !== undefined) {
    updateData.assigneeId = data.assigneeId ? Number(data.assigneeId) : null;
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  await logActivity(userId, "updated", "task", task.id, {
    title: task.title,
    status: task.status,
    assigneeId: task.assigneeId
  });

  return task;
};

export const deleteTask = async (userId: number, taskId: number) => {
  const task = await prisma.task.delete({
    where: { id: taskId }
  });

  await logActivity(userId, "deleted", "task", taskId, { title: task.title });
  return task;
};
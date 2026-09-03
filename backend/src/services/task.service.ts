import { BoardStatus } from "@prisma/client";
import prisma from "../config/prisma";
import { logActivity } from "../utils/activity";

export type TaskInput = {
  title: string;
  description?: string | undefined;
  status?: BoardStatus | undefined;
  assigneeId?: number | null | undefined;
};

const boardForUser = (boardId: number, userId: number) => prisma.board.findFirst({
  where: { id: boardId, project: { organization: { members: { some: { userId } } } } },
  select: { id: true, project: { select: { organizationId: true } } }
});

const taskForUser = (taskId: number, userId: number) => prisma.task.findFirst({
  where: { id: taskId, board: { project: { organization: { members: { some: { userId } } } } } },
  select: { id: true, boardId: true, board: { select: { project: { select: { organizationId: true } } } } }
});

export const listTasks = async (boardId: number, userId: number) => {
  if (!(await boardForUser(boardId, userId))) {
    throw new Error("BOARD_NOT_FOUND");
  }

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

export const getTaskById = async (taskId: number, userId: number) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, board: { project: { organization: { members: { some: { userId } } } } } },
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
  const board = await boardForUser(boardId, userId);
  if (!board) {
    throw new Error("BOARD_NOT_FOUND");
  }

  if (data.assigneeId !== undefined && data.assigneeId !== null) {
    const assignee = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: board.project.organizationId, userId: data.assigneeId } }
    });
    if (!assignee) {
      throw new Error("ASSIGNEE_NOT_FOUND");
    }
  }

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
  const existingTask = await taskForUser(taskId, userId);
  if (!existingTask) {
    throw new Error("TASK_NOT_FOUND");
  }

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.assigneeId !== undefined) {
    updateData.assigneeId = data.assigneeId ? Number(data.assigneeId) : null;
  }

  if (data.assigneeId !== undefined && data.assigneeId !== null) {
    const assignee = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: existingTask.board.project.organizationId,
          userId: data.assigneeId
        }
      }
    });
    if (!assignee) {
      throw new Error("ASSIGNEE_NOT_FOUND");
    }
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
  const existingTask = await taskForUser(taskId, userId);
  if (!existingTask) {
    throw new Error("TASK_NOT_FOUND");
  }

  const task = await prisma.task.delete({
    where: { id: taskId }
  });

  await logActivity(userId, "deleted", "task", taskId, { title: task.title });
  return task;
};
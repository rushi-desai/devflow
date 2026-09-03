import prisma from "../config/prisma";
import { logActivity } from "../utils/activity";

const taskForUser = (taskId: number, userId: number) => prisma.task.findFirst({
  where: { id: taskId, board: { project: { organization: { members: { some: { userId } } } } } },
  select: { id: true }
});

export const listComments = async (taskId: number, userId: number) => {
  if (!(await taskForUser(taskId, userId))) {
    throw new Error("TASK_NOT_FOUND");
  }
  return prisma.comment.findMany({ where: { taskId }, include: { author: { select: { id: true, name: true } } } });
};

export const createComment = async (userId: number, taskId: number, content: string) => {
  if (!(await taskForUser(taskId, userId))) {
    throw new Error("TASK_NOT_FOUND");
  }
  const comment = await prisma.comment.create({ data: { taskId, authorId: userId, content } });
  await logActivity(userId, "created", "comment", comment.id);
  return comment;
};
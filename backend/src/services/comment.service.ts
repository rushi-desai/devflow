import prisma from "../config/prisma";
import { logActivity } from "../utils/activity";

export const listComments = (taskId: number) => {
  return prisma.comment.findMany({ where: { taskId }, include: { author: { select: { id: true, name: true } } } });
};

export const createComment = async (userId: number, taskId: number, content: string) => {
  const comment = await prisma.comment.create({ data: { taskId, authorId: userId, content } });
  await logActivity(userId, "created", "comment", comment.id);
  return comment;
};
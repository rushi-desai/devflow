import prisma from "../config/prisma";
import { logActivity } from "../utils/activity";

export const listBoards = (projectId: number) => {
  return prisma.board.findMany({
    where: { projectId },
    include: {
      tasks: {
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
      }
    },
    orderBy: { createdAt: "asc" }
  });
};

export const getBoardById = async (boardId: number) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
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
      },
      tasks: {
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
      }
    }
  });

  if (!board) {
    throw new Error("BOARD_NOT_FOUND");
  }

  return board;
};

export const createBoard = async (projectId: number, name: string, userId?: number) => {
  const board = await prisma.board.create({
    data: { projectId, name },
    include: {
      tasks: true
    }
  });

  if (userId) {
    await logActivity(userId, "created", "board", board.id, { name: board.name });
  }

  return board;
};
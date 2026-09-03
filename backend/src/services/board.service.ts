import prisma from "../config/prisma";
import { logActivity } from "../utils/activity";

export const listBoards = (projectId: number, userId: number) => {
  return prisma.board.findMany({
    where: { projectId, project: { organization: { members: { some: { userId } } } } },
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

export const getBoardById = async (boardId: number, userId: number) => {
  const board = await prisma.board.findFirst({
    where: { id: boardId, project: { organization: { members: { some: { userId } } } } },
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

export const createBoard = async (projectId: number, name: string, userId: number) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organization: { members: { some: { userId } } } },
    select: { id: true }
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const board = await prisma.board.create({
    data: { projectId, name },
    include: {
      tasks: true
    }
  });

  await logActivity(userId, "created", "board", board.id, { name: board.name });

  return board;
};
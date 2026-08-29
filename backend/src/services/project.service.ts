import prisma from "../config/prisma";
import { logActivity } from "../utils/activity";

export const listProjects = (organizationId: number, userId: number) => {
  return prisma.project.findMany({
    where: { organizationId, organization: { members: { some: { userId } } } },
    include: {
      boards: {
        include: {
          tasks: true
        }
      },
      owner: { select: { id: true, name: true, email: true } },
      organization: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const getProjectById = async (projectId: number, userId: number) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organization: { members: { some: { userId } } }
    },
    include: {
      boards: {
        include: {
          tasks: {
            include: {
              assignee: { select: { id: true, name: true, email: true } },
              comments: {
                include: {
                  author: { select: { id: true, name: true, email: true } }
                }
              }
            }
          }
        }
      },
      organization: {
        include: {
          members: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      },
      owner: { select: { id: true, name: true, email: true } }
    }
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  return project;
};

export const createProject = async (
  organizationId: number,
  userId: number,
  data: { name: string; description?: string | undefined }
) => {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      ...(data.description ? { description: data.description } : {}),
      organizationId,
      ownerId: userId
    },
    include: {
      boards: true,
      owner: { select: { id: true, name: true, email: true } },
      organization: { select: { id: true, name: true } }
    }
  });

  // Automatically create a default Board for this project (e.g. "Main Kanban")
  const defaultBoard = await prisma.board.create({
    data: {
      name: "Main Kanban",
      projectId: project.id
    },
    include: {
      tasks: true
    }
  });

  await logActivity(userId, "created", "project", project.id, { name: project.name });

  return {
    ...project,
    boards: [defaultBoard]
  };
};
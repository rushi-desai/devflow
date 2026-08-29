import prisma from "../config/prisma";

export const listActivities = (userId: number) => {
  return prisma.activityLog.findMany({
    where: {
      OR: [
        { userId },
        {
          user: {
            memberships: {
              some: {
                organization: {
                  members: {
                    some: { userId }
                  }
                }
              }
            }
          }
        }
      ]
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
};
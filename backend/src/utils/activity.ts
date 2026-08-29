import prisma from "../config/prisma";

export const logActivity = (
  userId: number,
  action: string,
  entity: string,
  entityId: number,
  metadata?: Record<string, any>
) => {
  return prisma.activityLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      ...(metadata ? { metadata } : {})
    }
  });
};
import prisma from "../config/prisma";
import { logActivity } from "../utils/activity";

export const listOrganizations = (userId: number) => {
  return prisma.organization.findMany({
    where: { members: { some: { userId } } },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      },
      projects: {
        include: {
          boards: {
            include: {
              tasks: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const getOrganizationById = async (organizationId: number, userId: number) => {
  const org = await prisma.organization.findFirst({
    where: {
      id: organizationId,
      members: { some: { userId } }
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      },
      projects: {
        include: {
          boards: {
            include: {
              tasks: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!org) {
    throw new Error("ORGANIZATION_NOT_FOUND");
  }

  return org;
};

export const createOrganization = async (userId: number, name: string) => {
  const org = await prisma.organization.create({
    data: {
      name,
      ownerId: userId,
      members: { create: { userId } }
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  await logActivity(userId, "created", "organization", org.id, { name: org.name });
  return org;
};

export const addMember = async (
  organizationId: number,
  userId: number,
  memberInput: { userId?: number | undefined; email?: string | undefined }
) => {
  let targetUserId = memberInput.userId;

  if (!targetUserId && memberInput.email) {
    const foundUser = await prisma.user.findUnique({
      where: { email: memberInput.email.toLowerCase().trim() }
    });
    if (!foundUser) {
      throw new Error("USER_NOT_FOUND");
    }
    targetUserId = foundUser.id;
  }

  if (!targetUserId) {
    throw new Error("INVALID_MEMBER_DATA");
  }

  // Check if member already exists
  const existingMembership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: targetUserId
      }
    }
  });

  if (existingMembership) {
    throw new Error("ALREADY_A_MEMBER");
  }

  const membership = await prisma.organizationMember.create({
    data: { organizationId, userId: targetUserId },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });

  await logActivity(userId, "added_member", "organization", organizationId, {
    memberId: targetUserId
  });

  return membership;
};

export const listMembers = (organizationId: number) => {
  return prisma.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
};
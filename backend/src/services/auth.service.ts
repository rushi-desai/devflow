import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { createToken } from "../utils/auth";
import { logActivity } from "../utils/activity";

type UserInput = {
  name?: string;
  email: string;
  password: string;
};

export const registerUser = async (data: UserInput) => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  const password = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name?.trim() ?? "", email: normalizedEmail, password }
  });

  await logActivity(user.id, "registered", "user", user.id);

  return {
    token: createToken(user.id),
    user: { id: user.id, name: user.name, email: user.email }
  };
};

export const loginUser = async (data: Omit<UserInput, "name">) => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  const passwordMatches = user && (await bcrypt.compare(data.password, user.password));

  if (!passwordMatches || !user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  await logActivity(user.id, "logged_in", "user", user.id);

  return {
    token: createToken(user.id),
    user: { id: user.id, name: user.name, email: user.email }
  };
};

export const getCurrentUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true }
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" }
  });
};
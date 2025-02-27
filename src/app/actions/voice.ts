"use server";

import { prisma } from "@/lib/prisma";

export async function createVoice(fileUrl: string, name: string, description: string) {
  const userId = process.env.USER_ID!;
  try {
    const voice = await prisma.voice.create({
      data: {
        fileUrl,
        userId,
        name,
        description,
      },
    });
    return { success: true, data: voice };
  } catch (error) {
    console.error("Error creating voice:", error);
    return { success: false, error: "Failed to create voice" };
  }
} 
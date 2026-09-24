"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function saveProfileImage(
  imageUrl: string,
  position: number
) {
  try {
    // 1. Get JWT from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // 2. Get user ID from JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string };

    // 3. Validate position
    if (position < 1 || position > 6) {
      return {
        success: false,
        message: "Invalid image position",
      };
    }

    // 4. Validate image URL
    if (!imageUrl) {
      return {
        success: false,
        message: "Image URL is required",
      };
    }

    // 5. Check if this position is already occupied
    const existingImage = await prisma.userImage.findFirst({
      where: {
        userId: decoded.userId,
        position,
      },
    });

    if (existingImage) {
      return {
        success: false,
        message: "This photo slot is already occupied",
      };
    }

    // 6. Save image
    await prisma.userImage.create({
      data: {
        url: imageUrl,
        position,
        userId: decoded.userId,
      },
    });

    return {
      success: true,
      message: "Profile image saved",
    };
  } catch (error) {
    console.error(
      "SAVE PROFILE IMAGE ERROR:",
      error
    );

    return {
      success: false,
      message: "Failed to save profile image",
    };
  }
}


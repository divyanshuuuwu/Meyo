"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function saveBasicInfo(
  age: number,
  gender: string,
  bio: string
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string };

    await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        age,
        gender,
        bio,
      },
    });
  } catch (error) {
    console.error("SAVE BASIC INFO ERROR:", error);

    return {
      success: false,
      message: "Failed to save basic information",
    };
  }

  redirect("/onboarding/personal");
}

export async function savePersonalDetails(
  height: number,
  occupation: string,
  location: string
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

    // 3. Update personal details
    await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        height,
        occupation,
        location,
      },
    });
  } catch (error) {
    console.error("SAVE PERSONAL DETAILS ERROR:", error);

    return {
      success: false,
      message: "Failed to save personal details",
    };
  }

  // 4. Move to photo step after successful save
  redirect("/onboarding/photos");
}





export async function completeOnboarding() {
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

    // 3. Check if user has at least one photo
    const photoCount = await prisma.userImage.count({
      where: {
        userId: decoded.userId,
      },
    });

    if (photoCount === 0) {
      return {
        success: false,
        message: "Please upload at least one photo",
      };
    }

    // 4. Mark onboarding as completed
    await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        onboardingCompleted: true,
      },
    });
  } catch (error) {
    console.error(
      "COMPLETE ONBOARDING ERROR:",
      error
    );

    return {
      success: false,
      message: "Failed to complete onboarding",
    };
  }

  // 5. Redirect after successful completion
  redirect("/discover");
}


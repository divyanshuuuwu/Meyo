"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";
import crypto from "crypto";

function getPublicIdFromUrl(url: string) {
  const pathname = new URL(url).pathname;

  const uploadIndex = pathname.indexOf("/upload/");
  if (uploadIndex === -1) {
    throw new Error("Invalid Cloudinary URL");
  }

  let path = pathname.substring(uploadIndex + "/upload/".length);

  // Remove version, e.g. v1790286106/
  path = path.replace(/^v\d+\//, "");

  // Remove file extension
  path = path.replace(/\.[^/.]+$/, "");

  return path;
}

async function deleteFromCloudinary(url: string) {
  const publicId = getPublicIdFromUrl(url);

  const timestamp = Math.floor(Date.now() / 1000);

  const signature = crypto
    .createHash("sha1")
    .update(
      `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
    )
    .digest("hex");

  const formData = new URLSearchParams();

  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp.toString());
  formData.append(
    "api_key",
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!
  );
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete image from Cloudinary");
  }
}

export async function addProfileImage(url: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const imageCount = await prisma.userImage.count({
    where: {
      userId,
    },
  });

  if (imageCount >= 6) {
    throw new Error("You can only have 6 photos");
  }

  // Find the first available position from 1-6
  const existingImages = await prisma.userImage.findMany({
    where: {
      userId,
    },
    select: {
      position: true,
    },
  });

  const usedPositions = new Set(
    existingImages.map((image) => image.position)
  );

  let position = 1;

  while (usedPositions.has(position) && position <= 6) {
    position++;
  }

  // Create image in database
  // Return the real database ID
  const image = await prisma.userImage.create({
    data: {
      url,
      position,
      userId,
    },
    select: {
      id: true,
      url: true,
      position: true,
    },
  });

  return image;
}

export async function deleteProfileImage(imageId: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const image = await prisma.userImage.findFirst({
    where: {
      id: imageId,
      userId,
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  // Delete from Cloudinary first
  await deleteFromCloudinary(image.url);

  // Delete from database
  await prisma.userImage.delete({
    where: {
      id: image.id,
    },
  });

  // If the main photo was deleted,
  // promote the lowest-position photo to position 1.
  if (image.position === 1) {
    const nextImage = await prisma.userImage.findFirst({
      where: {
        userId,
      },
      orderBy: {
        position: "asc",
      },
    });

    if (nextImage) {
      await prisma.userImage.update({
        where: {
          id: nextImage.id,
        },
        data: {
          position: 1,
        },
      });
    }
  }
}
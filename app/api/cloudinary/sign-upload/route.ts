
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "meyo/profile-images",
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return Response.json({
      signature,
      timestamp,
    });
  } catch (error) {
    console.error("CLOUDINARY SIGN ERROR:", error);

    return Response.json(
      { message: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}

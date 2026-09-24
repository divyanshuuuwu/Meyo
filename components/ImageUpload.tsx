"use client";

import { useState } from "react";

export default function ImageUpload() {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      // 1. Ask our server for a Cloudinary signature
      const signatureResponse = await fetch(
        "/api/cloudinary/sign-upload",
        {
          method: "POST",
        }
      );

      const signatureData = await signatureResponse.json();

      console.log("SIGNATURE RESPONSE:", signatureData);

      if (!signatureResponse.ok) {
        throw new Error(
          signatureData.message || "Failed to get upload signature"
        );
      }

      const { signature, timestamp } = signatureData;

      // 2. Create Cloudinary upload data
      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "api_key",
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!
      );

      formData.append(
        "timestamp",
        timestamp.toString()
      );

      formData.append(
        "signature",
        signature
      );

      formData.append(
        "folder",
        "meyo/profile-images"
      );

      // 3. Upload directly to Cloudinary
      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error("CLOUDINARY ERROR:", errorData);

        throw new Error("Image upload failed");
      }

      // 4. Get Cloudinary response
      const data = await uploadResponse.json();

      console.log("UPLOADED IMAGE:", data);

      // 5. Save Cloudinary URL in state
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && <p>Uploading...</p>}

      {imageUrl && (
        <div>
          <p>Upload successful!</p>

          <img
            src={imageUrl}
            alt="Uploaded profile"
            className="w-48 rounded-xl"
          />
        </div>
      )}
    </div>
  );
}


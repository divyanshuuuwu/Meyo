"use client";

import { useState } from "react";
import { Camera, Check, Loader2, ArrowLeft } from "lucide-react";
import { saveProfileImage } from "@/app/actions/profile";
import { completeOnboarding } from "@/app/actions/onboarding";

export default function PhotosPage() {
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(
    null
  );

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingIndex(index);

      // 1. Get Cloudinary signature from our server
      const signatureResponse = await fetch(
        "/api/cloudinary/sign-upload",
        {
          method: "POST",
        }
      );

      const signatureData = await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(
          signatureData.message ||
            "Failed to get upload signature"
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

      formData.append("signature", signature);

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

        console.error(
          "CLOUDINARY ERROR:",
          errorData
        );

        throw new Error("Image upload failed");
      }

      // 4. Get Cloudinary response
      const data = await uploadResponse.json();

      // 5. Save image URL to database
      const result = await saveProfileImage(
        data.secure_url,
        index + 1
      );

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Failed to save image"
        );
      }

      // 6. Update UI
      setImages((prev) => {
        const updated = [...prev];

        updated[index] = data.secure_url;

        return updated;
      });
    } catch (error) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );
    } finally {
      setUploadingIndex(null);

      // Allow selecting the same file again
      event.target.value = "";
    }
  };

  const handleBack = () => {
    window.history.back();
  };

const handleFinish = async () => {
  const result = await completeOnboarding();

  if (!result?.success) {
    alert(result?.message);
  }
};

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-pink-500 font-medium mb-3">
            Step 3 of 3
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Add your photos
          </h1>

          <p className="text-gray-400 mt-3">
            Add up to 6 photos. Your first photo will be
            your main profile photo.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-10">
          <div className="h-1.5 flex-1 rounded-full bg-pink-500" />
          <div className="h-1.5 flex-1 rounded-full bg-pink-500" />
          <div className="h-1.5 flex-1 rounded-full bg-pink-500" />
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((image, index) => {
            const isUploading =
              uploadingIndex === index;

            return (
              <div
                key={index}
                className={`relative aspect-square rounded-2xl overflow-hidden border ${
                  index === 0
                    ? "border-pink-500"
                    : "border-[#292929]"
                } bg-[#151515]`}
              >
                {image ? (
                  <>
                    <img
                      src={image}
                      alt={`Profile photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Uploaded indicator */}
                    <div className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full bg-pink-500">
                      <Check size={16} />
                    </div>

                    {/* Main photo label */}
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-2 text-xs font-medium">
                        Main photo
                      </div>
                    )}
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#1c1c1c] transition">
                    {isUploading ? (
                      <Loader2
                        size={28}
                        className="text-pink-500 animate-spin"
                      />
                    ) : (
                      <>
                        <Camera
                          size={28}
                          className="text-gray-500 mb-3"
                        />

                        <span className="text-sm text-gray-400">
                          {index === 0
                            ? "Add main photo"
                            : "Add photo"}
                        </span>

                        <span className="text-xs text-gray-600 mt-1">
                          {index + 1}/6
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingIndex !== null}
                      onChange={(event) =>
                        handleUpload(
                          event,
                          index
                        )
                      }
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-10">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#292929] bg-[#151515] px-5 py-3.5 font-semibold text-gray-300 transition hover:bg-[#1c1c1c]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="flex-1 rounded-xl bg-pink-500 py-3.5 font-semibold text-white transition hover:bg-pink-600"
          >
            Finish
          </button>
        </div>
      </div>
    </main>
  );
}


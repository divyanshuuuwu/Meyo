"use client";

import { useRef, useState } from "react";
import { Camera, Plus, Trash2, Loader2 } from "lucide-react";
import {
  addProfileImage,
  deleteProfileImage,
} from "@/app/actions/profileUpdate";

type ProfileImage = {
  id: string;
  url: string;
  position: number;
};

type PhotoGalleryProps = {
  images: ProfileImage[];
  userName: string;
};

export default function PhotoGallery({
  images,
  userName,
}: PhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState(images);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const profilePhoto = photos.find(
    (photo) => photo.position === 1
  );

  const additionalPhotos = photos.filter(
    (photo) => photo.position !== 1
  );

  async function handleAddPhoto(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (photos.length >= 6) {
      setError("You can only add 6 photos.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB.");
      return;
    }

    try {
      setUploading(true);

      // 1. Get Cloudinary signature
      const signatureResponse = await fetch(
        "/api/cloudinary/sign-upload",
        {
          method: "POST",
        }
      );

      const signatureData =
        await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(
          signatureData.message ||
            "Failed to prepare upload"
        );
      }

      const { signature, timestamp } =
        signatureData;

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
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult =
        await uploadResponse.json();

      if (!uploadResponse.ok) {
        console.error(
          "CLOUDINARY ERROR:",
          uploadResult
        );

        throw new Error(
          uploadResult?.error?.message ||
            "Cloudinary upload failed"
        );
      }

      // 4. Save image to database
      // This now returns the REAL database image
      // including the real Prisma ID.
      const newImage = await addProfileImage(
        uploadResult.secure_url
      );

      // 5. Add the real database record to local UI
      setPhotos((current) => [
        ...current,
        newImage,
      ]);
    } catch (error) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload photo."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDeletePhoto(
    imageId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this photo?"
    );

    if (!confirmed) return;

    setError("");
    setDeletingId(imageId);

    try {
      await deleteProfileImage(imageId);

      setPhotos((current) => {
        const deletedPhoto = current.find(
          (photo) => photo.id === imageId
        );

        const remaining = current.filter(
          (photo) => photo.id !== imageId
        );

        // If main photo was deleted,
        // promote the first remaining photo.
        if (
          deletedPhoto?.position === 1 &&
          remaining.length
        ) {
          const firstPhoto = [...remaining].sort(
            (a, b) =>
              a.position - b.position
          )[0];

          return remaining.map((photo) =>
            photo.id === firstPhoto.id
              ? {
                  ...photo,
                  position: 1,
                }
              : photo
          );
        }

        return remaining;
      });
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete photo."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAddPhoto}
      />

      <div className="grid gap-2 p-2 sm:grid-cols-2">

        {/* Main photo */}
        <div className="group relative h-[420px] overflow-hidden rounded-[22px] bg-[#181818] sm:h-[620px]">
          {profilePhoto ? (
            <>
              <img
                src={profilePhoto.url}
                alt={`${userName}'s profile photo`}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() =>
                    handleDeletePhoto(
                      profilePhoto.id
                    )
                  }
                  disabled={
                    deletingId ===
                    profilePhoto.id
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 backdrop-blur-md transition hover:bg-red-500/80 disabled:opacity-50"
                >
                  {deletingId ===
                  profilePhoto.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={openFilePicker}
              disabled={uploading}
              className="flex h-full w-full flex-col items-center justify-center text-gray-500 transition hover:bg-[#1c1c1c] hover:text-gray-300"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#222]">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Camera className="h-6 w-6" />
                )}
              </div>

              <span className="text-sm font-medium">
                Add profile photo
              </span>
            </button>
          )}

          {profilePhoto && (
            <>
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs backdrop-blur-md">
                  Main photo
                </div>
              </div>
            </>
          )}
        </div>

        {/* Additional photos */}
        <div className="grid grid-cols-2 gap-2">
          {additionalPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative min-h-[200px] overflow-hidden rounded-[20px] bg-[#181818] sm:min-h-0"
            >
              <img
                src={photo.url}
                alt={`${userName}'s photo`}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <button
                onClick={() =>
                  handleDeletePhoto(photo.id)
                }
                disabled={
                  deletingId === photo.id
                }
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/60 opacity-0 backdrop-blur-md transition hover:bg-red-500/80 group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === photo.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}

          {/* Add photo slot */}
          {photos.length < 6 && (
            <button
              onClick={openFilePicker}
              disabled={uploading}
              className="flex min-h-[200px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#333] bg-[#151515] text-gray-500 transition hover:border-pink-500/40 hover:bg-[#1a1a1a] hover:text-pink-400 sm:min-h-0"
            >
              {uploading ? (
                <Loader2 className="mb-2 h-5 w-5 animate-spin" />
              ) : (
                <Plus className="mb-2 h-5 w-5" />
              )}

              <span className="text-xs font-medium">
                {uploading
                  ? "Uploading..."
                  : "Add photo"}
              </span>
            </button>
          )}

          {/* Empty slots */}
          {Array.from({
            length: Math.max(
              0,
              5 -
                additionalPhotos.length -
                (photos.length < 6 ? 1 : 0)
            ),
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="min-h-[200px] rounded-[20px] bg-[#181818] sm:min-h-0"
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="px-3 pb-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between px-3 pt-2 text-xs text-gray-500">
        <span>Maximum 6 photos</span>

        <span>
          {photos.length}/6
        </span>
      </div>
    </div>
  );
}
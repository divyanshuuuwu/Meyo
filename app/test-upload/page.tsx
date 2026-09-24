
import ImageUpload from "@/components/ImageUpload";

export default function TestUploadPage() {
  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="mb-6 text-2xl font-bold">
        Cloudinary Test
      </h1>

      <ImageUpload />
    </main>
  );
}


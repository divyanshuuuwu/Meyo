"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { matchUser } from "@/app/actions/match";
import { useRouter } from "next/navigation";

export default function MatchButton({
  userId,
}: {
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleMatch() {
    try {
      setLoading(true);

      await matchUser(userId);

      router.push("/matches");
    } catch (error) {
      console.error("MATCH ERROR:", error);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleMatch}
      disabled={loading}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Heart size={16} fill="currentColor" />

      {loading ? "Matching..." : "Match"}
    </button>
  );
}
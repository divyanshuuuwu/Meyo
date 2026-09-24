
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  User,
  Compass,
} from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <header className="sticky top-0 z-50 border-b border-[#1f1f1f] bg-[#0b0b0b]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo */}
          <Link
            href="/discover"
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500">
              <Heart
                size={19}
                fill="currentColor"
                className="text-white"
              />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Meyo
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/discover"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-[#151515] hover:text-white"
            >
              <Compass size={18} />
              Discover
            </Link>

            <Link
              href="/matches"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-[#151515] hover:text-white"
            >
              <Heart size={18} />
              Matches
            </Link>

            <Link
              href="/messages"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-[#151515] hover:text-white"
            >
              <MessageCircle size={18} />
              Messages
            </Link>
          </nav>

          {/* Profile */}
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#292929] bg-[#151515] text-gray-400 transition hover:border-pink-500 hover:text-white"
          >
            <User size={19} />
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}


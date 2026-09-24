import { registerUser } from "@/app/actions/auth";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Lock,
  Mail,
  Sparkles,
  User,
  Video,
} from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080709] text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-pink-600/15 blur-[130px] animate-pulse" />

        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[130px] animate-pulse [animation-delay:2s]" />

        <div className="absolute bottom-[-200px] left-1/3 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[120px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/20 transition-transform duration-300 group-hover:scale-110">
            <Heart size={17} fill="white" />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            meyo<span className="text-pink-500">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 text-sm text-white/40 sm:flex">
          <span>Already have an account?</span>

          <Link
            href="/login"
            className="text-sm text-pink-400 transition-colors hover:text-pink-300"
          >
            Log in
          </Link>
        </div>
      </nav>

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-5 pb-12 pt-8">
        <div className="grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1fr_460px]">
          {/* Left Content */}
          <div className="hidden lg:block">
            <div className="max-w-xl">
              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/[0.07] px-4 py-2 text-sm text-pink-300 backdrop-blur-xl">
                <Sparkles size={15} />
                <span>Your next conversation starts here</span>
              </div>

              <h1 className="text-6xl font-bold leading-[1.05] tracking-[-0.04em]">
                Meet someone
                <br />
                worth saying{" "}
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                  hello.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/40">
                Create your account, build your profile, and start having
                real conversations through quick video dates.
              </p>

              {/* Floating preview */}
              <div className="relative mt-12 h-36 max-w-md">
                {/* Card 1 */}
                <div className="absolute left-0 top-0 w-64 rotate-[-3deg] rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 hover:rotate-[-1deg]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-orange-400 text-lg">
                      S
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Sofia, 24</p>
                      <p className="text-xs text-white/35">
                        Mumbai · Traveling ✈️
                      </p>
                    </div>

                    <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10">
                      <Heart
                        size={14}
                        className="text-pink-400"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="absolute left-44 top-12 w-64 rotate-[4deg] rounded-2xl border border-white/10 bg-[#151317]/90 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 hover:rotate-[2deg]">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-blue-400 text-lg">
                      A

                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#151317] bg-green-400" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">Alex, 26</p>
                      <p className="text-xs text-white/35">
                        Delhi · Music 🎧
                      </p>
                    </div>

                    <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                      <Video size={14} className="text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom text */}
              <div className="mt-5 flex items-center gap-3 text-sm text-white/30">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full border-2 border-[#080709] bg-pink-400" />
                  <div className="h-7 w-7 rounded-full border-2 border-[#080709] bg-purple-400" />
                  <div className="h-7 w-7 rounded-full border-2 border-[#080709] bg-orange-400" />
                </div>

                <span>Join people looking for a real conversation</span>
              </div>
            </div>
          </div>

          {/* Register Card */}
          <div className="w-full">
            <div className="relative rounded-[30px] border border-white/10 bg-white/[0.045] p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl">
              {/* Card glow */}
              <div className="pointer-events-none absolute -inset-px rounded-[30px] bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-70" />

              <div className="relative rounded-[23px] bg-[#0d0c0f]/90 px-6 py-8 sm:px-9 sm:py-10">
                {/* Mobile logo */}
                <div className="mb-8 flex justify-center lg:hidden">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/20">
                    <Heart size={22} fill="white" />
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight">
                    Create your account
                  </h2>

                  <p className="mt-2 text-sm text-white/35">
                    Your next conversation could be one click away.
                  </p>
                </div>

                {/* Google */}
                <button
                  type="button"
                  className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.98]"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-xs text-white/25">OR</span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Form */}
                <form action={registerUser} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/50">
                      Your name
                    </label>

                    <div className="group flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 transition-all duration-300 focus-within:border-pink-500/50 focus-within:bg-pink-500/[0.03] focus-within:ring-4 focus-within:ring-pink-500/5">
                      <User
                        size={17}
                        className="text-white/25 transition-colors group-focus-within:text-pink-400"
                      />

                      <input
                        name="name"
                        type="text"
                        placeholder="What should we call you?"
                        className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/50">
                      Email address
                    </label>

                    <div className="group flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 transition-all duration-300 focus-within:border-pink-500/50 focus-within:bg-pink-500/[0.03] focus-within:ring-4 focus-within:ring-pink-500/5">
                      <Mail
                        size={17}
                        className="text-white/25 transition-colors group-focus-within:text-pink-400"
                      />

                      <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/50">
                      Password
                    </label>

                    <div className="group flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 transition-all duration-300 focus-within:border-pink-500/50 focus-within:bg-pink-500/[0.03] focus-within:ring-4 focus-within:ring-pink-500/5">
                      <Lock
                        size={17}
                        className="text-white/25 transition-colors group-focus-within:text-pink-400"
                      />

                      <input
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {/* Register button */}
                  <button
                    type="submit"
                    className="group relative mt-2 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold shadow-lg shadow-pink-500/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-pink-500/20 active:scale-[0.98]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative">Create account</span>

                    <ArrowRight
                      size={17}
                      className="relative transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </form>

                {/* Login */}
                <p className="mt-7 text-center text-sm text-white/30">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-pink-400 transition-colors hover:text-pink-300"
                  >
                    Log in
                  </Link>
                </p>

                {/* Security */}
                <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-white/20">
                  <Lock size={12} />
                  Your information is private and secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom decorative dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 opacity-30">
        <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
      </div>
    </main>
  );
}

/* Google Icon */

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 12.23c0-.79-.064-1.39-.203-2.013H12.2v3.605h5.51c-.111.896-.82 2.246-2.355 3.153l-.022.12 2.715 2.103.188.019c1.728-1.596 2.729-3.947 2.729-6.987Z"
        fill="#4285F4"
      />

      <path
        d="M12.2 21.997c2.43 0 4.47-.8 5.96-2.18l-2.84-2.202c-.76.53-1.78.9-3.12.9-2.37 0-4.38-1.56-5.1-3.72l-.116.01-2.832 2.193-.037.11c1.48 2.9 4.53 4.89 8.085 4.89Z"
        fill="#34A853"
      />

      <path
        d="M7.1 14.795a5.99 5.99 0 0 1-.33-1.95c0-.68.12-1.34.32-1.95l-.006-.13-2.868-2.228-.094.045A10.02 10.02 0 0 0 3.1 12.845c0 1.52.36 2.96 1.02 4.23l2.98-2.28Z"
        fill="#FBBC05"
      />

      <path
        d="M12.2 7.095c1.69 0 2.83.73 3.48 1.34l2.54-2.48C16.66 4.48 14.63 3.7 12.2 3.7c-3.55 0-6.61 1.99-8.09 4.89l2.98 2.3c.73-2.16 2.74-3.795 5.11-3.795Z"
        fill="#EA4335"
      />
    </svg>
  );
}


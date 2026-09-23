
import {
  ArrowRight,
  Video,
  Heart,
  Sparkles,
  ShieldCheck,
  Users,
  MessageCircle,
  Play,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="w-full border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart size={19} fill="white" />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              meyo<span className="text-pink-500">.</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#how" className="hover:text-white transition">
              How it works
            </a>

            <a href="#features" className="hover:text-white transition">
              Features
            </a>

            <a href="#safety" className="hover:text-white transition">
              Safety
            </a>
          </div>

          {/* Login */}
          <button className="text-sm font-medium text-white/80 hover:text-white transition">
            Log in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-600/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid lg:grid-cols-2 gap-16 items-center relative">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-300 text-sm mb-7">
              <Sparkles size={15} />
              Dating, but more real.
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Meet someone.
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                Go on a date.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg md:text-xl text-white/55 leading-relaxed">
              Skip endless texting. Meet someone new and jump into a quick
              video date. Real conversations, real chemistry, no awkward
              waiting.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-9">
              <button className="group flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition">
                Start dating
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              </button>

              <button className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-medium">
                <Play size={17} fill="currentColor" />
                See how it works
              </button>
            </div>

            {/* Small stats */}
            <div className="flex items-center gap-8 mt-10">
              <div>
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-sm text-white/40">People joining</p>
              </div>

              <div className="w-px h-10 bg-white/10" />

              <div>
                <p className="text-2xl font-bold">5 min</p>
                <p className="text-sm text-white/40">Quick dates</p>
              </div>

              <div className="w-px h-10 bg-white/10" />

              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-white/40">Real people</p>
              </div>
            </div>
          </div>

          {/* Right — Video Date Preview */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Glow */}
            <div className="absolute w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full" />

            <div className="relative w-full max-w-[390px]">
              {/* Main phone/card */}
              <div className="relative rounded-[32px] border border-white/10 bg-[#111] p-3 shadow-2xl shadow-black/50 rotate-2">
                {/* Video area */}
                <div className="relative aspect-[3/4] rounded-[25px] overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-[#111]">
                  {/* Fake person */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 to-purple-500 blur-[1px]" />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Top */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <div className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-xs">
                      ● Live date
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-xs">
                      04:21
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-2xl font-bold">Sofia, 24</p>

                    <p className="text-sm text-white/60 mt-1">
                      Mumbai · Loves traveling ✈️
                    </p>

                    <div className="flex gap-3 mt-5">
                      <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <MessageCircle size={20} />
                      </button>

                      <button className="flex-1 h-12 rounded-full bg-white text-black font-semibold flex items-center justify-center gap-2">
                        <Heart size={18} fill="currentColor" />
                        Like
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <div className="absolute -left-8 top-20 px-4 py-3 rounded-2xl border border-white/10 bg-[#171717]/90 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <Heart size={17} className="text-pink-400" fill="currentColor" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">It's a match! 💕</p>
                    <p className="text-xs text-white/40">
                      You both liked each other
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating video */}
              <div className="absolute -right-8 bottom-20 px-4 py-3 rounded-2xl border border-white/10 bg-[#171717]/90 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Video size={17} className="text-purple-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Next date</p>
                    <p className="text-xs text-white/40">
                      Starting in 12s
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-pink-400 text-sm font-semibold uppercase tracking-widest">
              How it works
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Three steps.
              <br />
              One real connection.
            </h2>

            <p className="text-white/45 mt-5 text-lg">
              Meyo makes meeting someone new simple. No endless swiping or
              weeks of texting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-14">
            <Step
              number="01"
              icon={<Users size={22} />}
              title="Create your profile"
              description="Tell us a little about yourself and what you're looking for."
            />

            <Step
              number="02"
              icon={<Video size={22} />}
              title="Start a date"
              description="Get matched and jump into a short video date with someone new."
            />

            <Step
              number="03"
              icon={<Heart size={22} />}
              title="See where it goes"
              description="If you both like each other, it's a match. Continue the conversation."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#0d0d0d] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
              Built differently
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Dating without the endless scroll.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-14">
            <Feature
              icon={<Video />}
              title="Quick video dates"
              description="Meet face-to-face instead of spending days figuring out what to text."
            />

            <Feature
              icon={<Sparkles />}
              title="Better connections"
              description="Chemistry is easier to feel when you're actually talking to someone."
            />

            <Feature
              icon={<ShieldCheck />}
              title="Safety first"
              description="Built with privacy and safety features to make meeting new people comfortable."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="safety" className="py-28 relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[500px] h-[300px] bg-pink-600/15 blur-[120px] rounded-full" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-7">
            <Heart size={26} fill="white" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your next conversation
            <br />
            could change everything.
          </h2>

          <p className="text-white/45 text-lg mt-6 max-w-xl mx-auto">
            Stop waiting for the perfect match. Start having real
            conversations.
          </p>

          <button className="mt-9 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 transition inline-flex items-center gap-2">
            Get started
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart size={14} fill="white" />
            </div>

            <span className="font-bold">
              meyo<span className="text-pink-500">.</span>
            </span>
          </div>

          <p className="text-sm text-white/30">
            © 2026 Meyo. Meet. Talk. Connect.
          </p>

          <div className="flex gap-5 text-sm text-white/40">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>

            <a href="#" className="hover:text-white transition">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------------------------------- */
/* Reusable Components */
/* ---------------------------------- */

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 hover:bg-white/[0.05] transition">
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400">
          {icon}
        </div>

        <span className="text-sm text-white/20 font-mono">
          {number}
        </span>
      </div>

      <h3 className="text-xl font-semibold mt-8">
        {title}
      </h3>

      <p className="text-white/40 mt-3 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111] p-8">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-pink-400">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mt-7">
        {title}
      </h3>

      <p className="text-white/40 mt-3 leading-relaxed">
        {description}
      </p>
    </div>
  );
}


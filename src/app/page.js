import { FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white sm:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col justify-center gap-10">
        <div className="space-y-5">
          <div className="flex items-center gap-3 text-sm font-medium uppercase text-cyan-300">
            <SiNextdotjs className="text-xl" />
            Next.js JavaScript Starter
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Ready with Tailwind CSS and React Icons.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-300">
            Start building in <span className="font-semibold text-white">src/app/page.js</span>.
            Tailwind is already configured and icon imports are working.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Next.js", icon: SiNextdotjs },
            { label: "Tailwind CSS", icon: SiTailwindcss },
            { label: "React Icons", icon: FaReact },
          ].map(({ label, icon: Icon }) => (
            <div
              className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20"
              key={label}
            >
              <Icon className="mb-4 text-3xl text-cyan-300" />
              <h2 className="text-lg font-semibold">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Installed and ready to use in JavaScript components.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

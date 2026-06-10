import { ImSpinner2 } from "react-icons/im";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-5 py-4">
        <ImSpinner2 className="animate-spin text-2xl text-cyan-300" />
        <p className="text-sm font-medium text-zinc-200">Loading...</p>
      </div>
    </main>
  );
}

import AnimatedLoading from "@/components/common/AnimatedLoading";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <LoadingScreen>
        <AnimatedLoading size={160} />
      </LoadingScreen>
    </main>
  );
}

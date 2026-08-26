import { redirect } from "next/navigation";
import AccountDashboard from "@/components/account/AccountDashboard";
import RecTag from "@/components/home/RecTag";
import { currentUserEmail } from "@/lib/auth/server";

export const metadata = {
  title: "Your account | Inkarp",
  description: "Your quote requests and saved product list.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  // Checked on the server so the page never flashes before redirecting.
  const email = await currentUserEmail();
  if (!email) redirect("/signin");

  return (
    <main className="bg-white px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <RecTag>Your account</RecTag>
        <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">{email}</p>
        <AccountDashboard />
      </div>
    </main>
  );
}

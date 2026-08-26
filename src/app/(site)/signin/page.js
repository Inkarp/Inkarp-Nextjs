import SignInForm from "@/components/account/SignInForm";
import RecTag from "@/components/home/RecTag";

export const metadata = {
  title: "Sign in | Inkarp",
  description: "Sign in to see your quote requests and saved product lists.",
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <main className="bg-white px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[520px]">
        <RecTag>Your account</RecTag>
        <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          No password needed. Enter your email and we will send you a link that signs you in.
        </p>
        <SignInForm />
      </div>
    </main>
  );
}

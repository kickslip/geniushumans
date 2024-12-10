import { Metadata } from "next";
import Link from "next/link";
import RegistrationForm from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        {/* Left side: Sign up form */}
        <div className="flex w-full md:w-1/2 flex-col space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to Codeeza</h1>
            <p className="text-muted-foreground">
              A place where <span className="italic">you</span> can find great
              Coders.
            </p>
          </div>
          <div className="space-y-5">
            <RegistrationForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        {/* Right side: Image (hidden on mobile, shown on md and up) */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <img
            src="/signup.jpg" // Path to the image in the `public` folder
            alt="Sign Up"
            className="h-full w-full object-cover" // Ensures the image fits nicely
          />
        </div>
      </div>
    </main>
  );
}

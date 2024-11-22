import { Metadata } from "next";
import LoginForm from "./LoginForm";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
};

function LoginPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        {/* Left side: Login form */}
        <div className="flex w-1/2 flex-col space-y-10 overflow-y-auto p-10">
          <h1 className="text-center text-3xl font-bold">Login to Codeeza</h1>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        {/* Right side: Adding the image */}
        <div className="flex w-1/2 items-center justify-center">
          <Image
            src="/login-image.jpg"
            alt="Login Image"
            width={500}
            height={500}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </main>
  );
}

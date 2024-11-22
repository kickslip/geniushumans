import React from 'react';
import { Metadata } from "next";
import LoginForm from "./LoginForm";
import Image from "next/image";
import Link from "next/link";
import { Github, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login | Codeeza",
  description: "Login to your Codeeza account"
};

const SocialButton = ({ children, ...props }) => (
  <Button 
    variant="outline" 
    className="w-full flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
    {...props}
  >
    {children}
  </Button>
);

function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl flex flex-col md:flex-row">
        {/* Left side: Login form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back to Codeeza
            </h1>
            <p className="text-slate-600">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <SocialButton>
                <Github size={20} />
                Continue with GitHub
              </SocialButton>
              <SocialButton>
                <Twitter size={20} />
                Continue with Twitter
              </SocialButton>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Footer Links */}
            <div className="space-y-3 text-center text-sm">
              <Link 
                href="/forgot-password" 
                className="text-blue-600 hover:text-blue-700 block"
              >
                Forgot your password?
              </Link>
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Image and overlay */}
        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/20 backdrop-blur-sm z-10" />
          <Image
            src="/login-image.jpg"
            alt="Login background"
            width={800}
            height={1200}
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center space-y-4 p-6 rounded-xl bg-white/10 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white">
                Start Coding Today
              </h2>
              <p className="text-white/90 max-w-md">
                Join our community of developers and start building amazing projects
              </p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default LoginPage;
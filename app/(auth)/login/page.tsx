import React from 'react';
import { Metadata } from "next";
import LoginForm from "./LoginForm";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login | Codeeza",
  description: "Login to your Codeeza account"
};

function LoginPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl flex flex-col md:flex-row border border-border">
        {/* Left side: Login form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 space-y-8 bg-card text-card-foreground">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Welcome back to Codeeza
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Footer Links */}
          <div className="space-y-3 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign up 
              </Link>
            </p>
          </div>
        </div>

        {/* Right side: Image and overlay */}
        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 backdrop-blur-sm z-10" />
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
              <h2 className="text-2xl font-bold text-primary-foreground">
                Find developers
              </h2>
              <p className="text-primary-foreground/90 max-w-md">
                Join our community so developers can start building amazing projects
              </p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default LoginPage;
"use client"

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn } from 'lucide-react';

const AuthOptions = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="text-gray-500">Choose how you'd like to continue</p>
        </div>

        <div className="space-y-4">
          {/* Google Sign In Button */}
          <Button 
            variant="outline" 
            className="w-full h-14 text-lg flex items-center justify-center space-x-3 border-2"
            onClick={() => console.log('Google sign in clicked')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Button 
            variant="default" 
            className="w-full h-14 text-lg flex items-center justify-center space-x-3"
            onClick={() => console.log('Register clicked')}
          >
            <UserPlus className="w-5 h-5" />
            <span>Create Account</span>
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-14 text-lg flex items-center justify-center space-x-3"
            onClick={() => console.log('Login clicked')}
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>By continuing, you agree to our</p>
          <div className="space-x-1">
            <button className="text-primary hover:underline">Terms of Service</button>
            <span>&</span>
            <button className="text-primary hover:underline">Privacy Policy</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthOptions;
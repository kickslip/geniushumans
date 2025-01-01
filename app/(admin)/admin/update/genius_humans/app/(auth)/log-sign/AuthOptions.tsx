"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const AuthOptions = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // You would replace this with your actual authentication check
  useEffect(() => {
    // Example: Check if user is logged in
    const checkAuthStatus = () => {
      // Replace this with your actual auth check logic
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleLogout = () => {
    // Replace with your actual logout logic
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-background text-foreground flex items-center justify-center p-4"
    >
      <Card 
        as={motion.div} 
        variants={itemVariants}
        className="w-full max-w-md p-8 space-y-8 bg-card text-card-foreground border border-border shadow-lg rounded-lg"
      >
        <motion.div 
          variants={itemVariants} 
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-primary">Welcome</h1>
          <p className="text-muted-foreground">Choose how you'd like to continue</p>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="space-y-4"
        >
          {/* Google Sign In Button */}
          {!isLoggedIn && (
            <motion.div variants={itemVariants}>
              <Button 
                variant="outline" 
                className="w-full h-14 text-lg flex items-center justify-center space-x-3 border-2 border-input hover:bg-accent"
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
            </motion.div>
          )}

          {!isLoggedIn && (
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">or</span>
              </div>
            </motion.div>
          )}

          {!isLoggedIn && (
            <motion.div variants={itemVariants}>
              <Button 
                variant="default" 
                className="w-full h-14 text-lg flex items-center justify-center space-x-3"
                onClick={() => console.log('Register clicked')}
              >
                <UserPlus className="w-5 h-5" />
                <Link href="/signup">Create Account</Link>
              </Button>
            </motion.div>
          )}

          {!isLoggedIn ? (
            <motion.div variants={itemVariants}>
              <Button 
                variant="outline" 
                className="w-full h-14 text-lg flex items-center justify-center space-x-3 border-input hover:bg-accent"
                onClick={() => console.log('Login clicked')}
              >
                <LogIn className="w-5 h-5" />
                <Link href="/login">Sign In</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Button 
                variant="outline" 
                className="w-full h-14 text-lg flex items-center justify-center space-x-3 border-input hover:bg-accent"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Button>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground"
        >
          <p>By continuing, you agree to our</p>
          <div className="space-x-1">
            <button className="text-primary hover:underline">Terms of Service</button>
            <span>&</span>
            <button className="text-primary hover:underline">Privacy Policy</button>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default AuthOptions;
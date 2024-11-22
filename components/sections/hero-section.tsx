"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(auth)/AuthContext";

const isOutline = false;

export function HeroSection() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Codeeza Expert Full Stack Development Teams
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your digital vision with our dedicated development teams specializing in modern web technologies
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild className="btn-lg">
              <Link href="/book" onClick={handleProtectedClick}>
                {isLoggedIn ? "Book Consultation" : "Login to Book"}
              </Link>
            </Button>
            <Button className={`btn-lg ${isOutline ? 'outline' : ''}`} asChild>
              <Link href="#pricing" onClick={handleProtectedClick}>
                {isLoggedIn ? "View Packages" : "Login to View"}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
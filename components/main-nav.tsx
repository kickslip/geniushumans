"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Settings from "./Settings";
import UserButton from "./UserButton";

const routes = [
  { name: "Home", path: "/" },
  { name: "Login/Register", path: "/log-sign"},
  { name: "Tech Stack", path: "/#tech-stack" },
  { name: "Services", path: "/#services" },
  { name: "Pricing", path: "/#pricing" },
  { name: "Contact", path: "/#contact" },
];

const size = 'large';

export function MainNav() {
  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="logo.png" 
              alt="Logo" 
              className="h-6 w-6"
            />
            <span className="font-bold text-xl">
              <h3 className="text-red-600">Codeeza</h3>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary"
                )}
              >
                {route.name}
              </Link>
            ))}
            <Button asChild>
              <Link href="/book">Book Now</Link>
            </Button>
          </nav>

          <Button className={`btn-outline ${size} md:hidden`}>
            <img 
              src="logo.png" 
              alt="Logo" 
              className="h-4 w-4"
            />
          </Button>
          <UserButton/>
        </div>
      </div>
    </header>
  );
}
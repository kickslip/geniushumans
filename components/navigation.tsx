"use client";

import { useState } from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { Menu } from "lucide-react";
import UserButton from "./UserButton";
import { RxDividerVertical } from "react-icons/rx";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useSession } from "../app/SessionProvider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book Now" },
  { href: "#tech-stack", label: "Tech Stack" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact Us" },
];

export function Navigation() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img src="logo.png" alt="Logo" className="h-6 w-8" />
            <span className="font-bold text-xl text-red-600">Codeeza</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="hidden md:flex items-center space-x-6">
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <UserButton className="text-lg" />
                </div>
              ) : (
                <>
                  <Link href="/login" className="hover:text-gray-300">
                    Login
                  </Link>
                  <RxDividerVertical />
                  <Link href="/log-sign" className="hover:text-gray-300">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <UserButton />
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}

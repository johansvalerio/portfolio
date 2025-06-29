"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  User,
  GraduationCap,
  Code2,
  Layers,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserDropdown from "./UserDropdown";
import { signIn, useSession } from "next-auth/react";
import UserMobileDropdown from "./UserMobileDropdown";
import GoogleIcon from "../svg/GoogleIcon";
import { ThemeToggle } from "./ThemeToggle";

interface navItems {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems = [
  { href: "#home", label: "Inicio", icon: <Home className="h-4 w-4 mr-2" /> },
  {
    href: "#about",
    label: "Sobre mí",
    icon: <User className="h-4 w-4 mr-2" />,
  },
  {
    href: "#studies",
    label: "Estudios",
    icon: <GraduationCap className="h-4 w-4 mr-2" />,
  },
  {
    href: "#skills",
    label: "Skills",
    icon: <Code2 className="h-4 w-4 mr-2" />,
  },
  {
    href: "#projects",
    label: "Proyectos",
    icon: <Layers className="h-4 w-4 mr-2" />,
  },
  {
    href: "#contact",
    label: "Contacto",
    icon: <Mail className="h-4 w-4 mr-2" />,
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: window.location.href });
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Johans Valerio
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
              <ThemeToggle />
              {!session ? (
                <span
                  onClick={handleGoogleSignIn}
                  className="gap-2 py-6 text-base text-muted-foreground hover:text-foreground cursor-pointer flex items-center hover:scale-105 transition-all duration-300"
                >
                  <GoogleIcon />
                  Iniciar sesión
                </span>
              ) : (
                <UserDropdown />
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur-md rounded-lg mt-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </a>
              ))}

              <ThemeToggle showLabel={true} />

              {/* Mobile User Section */}
              <div className="border-t border-border mt-4 pt-4">
                {!session ? (
                  <span
                    onClick={handleGoogleSignIn}
                    className="ml-2 gap-2 py-4 text-base text-muted-foreground hover:text-foreground cursor-pointer flex items-center hover:scale-105 transition-all duration-300"
                  >
                    <GoogleIcon />
                    Iniciar sesión
                  </span>
                ) : (
                  <UserMobileDropdown />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

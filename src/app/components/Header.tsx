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
import UserMobileDropdown from "./UserMobileDropdown";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { Session } from "next-auth";
import GoogleSpan from "./GoogleSpan";

interface navItems {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems = [
  { href: "/#home", label: "Inicio", icon: <Home className="h-4 w-4 mr-2" /> },
  {
    href: "/#about",
    label: "Sobre mí",
    icon: <User className="h-4 w-4 mr-2" />,
  },
  {
    href: "/#studies",
    label: "Estudios",
    icon: <GraduationCap className="h-4 w-4 mr-2" />,
  },
  {
    href: "/#skills",
    label: "Skills",
    icon: <Code2 className="h-4 w-4 mr-2" />,
  },
  {
    href: "/#projects",
    label: "Proyectos",
    icon: <Layers className="h-4 w-4 mr-2" />,
  },
  {
    href: "/#contact",
    label: "Contacto",
    icon: <Mail className="h-4 w-4 mr-2" />,
  },
];

export default function Header({ session }: { session: Session | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Si baja el scroll más de 50px, cambia el estado isScrolled
  // para aplicar estilos al header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary/30 to-primary/40 bg-clip-text text-transparent">
              <Link href="/#home">
                Johans Valerio
              </Link>

            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
              <ThemeToggle />
              {!session ? (
                <GoogleSpan />
              ) : (
                <UserDropdown session={session} />
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
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
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}

              <ThemeToggle showLabel={true} />

              {/* Mobile User Section */}
              <div className="border-t border-border mt-4 pt-4">
                {!session ? (
                  <GoogleSpan />
                ) : (
                  <UserMobileDropdown session={session} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

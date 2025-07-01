import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import Link from "next/link";

const currentYear = new Date().getFullYear();

interface SocialLinks {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface QuickLinks {
  href: string;
  label: string;
}

const socialLinks: SocialLinks[] = [
  {
    icon: <Github className="h-6 w-6" />,
    href: "https://github.com/johansvalerio",
    label: "GitHub",
  },
  { icon: <Linkedin className="h-6 w-6" />, href: "#", label: "LinkedIn" },
  {
    icon: <Instagram className="h-6 w-6" />,
    href: "https://instagram.com/johansvalerio",
    label: "Instagram",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    href: "mailto:johans.valerio@hotmail.com",
    label: "Email",
  },
];

const quickLinks: QuickLinks[] = [
  { href: "/#home", label: "Inicio" },
  { href: "/#about", label: "Sobre mí" },
  { href: "/#studies", label: "Estudios" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Proyectos" },
  { href: "/#contact", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/5 bg-clip-text text-transparent">
              Johans Valerio
            </h3>
            <p className="text-muted-foreground">
              Ingeniero informático con una pasión por crear soluciones
              digitales innovadoras.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <Button key={index} variant="ghost" size="icon" asChild>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces rápidos</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-2 text-muted-foreground flex flex-col">
              <a
                href="mailto:johans.valerio@hotmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:underline-offset-2 hover:text-muted-foreground"
              >
                johans.valerio@hotmail.com
              </a>
              <a
                href="https://wa.me/50688015998"
                className="hover:underline hover:underline-offset-2 hover:text-muted-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                +(506) 7236-7648
              </a>
              <p>Guanacaste, Costa Rica 🇨🇷</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Johans Valerio.</p>
        </div>
      </div>
    </footer>
  );
}

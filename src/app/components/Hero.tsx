"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, DownloadIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SocialButtons {
  icon: React.ReactNode;
  href: string;
  isMail?: boolean;
}

const socialButtons: SocialButtons[] = [
  {
    icon: <Github className="h-6 w-6" />,
    href: "https://github.com/johansvalerio",
  },
  {
    icon: <Linkedin className="h-6 w-6" />,
    href: "#",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    href: "mailto:johans.valerio@hotmail.com",
    isMail: true,
  },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-muted/20 to-background dark:from-muted/10 dark:to-background"
    >
      {/* Background gradient */}

      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10" />
      <div className="absolute inset-0 bg-grid-black/[0.05] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            className="m-auto overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 text-xs sm:text-sm px-3 py-1 whitespace-nowrap"
            >
              👋 Listo para nuevos retos
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-foreground via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Desarrollador Full Stack
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Apasionado por crear soluciones web innovadoras con tecnologías
            modernas full-stack. Comprometido con el aprendizaje continuo y la
            excelencia en cada línea de código.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 gap-2 group bg-blue-600 hover:bg-blue-600/90 transition-colors"
              asChild
            >
              <a href="#projects">Ver mis proyectos</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 gap-2 group border-2 hover:bg-primary/5 transition-colors"
              asChild
            >
              <a href="/CV-JohansValerio.pdf" download="CV-JohansValerio.pdf">
                <DownloadIcon className="h-5 w-5 group-hover:animate-bounce" />
                Descargar CV
              </a>
            </Button>
          </motion.div>

          <div className="flex justify-center space-x-6">
            {socialButtons.map((button, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: 1.5 + index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                viewport={{ once: true, margin: "-20px" }}
                className="flex-shrink-0 hover:translate-y-[-5px] transition-all duration-200"
              >
                <Button
                  asChild={!!button.href}
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 cursor-pointer group"
                >
                  {button.href ? (
                    <a
                      href={button.href}
                      target={button.isMail ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      {button.icon}
                    </a>
                  ) : (
                    <span className="flex items-center justify-center">
                      {button.icon}
                    </span>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.7 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}

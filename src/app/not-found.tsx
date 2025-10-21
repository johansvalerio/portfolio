"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Code2, Terminal, FileCode, Briefcase } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/5 -z-10"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-accent/10 dark:bg-accent/5 -z-10"></div>

      <div className="max-w-4xl w-full mx-auto text-center space-y-8 animate-fade-in">
        <div className="relative h-48 w-full flex items-center justify-center mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[10rem] md:text-[15rem] font-bold text-muted-foreground/10 dark:text-muted-foreground/5 select-none">
              404
            </div>
          </div>

          <div className="relative z-10 text-center space-y-6">
            <div className="flex justify-center items-center space-x-4">
              <Code2
                className="h-16 w-16 text-primary animate-float"
                style={{ animationDelay: "0.1s" }}
              />
              <div className="text-4xl md:text-6xl font-bold text-foreground bg-clip-text">
                ¡Ups!
              </div>
              <Terminal
                className="h-16 w-16 text-accent animate-float"
                style={{ animationDelay: "0.3s" }}
              />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-foreground">
              Página no encontrada
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              La página que buscas no existe o ha sido movida.
              <br />
              ¿Te gustaría ver mis proyectos o habilidades en su lugar?
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-progress" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild className="group">
              <Link href="/" className="gap-2">
                <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
                Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="outline" className="group">
              <Link href="/#projects" className="gap-2">
                <Briefcase className="h-4 w-4 transition-transform group-hover:scale-110" />
                Ver proyectos
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            O explora mi{" "}
            <Link
              href="/#skills"
              className="text-primary hover:underline font-medium"
            >
              conjunto de habilidades
            </Link>
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div
        className="absolute top-1/4 left-10 text-primary/20 dark:text-primary/10 animate-float"
        style={{ animationDelay: "0.5s" }}
      >
        <FileCode className="h-12 w-12" />
      </div>
      <div
        className="absolute bottom-1/3 right-12 text-accent/20 dark:text-accent/10 animate-float"
        style={{ animationDelay: "0.7s" }}
      >
        <Terminal className="h-10 w-10" />
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
            opacity: 0.5;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

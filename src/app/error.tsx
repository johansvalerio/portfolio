"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home, Code2 } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-destructive/10 dark:bg-destructive/5 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/5 -z-10"></div>

      <div className="max-w-3xl w-full mx-auto text-center space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <Code2 className="h-64 w-64 text-destructive/10 dark:text-destructive/5" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-destructive/10 dark:bg-destructive/20">
                <AlertCircle className="h-16 w-16 text-destructive animate-pulse" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              ¡Ups! Algo salió mal
            </h1>

            <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg max-w-2xl mx-auto">
              <p className="text-muted-foreground">
                {error.message || "Ha ocurrido un error inesperado"}
              </p>
              {error.digest && (
                <p className="text-xs mt-2 text-muted-foreground/70">
                  ID de error: {error.digest}
                </p>
              )}
            </div>

            <p className="text-muted-foreground">
              Lo siento, ha ocurrido un error al cargar la página. Estoy
              trabajando para solucionarlo.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => reset()}
              className="group gap-2"
              variant="default"
            >
              <RefreshCw className="h-4 w-4 animate-spin group-hover:animate-none" />
              Reintentar
            </Button>

            <Button asChild variant="outline" className="gap-2 group">
              <Link href="/" className="flex items-center">
                <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
                Volver al inicio
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            ¿Sigue el problema?{" "}
            <a
              href="mailto:johans.valerio@hotmail.com"
              className="text-primary hover:underline font-medium"
            >
              Contáctame
            </a>
          </p>
        </div>
      </div>

      <style jsx global>{`
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

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

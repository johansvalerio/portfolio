"use client";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Studies from "./components/Studies";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner"; // Importar el hook useSession de next-auth       

export default function Home() {
  // Obtener la sesión del usuario
  const { data: session } = useSession();
  // Mostrar toast cuando el usuario inicia sesión
  useEffect(() => {
    // Mostrar mensaje de bienvenida si es necesario
    if (session && !localStorage.getItem("welcomeShown")) {
      toast(`¡Bienvenido de vuelta, ${session?.user?.name || "usuario"}!`, {
        icon: "👋",
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "full",
        },
      });
      localStorage.setItem("welcomeShown", "true");
    }
  }, [session]);
  return (
    <main className="min-h-screen bg-background">

      <Hero />
      <About />
      <Studies />
      <Skills />
      <Projects />
      <Contact />

    </main>
  );
}

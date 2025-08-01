"use client";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Studies from "./components/Studies";
import Pro from "./components/Pro";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Sobre Mí (Breve introducción) */}
      <About />

      {/* 3. Proyectos Destacados */}
      <Pro />

      {/* 4. Habilidades Principales */}
      <Skills />

      {/* 5. Educación y Certificaciones */}
      <Studies />

      {/* 6. Contacto */}
      <Contact />
    </main>
  );
}

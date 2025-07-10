"use client";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Studies from "./components/Studies";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      <Hero />
      <About />
      <Studies />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}

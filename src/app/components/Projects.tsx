"use client";

import React from "react";
import Carousel3D, { CarouselCard } from "@/components/lightswind/carousel-3d"; // Adjust import path as needed
import { Bot, Code, Server, Smartphone, User } from "lucide-react";
import { motion } from "framer-motion";

function Projects() {
  const projectCards: CarouselCard[] = [
    {
      id: "p1",
      category: "APLICACIÓN PARA PEDIDO DE COMIDAS",
      title: "El Tamalito",
      icon: <Smartphone />,
      preview:
        "Plataforma de pedidos de comida típica con autenticación, catálogo interactivo y seguimiento en tiempo real. ¡Sabores auténticos a un clic de distancia!",
      content:
        "Aplicación web moderna que permite explorar y pedir comidas típicas. Incluye autenticación de usuarios, catálogo interactivo y sistema de pedidos, todo con un diseño responsive. Construida con TypeScript y Prisma para un rendimiento óptimo y fácil escalamiento.",
      imageUrl: "/img/eltamalito.jpg",
      technologies: [
        "Next.js",
        "TypeScript",
        "NextAuth",
        "Tailwind CSS",
        "PostgreSQL",
        "Prisma",
      ],
      githubUrl: "https://github.com/johansvalerio/comidas-tipicas",
      liveUrl: "https://eltamalito.vercel.app",
    },
    {
      id: "p2",
      category: "APLICACIÓN PARA AGENDAR CITAS",
      title: "XSbel Studio",
      icon: <Code />,
      preview:
        "Sistema integral para gestión de citas en centros de belleza. Agendamiento fácil, recordatorios y control total para los profesionales.",
      content:
        "Es una solución todo-en-uno para la gestión de citas en centros de belleza, desarrollada con tecnologías modernas. Esta aplicación web ofrece una experiencia de usuario fluida además de segura, permitiendo a los clientes reservar citas de forma intuitiva y a los profesionales gestionar sus citas con facilidad.",
      imageUrl: "/img/xsbelstudio.jpg",
      technologies: [
        "Next.js",
        "TypeScript",
        "NextAuth",
        "Tailwind CSS",
        "PostgreSQL",
        "Prisma",
      ],
      githubUrl: "https://github.com/johansvalerio/beauty-space",
      liveUrl: "https://xsbelstudio.vercel.app/",
    },
    {
      id: "p3",
      category: "APLICACIÓN INTERACTIVA CON IA",
      title: "Chat PDF",
      icon: <Bot />,
      preview:
        "Revoluciona cómo interactúas con documentos. Haz preguntas y obtén respuestas precisas de cualquier PDF usando IA avanzada.",
      content:
        "Aplicación interactiva con IA para hacerle consultas a tus PDFs. Permite subir documentos PDF y hacer preguntas sobre su contenido utilizando inteligencia artificial para proporcionar respuestas precisas.",
      imageUrl: "/img/chatpdf.jpg",
      technologies: ["Astro", "Svelte", "Tailwind CSS", "IA"],
      githubUrl: "https://github.com/johansvalerio/chatpdf",
      liveUrl: "#",
    },
    {
      id: "p4",
      category: "APLICACIÓN PARA SERVICIOS DE TAXI",
      title: "ASOTAGUA",
      icon: <Server />,
      preview:
        "Solución completa para gestión de taxis: reservas, mensajes con conductores, seguimiento de viajes y administración de flota. Eficiencia sobre ruedas.",
      content:
        "Aplicación web desarrollada para la gestión de reservas de la cooperativa de taxis ASOTAGUA. Incluye módulos para registro de conductores, control de cobros, vehículos, rutas, seguimiento de viajes, puntuación de conductores, mensajería y mucho más.",
      imageUrl: "/img/asotagua2.jpg",
      technologies: ["C#", "Razor", "SQL Server", "Bootstrap"],
      githubUrl: "https://github.com/johansvalerio/asotagua",
      liveUrl: "#",
    },
    {
      id: "p5",
      category: "APLICACION CON CONTROL DE MENSAJES",
      title: "Mi Portafolio",
      icon: <User />,
      preview:
        "Mi espacio digital con carrusel 3D, mensajería en tiempo real y panel de control. Tecnología de punta con un toque personal.",
      content:
        "Portafolio profesional desarrollado con Next.js 14 y TypeScript. Incluye gestión de ideas y mensajería, autenticación con NextAuth, panel de administración, diseño responsive, modo oscuro y animaciones con Framer Motion. Destaca por su carrusel 3D interactivo y está optimizado para SEO.",
      imageUrl: "/img/portfolio.jpg",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "NextAuth",
        "Prisma",
        "PostgreSQL",
      ],
      githubUrl: "https://github.com/johansvalerio/portfolio",
      liveUrl: "https://johansvalerio.vercel.app",
    },
  ];

  return (
    <section id="projects" className="md:py-10 w-full ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-3xl sm:text-4xl font-bold py-15 text-center"
          >
            Mis{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Proyectos
            </span>
          </motion.h2>
          <div className="md:py-20 py-10">
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1 },
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div
                className="border rounded-lg p-8 bg-gradient-to-br from-muted/20 to-muted/30
          dark:bg-gradient-to-br dark:from-background dark:to-muted/10"
              >
                <Carousel3D
                  cards={projectCards}
                  radius={400}
                  className="h-[600px]" // Altura del contenedor
                  cardClassName="w-[275px] h-[400px] md:w-[300px] md:h-[400px]" // Tamaño de las tarjetas
                  enableGlitchEffect={true}
                  enableGlowEffect={true}
                  showControls={true}
                  showThemeToggle={false}
                  onCardClick={(card, index) =>
                    console.log("Card clicked:", card.title, index)
                  }
                  onCardFlip={(card, index, isFlipped) =>
                    console.log("Card flipped:", card.title, isFlipped)
                  }
                  onRotate={(currentIndex) =>
                    console.log("Rotated to index:", currentIndex)
                  }
                  autoRotate={true}
                  autoRotateInterval={4000}
                  pauseOnHover={true}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;

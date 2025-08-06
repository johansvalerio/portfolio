"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useMotionValue, type PanInfo } from "framer-motion";

interface Project {
  id: string;
  category: string;
  title: string;
  preview: string;
  content: string;
  imageUrl: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  gradient: string;
  shape: "cube" | "pyramid" | "sphere" | "diamond";
}

const projects: Project[] = [
  {
    id: "p1",
    category: "APLICACIÓN PARA PEDIDO DE COMIDAS",
    title: "El Tamalito",
    preview:
      "Plataforma de pedidos de comida típica con autenticación, catálogo interactivo y seguimiento en tiempo real. ¡Sabores auténticos a un clic!",
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
    featured: true,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    shape: "pyramid",
  },
  {
    id: "p2",
    category: "APLICACIÓN PARA AGENDAR CITAS",
    title: "XSbel Studio",
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
    featured: true,
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    shape: "diamond",
  },
  {
    id: "p3",
    category: "APLICACIÓN PARA SERVICIOS DE TAXI",
    title: "ASOTAGUA",
    preview:
      "Solución completa para gestión de taxis: reservas, mensajes con conductores, seguimiento de viajes y administración de flota. Eficiencia sobre ruedas.",
    content:
      "Aplicación web desarrollada para la gestión de reservas de la cooperativa de taxis ASOTAGUA. Incluye módulos para registro de conductores, control de cobros, vehículos, rutas, seguimiento de viajes, puntuación de conductores, mensajería y mucho más.",
    imageUrl: "/img/asotagua2.jpg",
    technologies: ["C#", "Razor", "SQL Server", "Bootstrap"],
    githubUrl: "https://github.com/johansvalerio/asotagua",
    liveUrl: "#",
    featured: false,
    gradient: "from-yellow-500 via-orange-400 to-red-400",
    shape: "sphere",
  },
  {
    id: "p4",
    category: "APLICACIÓN INTERACTIVA CON IA",
    title: "Chat PDF",
    preview:
      "Revoluciona cómo interactúas con documentos. Haz preguntas y obtén respuestas precisas de cualquier PDF usando IA avanzada.",
    content:
      "Aplicación interactiva con IA para hacerle consultas a tus PDFs. Permite subir documentos PDF y hacer preguntas sobre su contenido utilizando inteligencia artificial para proporcionar respuestas precisas.",
    imageUrl: "/img/chatpdf.jpg",
    technologies: ["Astro", "IA", "Tailwind CSS", "Svelte"],
    githubUrl: "https://github.com/johansvalerio/chatpdf",
    liveUrl: "#",
    featured: false,
    gradient: "from-blue-500 via-cyan-400 to-teal-400",
    shape: "cube",
  },
  {
    id: "p5",
    category: "APLICACION CON CONTROL DE MENSAJES",
    title: "Mi Portafolio",
    preview:
      "Mi portafolio profesional interactivo con sistema de mensajería en tiempo real y panel de administración.",
    content:
      "Portafolio profesional desarrollado con Next.js 14 y TypeScript. Incluye gestión de ideas y mensajería, autenticación con NextAuth, panel de administración, diseño responsive, modo oscuro y animaciones con Framer Motion, utiliza Zod para validaciones y la aplicación está optimizada para SEO.",
    imageUrl: "/img/portfolio.jpg",
    technologies: [
      "Zod",
      "Socket.io",
      "Zustand",
      "Next.js",
      "NextAuth",
      "TypeScript",
      "Framer Motion",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
    ],
    githubUrl: "https://github.com/johansvalerio/portfolio",
    liveUrl: "https://johansvalerio.up.railway.app",
    featured: true,
    gradient: "from-emerald-500 via-teal-400 to-cyan-400",
    shape: "cube",
  },
];

const ProjectImageWithShape = ({ project }: { project: Project }) => {
  const { shape, gradient, imageUrl, title } = project;
  const baseClasses =
    "absolute transition-all duration-700 group-hover:scale-110 group-hover:rotate-12";

  const renderShape = () => {
    switch (shape) {
      case "pyramid":
        return (
          <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20">
            <div
              className={`${baseClasses} w-full h-full`}
              style={{
                background: `linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(236, 72, 153, 0.9))`,
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                filter: "drop-shadow(0 8px 16px rgba(249, 115, 22, 0.4))",
                transform: "rotate(12deg)",
              }}
            />
          </div>
        );
      case "cube":
        return (
          <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16">
            <div
              className={`${baseClasses} w-full h-full bg-gradient-to-br ${gradient} transform rotate-12 rounded-lg`}
              style={{
                filter: "drop-shadow(0 8px 16px rgba(59, 130, 246, 0.4))",
              }}
            />
          </div>
        );
      case "diamond":
        return (
          <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16">
            <div
              className={`${baseClasses} w-full h-full bg-gradient-to-br ${gradient} transform rotate-45 rounded-sm`}
              style={{
                filter: "drop-shadow(0 8px 16px rgba(168, 85, 247, 0.4))",
              }}
            />
          </div>
        );
      case "sphere":
        return (
          <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16">
            <div
              className={`${baseClasses} w-full h-full bg-gradient-to-br ${gradient} rounded-full`}
              style={{
                filter: "drop-shadow(0 8px 16px rgba(99, 102, 241, 0.4))",
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative group">
      {/* Contenedor principal de la imagen */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/50 backdrop-blur-sm border border-border/50">
        {/* Imagen del proyecto */}
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "/placeholder.svg?height=200&width=300&text=" +
              encodeURIComponent(title);
          }}
        />

        {/* Overlay con gradiente */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
        />

        {/* Overlay para mejor contraste */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/20 group-hover:bg-black/10 dark:group-hover:bg-black/10 transition-colors duration-500" />

        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Forma geométrica flotante */}
      {renderShape()}

      {/* Elementos decorativos adicionales */}
      <div
        className={`absolute -bottom-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${gradient} rounded-full opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-110`}
        style={{ filter: "blur(1px)" }}
      />

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl`}
      />
    </div>
  );
};

export default function ProjectsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1.2);
  const [containerWidth, setContainerWidth] = useState(0);
  const [projectId, setProjectId] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion values para el drag
  const x = useMotionValue(0);
  const dragConstraints = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setVisibleCards(1.2); // Móvil
      } else if (width < 768) {
        setVisibleCards(1.5); // Tablets pequeñas
      } else if (width < 1024) {
        setVisibleCards(2); // Tablets grandes
      } else if (width < 1280) {
        setVisibleCards(2.2); // Pantallas medianas
      } else {
        setVisibleCards(2.5); // Pantallas grandes
      }

      // Actualizar el ancho del contenedor
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShowAllTechnologies = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setProjectId((prevId) => (prevId === id ? "" : id));
    },
    []
  );

  // Calcular el máximo índice basado en las cards visibles
  const getMaxIndex = useCallback(() => {
    return Math.max(0, projects.length - Math.floor(visibleCards));
  }, [visibleCards]);

  const nextSlide = useCallback(() => {
    const maxIndex = getMaxIndex();
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    if (maxIndex === currentIndex) {
      setCurrentIndex(0);
    }
  }, [getMaxIndex, currentIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    if (currentIndex === 0) {
      setCurrentIndex(getMaxIndex());
    }
  }, [getMaxIndex, currentIndex]);

  // Calcular el ancho de cada card basado en las cards visibles
  const cardWidth = 100 / visibleCards;
  const maxIndex = getMaxIndex();

  // Lógica especial para el último slide
  let currentTranslateX;
  if (currentIndex === maxIndex && projects.length > visibleCards) {
    // En el último slide, ajustar para mostrar exactamente las últimas cards visibles
    currentTranslateX = -(projects.length - visibleCards) * cardWidth;
  } else {
    currentTranslateX = -currentIndex * cardWidth;
  }

  // Función para manejar el final del drag
  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = containerWidth * 0.1; // 10% del ancho del contenedor
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      // Si la velocidad es alta, cambiar slide independientemente del offset
      if (Math.abs(velocity) > 500) {
        if (velocity > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
      // Si no, usar el offset
      else if (Math.abs(offset) > threshold) {
        if (offset > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }

      // Reset x position
      x.set(0);
    },
    [containerWidth, nextSlide, prevSlide, x]
  );

  //ordenar por featured
  const projectByFeatured = [...projects].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  return (
    <section
      id="projects"
      className="min-h-screen relative bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-black dark:to-gray-900 py-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.5, delay: 0.2 },
            }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-bold mb-6"
          >
            Mis{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
              Proyectos
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.7 },
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Explora mis soluciones innovadoras construidas con tecnologías
            modernas y enfoques creativos.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="relative mx-auto" ref={containerRef}>
            {/* Navigation Arrows */}
            <div className="hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="absolute cursor-pointer xl:-left-20 lg:-left-5 md:-left-5 -left-0 top-1/2 -translate-y-1/2 z-30 bg-background/90 dark:bg-gray-900/90 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 backdrop-blur-sm w-12 h-12 rounded-full shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="absolute cursor-pointer xl:-right-20 lg:-right-5 md:-right-5 -right-0 top-1/2 -translate-y-1/2 z-30 bg-background/90 dark:bg-gray-900/90 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 backdrop-blur-sm w-12 h-12 rounded-full shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Carousel Content */}
            <div className="overflow-hidden rounded-3xl" ref={dragConstraints}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.9 },
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex cursor-grab active:cursor-grabbing"
                style={{
                  x,
                  translateX: `${currentTranslateX}%`,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                animate={{
                  translateX: `${currentTranslateX}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                {projectByFeatured.map((project) => (
                  <div
                    key={project.id}
                    className="px-3 flex-shrink-0 py-6 select-none"
                    style={{ width: `${cardWidth}%` }}
                  >
                    <div
                      className={`
                    relative backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 h-[520px] sm:h-[550px] md:h-[580px] lg:h-[600px] flex flex-col
                    border-2 group hover:scale-[1.02] transition-all duration-500
                    ${
                      project.featured
                        ? "border-transparent bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 p-[2px] shadow-2xl shadow-purple-500/25 ring-2 ring-purple-400/20"
                        : "border-border/50 hover:border-border/80 shadow-xl bg-card/80 dark:bg-gray-900/80 -transition-colors duration-300"
                    }
                  `}
                      style={
                        project.featured
                          ? {
                              background: `linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(99, 102, 241, 0.3), rgba(59, 130, 246, 0.3))`,
                              padding: "2px",
                            }
                          : {}
                      }
                    >
                      {/* Inner container para proyectos destacados */}
                      <div
                        className={`${
                          project.featured
                            ? "bg-card/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 h-full flex flex-col"
                            : "h-full flex flex-col"
                        }`}
                      >
                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                            <Badge className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white border-0 shadow-lg px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                              DESTACADO
                            </Badge>
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex flex-col h-full">
                          {/* Header */}
                          <div className="flex-shrink-0 mb-4">
                            <div className="mb-2">
                              <span className="text-xs text-purple-400 font-semibold tracking-wider uppercase">
                                {project.category}
                              </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4 leading-tight group-hover:text-purple-300 transition-colors">
                              {project.title}
                            </h2>
                          </div>

                          {/* Description */}
                          <div className="flex-shrink-0 mb-4">
                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                              {project.preview}
                            </p>
                          </div>

                          {/* Technologies */}
                          <div className="flex-shrink-0 mb-10">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {project.technologies
                                .slice(
                                  0,
                                  projectId === project.id
                                    ? project.technologies.length
                                    : 3
                                )
                                .map((tech) => (
                                  <Badge
                                    variant="secondary"
                                    key={tech}
                                    className="bg-muted/80 dark:bg-gray-800/80 text-muted-foreground dark:text-gray-200 hover:bg-muted/60 dark:hover:bg-gray-700/80 transition-colors px-2 py-1 text-xs sm:text-sm"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              {project.technologies.length > 3 && (
                                <Badge
                                  onClick={(e) =>
                                    handleShowAllTechnologies(e, project.id)
                                  }
                                  variant="secondary"
                                  className={`bg-muted/80 dark:bg-gray-800/80 text-muted-foreground/70 dark:text-gray-400 px-2 py-1 text-xs sm:text-sm cursor-pointer hover:bg-muted/60 dark:hover:bg-gray-700/80 transition-colors ${
                                    projectId === project.id
                                      ? "bg-muted/60 dark:bg-gray-700/80"
                                      : ""
                                  }`}
                                >
                                  {projectId === project.id ? (
                                    <div className="flex items-center justify-between">
                                      <ChevronLeft className="w-4 h-4" />
                                    </div>
                                  ) : (
                                    `Ver +${project.technologies.length - 3}`
                                  )}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Image */}
                          <div className="flex-shrink-0 h-32 sm:h-36 lg:h-40 flex items-center justify-center mb-6">
                            <div className="w-full max-w-sm">
                              <ProjectImageWithShape project={project} />
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-2 sm:gap-3 mt-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 cursor-pointer border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground bg-transparent transition-all text-xs sm:text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.githubUrl, "_blank");
                              }}
                            >
                              <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Repositorio
                            </Button>
                            <Button
                              size="sm"
                              className={`${!project.featured && "hidden"}
                                flex-1 text-white border-0 shadow-lg transition-all text-xs sm:text-sm ${
                                  project.featured
                                    ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 shadow-violet-500/25"
                                    : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600"
                                }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (project.liveUrl !== "#") {
                                  window.open(project.liveUrl, "_blank");
                                }
                              }}
                              disabled={project.liveUrl === "#"}
                            >
                              <ExternalLink className="w-3 h-3 sm:w-4 sm:mr-2" />
                              {project.liveUrl === "#"
                                ? "Próximamente"
                                : "Ir al sitio"}
                            </Button>
                          </div>
                        </div>

                        {/* Featured Glow */}
                        {project.featured && (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-indigo-600/5 to-blue-600/5 rounded-2xl pointer-events-none" />
                        )}
                      </div>

                      {/* Floating Elements */}
                      <div
                        className={`absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${project.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-2 sm:space-x-3">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.9 },
                }}
                viewport={{ once: true, margin: "-50px" }}
                key={index}
                onClick={() => setCurrentIndex(Math.min(index, maxIndex))}
                className={`cursor-pointer h-2 sm:h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 w-6 sm:w-8 shadow-lg shadow-cyan-500/50"
                    : "bg-muted-foreground/40 hover:bg-muted-foreground/60 hover:scale-110 w-2 sm:w-3"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

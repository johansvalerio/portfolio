"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    title: "El Tamalito",
    description:
      "Aplicación web moderna que permite explorar y pedir comidas típicas. Incluye autenticación de usuarios, catálogo interactivo y sistema de pedidos, todo con un diseño responsive. Construida con TypeScript y Prisma para un rendimiento óptimo y fácil escalamiento.",
    image: "/img/eltamalito.jpg",
    technologies: [
      "Next.js",
      "TypeScript",
      "NextAuth",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Vercel",
    ],
    liveUrl: "https://eltamalito.vercel.app",
    githubUrl: "https://github.com/johansvalerio/comidas-tipicas",
    featured: true,
  },
  {
    title: "XSbel Studio",
    description:
      "Es una solución todo-en-uno para la gestión de citas en centros de belleza, desarrollada con tecnologías modernas. Esta aplicación web ofrece una experiencia de usuario fluida además de segura, permitiendo a los clientes reservar citas de forma intuitiva y a los profesionales gestionar sus citas con facilidad.",
    image: "/img/xsbelstudio.jpg",
    technologies: [
      "Next.js",
      "TypeScript",
      "NextAuth",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Vercel",
    ],
    liveUrl: "https://xsbelstudio.vercel.app/",
    githubUrl: "https://github.com/johansvalerio/beauty-space",
    featured: true,
  },
  {
    title: "Chat PDF",
    description:
      "Aplicación interactiva con IA para hacerle consultas a tus PDFs.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Astro", "Svelte", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "https://github.com/johansvalerio/chatpdf",
    featured: false,
  },
  {
    title: "ASOTAGUA Taxis",
    description:
      "Aplicación para gestionar reservas de taxis en la compañía ASOTAGUA.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["C#", "Razor", "SQL Server", "Bootstrap"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    title: "Portfolio Website",
    description:
      "Sitio web de portafolio personal con diseño moderno y animaciones suaves.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: [
      "Next.js",
      "TypeScript",
      "NextAuth",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Vercel",
    ],
    liveUrl: "https://johansvalerio.vercel.app",
    githubUrl: "https://github.com/johansvalerio/portfolio",
    featured: false,
  },
];

const featuredProjects = projects.filter((project) => project.featured);
const otherProjects = projects.filter((project) => !project.featured);

export default function Projects() {
  return (
    <section
      id="projects"
      className="py-20 relative bg-gradient-to-br from-primary/5 to-blue-600/5"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6 },
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Mis{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Proyectos
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.1 },
              }}
              viewport={{ once: true }}
              className="text-muted-foreground text-lg"
            >
              Una selección de mis trabajos más destacados
            </motion.p>
          </div>

          {/* Featured Projects */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      delay: 0.3 + index * 0.1,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-0 pb-6 group flex flex-col h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/50">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="flex flex-col flex-grow">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3 mt-auto pt-4">
                        <Button
                          size="sm"
                          className="flex-1 cursor-pointer"
                          asChild
                        >
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver proyecto
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          asChild
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Other Projects */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold mb-8 text-center"
            >
              Otros Proyectos
            </motion.h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.5,
                      delay: 0.2 + index * 0.1,
                    },
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    key={index}
                    className="group flex flex-col h-full border-0 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="flex flex-col flex-grow">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies
                            .slice(0, 4)
                            .map((tech, techIndex) => (
                              <Badge
                                key={techIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <div className="flex justify-center gap-2 mt-auto pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          asChild
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

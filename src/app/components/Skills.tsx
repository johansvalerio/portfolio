"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategories {
  title: string;
  skills: Skill[];
  gradient: string;
  icon: string;
  totalProjects: number;
  yearsExp: number;
}

const skillCategories: SkillCategories[] = [
  {
    title: "Frontend",
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
    icon: "🎨",
    totalProjects: 5,
    yearsExp: 2,
    skills: [
      { name: "React / Next.js", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "UI/UX (Tailwind CSS, Shadcn UI)", level: 80 },
      { name: "Animations (Framer Motion)", level: 70 },
    ],
  },
  {
    title: "Backend",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    icon: "⚙️",
    totalProjects: 5,
    yearsExp: 2,
    skills: [
      { name: "APIs RESTful (TypeScript, C#/.NET)", level: 80 },
      { name: "Bases de Datos (PostgreSQL, SQL Server)", level: 80 },
      { name: "ORMs (Prisma, Entity Framework)", level: 80 },
      { name: "Autenticación (NextAuth.js, OAuth, JWT)", level: 75 },
    ],
  },
  {
    title: "DevOps & Tools",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    icon: "🚀",
    totalProjects: 3,
    yearsExp: 1,
    skills: [
      { name: "CI/CD y Despliegue (Vercel, Railway)", level: 85 },
      { name: "Control de Versiones (Git, GitHub)", level: 80 },
      { name: "Calidad de código (ESLint, Prettier)", level: 85 },
      { name: "Testing básico (Jest, React Testing Library)", level: 60 },
    ],
  },
];

interface Technology {
  name: string;
  category: string;
  color: string;
  shadow: string;
}

const technologies: Technology[] = [
  // Frontend
  {
    name: "React",
    category: "Frontend",
    color: "from-cyan-400 to-blue-500 dark:from-cyan-500 dark:to-blue-600",
    shadow: "shadow-cyan-500/20 hover:shadow-cyan-500/40",
  },
  {
    name: "Zustand",
    category: "Frontend",
    color:
      "from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700",
    shadow: "shadow-purple-500/20 hover:shadow-purple-500/40",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    color: "from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700",
    shadow: "shadow-blue-500/20 hover:shadow-blue-500/40",
  },
  {
    name: "Socket.io",
    category: "Frontend",
    color: "from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800",
    shadow: "shadow-gray-500/20 hover:shadow-gray-500/40",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    color: "from-cyan-400 to-sky-500 dark:from-cyan-500 dark:to-sky-600",
    shadow: "shadow-cyan-400/20 hover:shadow-cyan-400/40",
  },
  {
    name: "Shadcn UI",
    category: "Frontend",
    color:
      "from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700",
    shadow: "shadow-emerald-500/20 hover:shadow-emerald-500/40",
  },
  {
    name: "Framer Motion",
    category: "Frontend",
    color:
      "from-fuchsia-500 to-purple-600 dark:from-fuchsia-600 dark:to-purple-700",
    shadow: "shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40",
  },
  {
    name: "Next.js",
    category: "Frontend",
    color: "from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-900",
    shadow: "shadow-slate-800/20 hover:shadow-slate-800/40",
  },

  // Backend
  {
    name: "JWT/OAuth",
    category: "Backend",
    color:
      "from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600",
    shadow: "shadow-amber-500/20 hover:shadow-amber-500/40",
  },
  {
    name: "Zod",
    category: "Backend",
    color: "from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700",
    shadow: "shadow-blue-600/20 hover:shadow-blue-600/40",
  },
  {
    name: "PostgreSQL",
    category: "Backend",
    color: "from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700",
    shadow: "shadow-blue-500/20 hover:shadow-blue-500/40",
  },
  {
    name: "Prisma ORM",
    category: "Backend",
    color: "from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700",
    shadow: "shadow-cyan-500/20 hover:shadow-cyan-500/40",
  },
  {
    name: "C#",
    category: "Backend",
    color:
      "from-purple-600 to-indigo-700 dark:from-purple-700 dark:to-indigo-800",
    shadow: "shadow-purple-600/20 hover:shadow-purple-600/40",
  },
  {
    name: "Razor",
    category: "Backend",
    color: "from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700",
    shadow: "shadow-blue-500/20 hover:shadow-blue-500/40",
  },
  {
    name: ".NET",
    category: "Backend",
    color:
      "from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800",
    shadow: "shadow-indigo-600/20 hover:shadow-indigo-600/40",
  },
  {
    name: "SQL Server",
    category: "Backend",
    color: "from-red-500 to-orange-600 dark:from-red-600 dark:to-orange-700",
    shadow: "shadow-red-500/20 hover:shadow-red-500/40",
  },
  {
    name: "Entity Framework",
    category: "Backend",
    color: "from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700",
    shadow: "shadow-purple-500/20 hover:shadow-purple-500/40",
  },

  // DevOps & Tools
  {
    name: "Git/GitHub",
    category: "DevOps & Tools",
    color: "from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800",
    shadow: "shadow-slate-700/20 hover:shadow-slate-700/40",
  },
  {
    name: "Jest",
    category: "DevOps & Tools",
    color: "from-red-600 to-pink-700 dark:from-red-700 dark:to-pink-800",
    shadow: "shadow-red-600/20 hover:shadow-red-600/40",
  },
  {
    name: "React Testing Library",
    category: "DevOps & Tools",
    color: "from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700",
    shadow: "shadow-rose-500/20 hover:shadow-rose-500/40",
  },
  {
    name: "Vercel",
    category: "DevOps & Tools",
    color: "from-black to-gray-900 dark:from-gray-900 dark:to-black",
    shadow: "shadow-gray-900/20 hover:shadow-gray-900/40",
  },
  {
    name: "Railway",
    category: "DevOps & Tools",
    color:
      "from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700",
    shadow: "shadow-purple-500/20 hover:shadow-purple-500/40",
  },
];

// CircularProgress Component
const CircularProgress = ({
  percentage,
  size = 120,
  strokeWidth = 8,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient
            id={`gradient-${percentage}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              className="text-purple-400"
              stopColor="currentColor"
            />
            <stop
              offset="50%"
              className="text-indigo-500"
              stopColor="currentColor"
            />
            <stop
              offset="100%"
              className="text-blue-600"
              stopColor="currentColor"
            />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${percentage})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
      </div> */}
    </div>
  );
};

// Función para dividir las tecnologías en filas
const createTechRows = (techs: Technology[], itemsPerRow: number) => {
  const rows = [];
  for (let i = 0; i < techs.length; i += itemsPerRow) {
    rows.push(techs.slice(i, i + itemsPerRow));
  }
  return rows;
};

// Componente para fila con movimiento grupal seamless
const MovingTechRow = ({
  technologies,
  direction = "right",
}: {
  technologies: Technology[];
  direction: "left" | "right";
}) => {
  // Triplicamos las tecnologías para crear el efecto seamless
  const tripleTechs = useMemo(
    () => [...technologies, ...technologies, ...technologies],
    [technologies]
  );

  return (
    <div className="relative overflow-hidden h-16 flex items-center">
      <motion.div
        className="flex gap-4 whitespace-nowrap"
        initial={{ x: 0 }}
        animate={{ x: direction === "left" ? "-20%" : "0%" }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        {tripleTechs.map((tech, index) => (
          <motion.div
            key={`${tech.name}-${index}`}
            whileHover={{
              y: -8,
              scale: 1.05,
            }}
            className="group flex-shrink-0"
          >
            <div className="relative">
              {/* Technology Badge */}
              <Badge
                variant="secondary"
                className={`
                  justify-center text-center py-3 px-4 text-sm font-semibold
bg-gradient-to-r ${tech.color} text-white
                  border-0 shadow-lg ${tech.shadow}
                  transition-all duration-300 cursor-default
                  group-hover:shadow-xl group-hover:scale-105 whitespace-nowrap
                `}
              >
                {tech.name}
              </Badge>

              {/* Glow Effect */}
              <div
                className={`
absolute inset-0 bg-gradient-to-r ${tech.color}
                  opacity-0 group-hover:opacity-30
                  transition-all duration-500 rounded-md blur-lg -z-10
                `}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryClick = useCallback(
    (e: React.MouseEvent, categoryTitle: string) => {
      e.stopPropagation();
      if (selectedCategory === categoryTitle) {
        setSelectedCategory("");
      } else {
        setSelectedCategory(categoryTitle);
      }
    },
    [selectedCategory]
  );

  // Crear filas de tecnologías (7 por fila para pantallas grandes)
  const techRows = createTechRows(technologies, 8);

  return (
    <section
      id="skills"
      className="py-20 w-full relative overflow-hidden bg-gradient-to-br from-background/95 via-background/90 to-muted/10 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-900/95"
    >
      {/* Efectos de fondo mejorados */}
      <div className="absolute inset-0 bg-[radial-gradient(#6b7280_1px,transparent_1px)] dark:bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:32px_32px] opacity-10 dark:opacity-5" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 rounded-full blur-3xl opacity-70" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl opacity-70" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-violet-500/3 to-fuchsia-500/3 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-bold mb-6"
            >
              Habilidades &{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                Tecnologías
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.5 },
              }}
              viewport={{ once: true }}
              className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Un vistazo completo a mis habilidades técnicas y experiencia
              profesional
            </motion.p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 lg:items-start">
            {/* Main Skills Cards - symmetric Layout */}
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: 0.2 + index * 0.1,
                  },
                }}
                viewport={{ once: true }}
                className={`
                  ${index === 0 ? "lg:col-span-4" : ""}
                  ${index === 1 ? "lg:col-span-4" : ""}
                  ${index === 2 ? "lg:col-span-4" : ""}
                  lg:self-start
                `}
              >
                <Card
                  className={`
                    group relative backdrop-blur-xl rounded-3xl p-6 border-2 border-border/30 
                    shadow-2xl bg-card/60 dark:bg-gray-900/60 hover:scale-[1.02] 
                    transition-all duration-500 overflow-hidden cursor-pointer
                    ${selectedCategory === category.title ? "ring-2 ring-purple-400/50 scale-[1.02]" : ""}
                    lg:min-h-fit lg:h-auto
                  `}
                  onClick={(e) => handleCategoryClick(e, category.title)}
                >
                  {/* Animated Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Header with Metrics */}
                  <div className="relative z-10 ">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`text-3xl p-2 rounded-xl bg-gradient-to-br ${category.gradient} bg-opacity-10`}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {category.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.yearsExp <= 1
                              ? category.yearsExp + " año de experiencia"
                              : category.yearsExp + " años de experiencia"}
                          </p>
                        </div>
                      </div>

                      {/* Circular Progress */}
                      <div className="hidden sm:block">
                        <CircularProgress
                          percentage={Math.round(
                            category.skills.reduce(
                              (acc, skill) => acc + skill.level,
                              0
                            ) / category.skills.length
                          )}
                          size={80}
                          strokeWidth={6}
                        />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-4 mb-2">
                      <div
                        className={`px-3 py-1 rounded-full bg-gradient-to-r ${category.gradient} bg-opacity-10 border border-current border-opacity-20`}
                      >
                        <span className="text-sm font-semibold">
                          {category.totalProjects} proyectos
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-muted/50">
                        <span className="text-sm font-semibold">
                          {
                            technologies.filter(
                              (tech) => tech.category === category.title
                            ).length
                          }{" "}
                          tecnologías del stack
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agregar un ChevronDown y ChevronUp con animate-bounce */}
                  <div className="flex justify-end">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="p-2 bg-muted/70 hover:bg-muted/50 rounded-full w-fit"
                    >
                      {selectedCategory === category.title ? (
                        <ChevronUp className="w-6 h-6 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
                      )}
                    </motion.div>
                  </div>

                  {/* Skills List - Expandable */}
                  <AnimatePresence>
                    {selectedCategory === category.title && (
                      <motion.div
                        key={`${category.title}-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pb-4">
                          {category.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex flex-col">
                              <span className="text-sm font-medium">
                                {skill.name}
                              </span>
                              <div className="flex items-center justify-between gap-2">
                                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                                  <motion.div
                                    key={`bar-${category.title}-${skillIndex}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{
                                      duration: 0.8,
                                      delay: skillIndex * 0.1,
                                    }}
                                    className={`h-full bg-gradient-to-r ${category.gradient} rounded-full`}
                                  />
                                </div>
                                {/* <span className="text-xs text-muted-foreground w-8">
                                  {skill.level}%
                                </span> */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Floating Elements */}
                  <div
                    className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                  />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Technologies Section - Seamless Group Movement */}
          <div className="space-y-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-center py-8"
            >
              Stack Tecnológico
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: 0.3,
                },
              }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Background Card with Gradient */}
              <div className="relative backdrop-blur-xl rounded-3xl p-8 border-2 border-border/30 bg-card/60 dark:bg-gray-900/60 overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-blue-500/5 animate-pulse" />

                {/* Floating Geometric Shapes */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 rounded-full blur-xl" />
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-lg rotate-45 blur-lg" />

                {/* Fade Gradients for seamless effect */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-card/60 dark:from-gray-900/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-card/60 dark:from-gray-900/60 to-transparent z-10 pointer-events-none" />

                {/* Technologies with Seamless Group Movement */}
                <div className="relative z-0 space-y-6">
                  {techRows.map((row, rowIndex) => (
                    <MovingTechRow
                      key={rowIndex}
                      technologies={row}
                      direction={"left"}
                    />
                  ))}
                </div>

                {/* Bottom Gradient Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 opacity-30" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

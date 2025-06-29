"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
//import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategories {
  title: string;
  skills: Skill[];
}

const skillCategories: SkillCategories[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React/Next.js", level: 85 },
      { name: "TypeScript (Frontend & Backend)", level: 83 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Shadcn UI", level: 82 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "JWT/OAuth (NextAuth)", level: 83 },
      { name: "C#", level: 80 },
      { name: "PostgreSQL", level: 82 },
      { name: "API Rest", level: 85 },
    ],
  },
  {
    title: "DevOps & Tools",
    skills: [
      { name: "Vercel (Deploy & DB Storage)", level: 83 },
      { name: "CI/CD", level: 80 },
      { name: "Git/GitHub", level: 85 },
      { name: "Prisma ORM", level: 85 },
    ],
  },
];

const technologies: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "Shadcn UI",
  "JWT/OAuth",
  "C#",
  "PostgreSQL",
  "SQL Server",
  "Tailwind CSS",
  "Prisma ORM",
  "Git/GitHub",
  ".NET",
  "Vercel",
];

export default function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Skills &{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
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
              className="text-muted-foreground text-lg"
            >
              Las herramientas y tecnologías que domino
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 1,
                    delay: 0.6 + index * 0.2,
                  },
                }}
                viewport={{
                  once: true,
                }}
              >
                <Card
                  key={index}
                  className="group shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-0 overflow-hidden"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-center">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {skill.name}
                          </span>
                          {/* <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span> */}
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{
                            width: `100%`,
                            opacity: 1,
                            x: 0,
                            transition: {
                              duration: 0.5,
                              delay: skillIndex * 0.1, // Esto hace que cada barra se anime secuencialmente
                            },
                          }}
                          viewport={{ once: true }} // La animación solo ocurre una vez
                          className="relative bg-primary/10 h-2 rounded-full"
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${skill.level}%`,
                              transition: {
                                duration: 1,
                                ease: [0.6, 0.05, 0.01, 0.9], // Curva de aceleración personalizada
                                delay: 0.3 + skillIndex * 0.1, // Retraso adicional para el efecto de carga
                              },
                            }}
                            viewport={{ once: true }}
                            className="h-2 bg-blue-600 rounded-full"
                          />
                        </motion.div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Technologies */}
          <div className="space-y-6">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
              viewport={{ once: true }}
              className="text-2xl font-semibold text-center"
            >
              Tecnologías que utilizo
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  delay: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-blue-600/5">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap justify-center gap-3">
                    {technologies.map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{
                          opacity: 1,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: 0.6 + index * 0.1, // Inicia después de la animación de la tarjeta
                          },
                        }}
                        viewport={{ once: true }}
                        whileHover={{ y: -3 }}
                      >
                        <Badge
                          variant="secondary"
                          className="text-sm py-2 px-4 text-blue-500 bg-blue-50 hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                        >
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

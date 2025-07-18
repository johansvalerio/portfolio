"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen } from "lucide-react";

interface StudiesData {
  id: number;
  institution: string;
  degree: string[] | string;
  year: string;
  type: "education" | "course";
}

const studiesData: StudiesData[] = [
  {
    id: 1,
    institution: "Universidad Hispanoamericana",
    degree: "Bachelor's degree of Informatics Engineering",
    year: "2023",
    type: "education",
  },
  {
    id: 2,
    institution: "Miguel Araya Venegas High School",
    degree: "General Certificate of Secondary Education",
    year: "2014",
    type: "education",
  },
  {
    id: 3,
    institution: "Cisco",
    degree: "Introduction to Data Science",
    year: "2023",
    type: "course",
  },
  {
    id: 4,
    institution: "Cisco & OpenEDG Python Institute",
    degree: ["Python Essentials I", "Python Essentials II"],
    year: "2023",
    type: "course",
  },
  {
    id: 5,
    institution: "Oracle & Alura LATAM",
    degree: [
      "Git y GitHub: repositorio, commit y versiones",
      "Lógica de programación con JavaScript",
      "Desarrollo personal G6 - ONE",
      "Programación principiante G6 - ONE",
    ],
    year: "2024",
    type: "course",
  },
  {
    id: 6,
    institution: "Universidad Técnica Nacional",
    degree: "English III",
    year: "2022",
    type: "course",
  },
];

export default function Studies() {
  // Ordenar educación por año de forma descendente (más reciente primero)
  const education = studiesData
    .filter((item) => item.type === "education")
    .sort((a, b) => Number(b.year) - Number(a.year));
  // Ordenar cursos por año de forma descendente (más reciente primero)
  const courses = studiesData
    .filter((item) => item.type === "course")
    .sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <section id="studies" className="py-20 w-full relative overflow-hidden">
      {/* Patrón de cuadrícula sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxZDVkOSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtZGFzaGFycmF5PSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=')] opacity-50 dark:opacity-5" />

      {/* Gradiente de acento */}
      <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-sky-500/20 dark:bg-sky-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen blur-3xl" />
      {/* Gradiente de acento */}
      <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-500/20 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              Mi{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Educación
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.3 },
              }}
              viewport={{ once: true }}
              className="text-muted-foreground text-lg"
            >
              Mi formación académica y certificaciones profesionales
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.4 },
              }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center md:text-left">
                Académico
              </h3>
              <div className="space-y-6">
                {education.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.5 },
                    }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-primary/5 backdrop-blur-sm border border-border/20 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="pb-2 relative z-10">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10 text-primary mt-1">
                            {item.type === "education" ? (
                              <GraduationCap className="h-5 w-5" />
                            ) : (
                              <BookOpen className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                              {item.institution}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {item.year}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm list-disc list-inside text-muted-foreground/90 group-hover:text-foreground/90 transition-colors duration-300">
                          <li>{item.degree}</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.5 },
              }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center md:text-left">
                Cursos & Certificaciones
              </h3>
              <div className="space-y-6">
                {courses.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.5 },
                    }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-primary/5 backdrop-blur-sm border border-border/20 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                      <CardHeader className="pb-2 relative z-10">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-primary/10 text-primary mt-1">
                            {item.type === "education" ? (
                              <GraduationCap className="h-5 w-5" />
                            ) : (
                              <BookOpen className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                              {item.institution}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {item.year}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {Array.isArray(item.degree) ? (
                          item.degree.map((degree, index) => (
                            <ul
                              key={index}
                              className="text-sm list-disc list-inside text-muted-foreground/90 group-hover:text-foreground/90 transition-colors duration-300"
                            >
                              <li>{degree}</li>
                            </ul>
                          ))
                        ) : (
                          <ul className="text-sm list-disc list-inside text-muted-foreground/90 group-hover:text-foreground/90 transition-colors duration-300">
                            <li>{item.degree}</li>
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

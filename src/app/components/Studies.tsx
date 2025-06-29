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
    institution: "Universidad Técnica Nacional",
    degree: "English III",
    year: "2022",
    type: "course",
  },
];

export default function Studies() {
  const education = studiesData.filter((item) => item.type === "education");
  const courses = studiesData.filter((item) => item.type === "course");

  return (
    <section
      id="studies"
      className="py-20 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10"
    >
      {/* Efecto de partículas sutiles */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
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
                Educación
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
                    <Card className="bg-background/80 backdrop-blur-sm border border-border/20 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
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
                        <p className="text-sm text-muted-foreground/90 group-hover:text-foreground/90 transition-colors duration-300">
                          {item.degree}
                        </p>
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
                    <Card className="bg-background/80 backdrop-blur-sm border border-border/20 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
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
                            <p
                              key={index}
                              className="text-sm text-muted-foreground/90 group-hover:text-foreground/90 transition-colors duration-300"
                            >
                              {degree}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground/90 group-hover:text-foreground/90 transition-colors duration-300">
                            {item.degree}
                          </p>
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

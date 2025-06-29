"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const highlights: string[] = [
  "Experiencia en desarrollo web y freelancing",
  "3+ proyectos completados",
  "Full-stack developer",
  "Enfocado en React/Next.js",
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Sobre mí
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Conoce más sobre mi trayectoria y pasión por el desarrollo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/50">
                <CardContent className="p-8">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-primary via-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    JS
                  </motion.div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                        }}
                      >
                        <Badge
                          variant="secondary"
                          className="animate-pulse"
                          style={{
                            animationDelay: `${index * 0.2}s`,
                            animationDuration: "2s",
                            animationIterationCount: "infinite",
                            animationTimingFunction:
                              "cubic-bezier(0.5, 0, 0.5, 1)",
                          }}
                        >
                          {highlight}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.p
                className="text-lg leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Soy Johans Valerio, ingeniero informático con una pasión por
                crear soluciones digitales innovadoras. Mi formación académica
                me ha proporcionado una base sólida en desarrollo de software,
                especializándome en tecnologías modernas como React, Next.js,
                TypeScript y PostgreSQL. Con un enfoque en el desarrollo
                full-stack, busco constantemente oportunidades para expandir mis
                conocimientos y crecer profesionalmente en el ámbito
                tecnológico.
              </motion.p>

              <motion.p
                className="text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Cuando no estoy programando, me gusta mantenerme actualizado con
                las últimas tendencias en tecnología, impartir mentorías a
                jóvenes programadores y compartir conocimientos con la
                comunidad.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

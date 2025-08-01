"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen } from "lucide-react";

// --- Datos y Constantes ---
interface StudiesData {
  id: number;
  institution: string;
  degree?: string | string[];
  year: string;
  type: "education" | "course";
  description?: string;
}

const studiesData: StudiesData[] = [
  {
    id: 1,
    institution: "Universidad Hispanoamericana",
    degree: "Ingeniería Informática (Bachillerato)",
    year: "2023",
    type: "education",
    description: "Enfoque en desarrollo de software y sistemas de información.",
  },
  {
    id: 2,
    institution: "Miguel Araya Venegas High School",
    degree: "Bachillerato en Educación Media",
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
      "Git y GitHub: Repositorio, Commit y Versiones",
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

// --- Componente StudyCard reutilizable ---
interface StudyCardProps {
  item: StudiesData;
  animationDelay: number;
  isEven: boolean;
}

const StudyCard: React.FC<StudyCardProps> = ({
  item,
  animationDelay,
  isEven,
}) => {
  // --- Colores y estilos ---
  const isEducation = item.type === "education";

  // Gradientes para el fondo (siempre visibles)
  const gradientClass = isEducation
    ? "from-purple-500/10 via-indigo-500/5 to-blue-500/10"
    : "from-teal-500/10 via-cyan-500/5 to-sky-500/10";

  // Estilos del icono
  const iconBgClass = isEducation
    ? "bg-purple-100 text-purple-400"
    : "bg-teal-100 text-teal-400";

  // Estilos del borde
  const hoverBorderClass = isEducation
    ? "border-muted/40 dark:border-muted/30 hover:border-purple-500 dark:hover:border-purple-500"
    : "border-muted/40 dark:border-muted/30 hover:border-teal-500 dark:hover:border-teal-500";

  // Estilos del título
  const hoverTitleClass = isEducation
    ? "group-hover:text-black dark:group-hover:text-white"
    : "group-hover:text-black dark:group-hover:text-white";

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, delay: animationDelay, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card
        className={`relative bg-background/60 backdrop-blur-md border ${hoverBorderClass} transition-all duration-300 overflow-hidden group`}
      >
        {/* Fondo degradado - siempre visible */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} transition-opacity duration-300`}
        />

        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

        <CardHeader className="pb-2 relative z-10 flex flex-row items-center gap-4">
          <div className={`p-3 rounded-full ${iconBgClass} flex-shrink-0`}>
            {item.type === "education" ? (
              <GraduationCap className="h-6 w-6" />
            ) : (
              <BookOpen className="h-6 w-6" />
            )}
          </div>
          <div className="flex-grow">
            <CardTitle
              className={`text-lg font-semibold text-foreground ${hoverTitleClass} transition-colors duration-300`}
            >
              {item.institution}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{item.year}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 relative z-10">
          {item.degree && (
            <ul className="text-sm list-disc list-inside text-muted-foreground/80 group-hover:text-foreground/90 transition-colors duration-300">
              {Array.isArray(item.degree) ? (
                item.degree.map((degree, index) => (
                  <li key={index}>{degree}</li>
                ))
              ) : (
                <li>{item.degree}</li>
              )}
            </ul>
          )}
          {item.description && (
            <p className="text-sm text-muted-foreground/90 mt-2">
              {item.description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// --- Componente Principal Studies ---
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
      <div className="absolute inset-0 bg-[radial-gradient(#a3a3a3_1px,transparent_1px)] dark:bg-[radial-gradient(#4a4a4a_1px,transparent_1px)] [background-size:24px_24px] opacity-10 dark:opacity-5" />

      {/* Gradientes de acento más sutiles */}
      <div className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full mix-blend-multiply dark:mix-blend-screen blur-3xl animate-blob" />
      <div className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-500/10 dark:bg-blue-500/5 rounded-full mix-blend-multiply dark:mix-blend-screen blur-3xl animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl font-bold mb-6"
            >
              Mi{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                Formación
              </span>{" "}
              &{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Cursos
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.3 },
              }}
              viewport={{ once: true }}
              className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Un vistazo a mi trayectoria académica y las certificaciones que
              potencian mis habilidades.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sección Académica */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.4 },
              }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center md:text-left text-foreground">
                Educación Académica
              </h3>
              <div className="space-y-6">
                {education.map((item, index) => (
                  <StudyCard
                    key={item.id}
                    item={item}
                    animationDelay={0.1 * index}
                    isEven={true}
                  />
                ))}
              </div>
            </motion.div>

            {/* Sección Cursos y Certificaciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.5 },
              }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center md:text-left text-foreground">
                Cursos & Certificaciones
              </h3>
              <div className="space-y-6">
                {courses.map((item, index) => (
                  <StudyCard
                    key={item.id}
                    item={item}
                    animationDelay={0.1 * index}
                    isEven={false}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

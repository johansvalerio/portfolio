"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  GraduationCap,
  Code2,
  Heart,
  Coffee,
  Book,
  Users,
  Target,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// --- Datos y Constantes ---
const highlights: string[] = [
  "Experiencia en desarrollo web",
  "3+ proyectos freelance completados",
  "Full-stack developer",
  "Enfocado en React/Next.js",
];

const personalInfo = {
  location: "Costa Rica 🇨🇷",
  experience: "2+ años de experiencia",
  education: "Ingeniería Informática",
  status: "Disponible para nuevos proyectos",
};

const interests = [
  { icon: Code2, label: "Programación", color: "from-blue-500 to-cyan-500" },
  {
    icon: Book,
    label: "Aprendizaje continuo",
    color: "from-emerald-500 to-teal-500",
  },
  { icon: Users, label: "Mentorías", color: "from-purple-500 to-indigo-500" },
  { icon: Coffee, label: "Café y código", color: "from-orange-500 to-red-500" },
];

const achievements = [
  {
    number: "5+",
    label: "Proyectos Completados",
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    number: "2+",
    label: "Años de Experiencia",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    number: "10+",
    label: "Tecnologías Dominadas",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    number: "∞",
    label: "Ganas de Aprender",
    gradient: "from-orange-400 to-red-500",
  },
];

// --- Componente Foto Perfil efectos 3D ---
const ProfileImage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setMousePosition({
      x: (e.clientX - centerX) / 15,
      y: (e.clientY - centerY) / 15,
    });
  };

  return (
    <div className="relative group">
      <motion.div
        ref={imageRef}
        className="relative w-48 h-48 mx-auto"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePosition({ x: 0, y: 0 });
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Anillos animados */}
        <div className="absolute inset-0 rounded-full">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 via-indigo-500/20 to-blue-600/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400/15 via-cyan-500/15 to-emerald-600/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
        {/* Imagen principal */}
        <motion.div
          className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl"
          style={{
            rotateX: mousePosition.y,
            rotateY: mousePosition.x,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          whileHover={{ scale: 1.08 }}
        >
          <img
            src="/img/johans.jpg"
            alt="Foto de Johans Valerio"
            className="w-full h-full object-cover transition-none"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/15 via-transparent to-blue-400/15 opacity-0 group-hover:opacity-70 transition-opacity duration-700" />
        </motion.div>
        {/* Partículas */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + (i % 2) * 80}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.7, 1.1, 0.7],
            }}
            transition={{
              duration: 4 + i * 0.7,
              repeat: Infinity,
              delay: i * 0.7,
            }}
          />
        ))}
        {/* Efecto brillo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/15 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500"
          animate={isHovered ? { rotate: [0, 360] } : {}}
          transition={{ duration: 3, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

// --- Logros animados ---
const AnimatedStats = () => (
  <div className="grid grid-cols-2 gap-4">
    {achievements.map((achievement, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, type: "spring" }}
        whileHover={{ y: -3, scale: 1.03 }}
        className="text-center group cursor-default"
      >
        <div className="relative p-4 rounded-2xl bg-card/40 border border-border/20 backdrop-blur-sm group-hover:border-border/50 transition-all duration-300">
          <motion.div
            className={`text-2xl font-bold bg-gradient-to-r ${achievement.gradient} bg-clip-text text-transparent mb-1`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            {achievement.number}
          </motion.div>
          <div className="text-xs text-muted-foreground font-medium">
            {achievement.label}
          </div>
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${achievement.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-300 -z-10`}
          />
        </div>
      </motion.div>
    ))}
  </div>
);

export default function About() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeInterest, setActiveInterest] = useState<number | null>(null);
  return (
    <section
      id="about"
      className="min-h-screen relative bg-gradient-to-br from-background via-background to-muted/10 dark:from-gray-900 dark:via-black dark:to-gray-900 py-20"
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(#6b7280_1px,transparent_1px)] dark:bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:32px_32px] opacity-15 dark:opacity-8" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/8 to-indigo-500/8 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-blue-400/8 to-cyan-500/8 rounded-lg rotate-45 blur-xl animate-pulse" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20 mb-8"
            >
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Desarrollador Full-Stack
              </span>
              <Zap className="w-4 h-4 text-blue-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-5xl font-bold mb-6"
            >
              Sobre{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                mí
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Conoce más sobre mi trayectoria y pasión por el desarrollo
            </motion.p>
          </div>
          {/* --- Card única, toda la info --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-2 border-border/20 shadow-xl bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 space-y-8">
              {/* Imagen de perfil */}
              <div className="flex justify-center mb-4">
                <ProfileImage />
              </div>
              {/* Info básica rápida */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
                <span className="font-bold text-lg">Johans Valerio</span>
                <span className="text-muted-foreground">
                  Desarrollador Full-Stack
                </span>
                <span className="flex items-center gap-1 text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {personalInfo.status}
                </span>
              </div>
              {/* Badges de info */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-purple-400" />{" "}
                  {personalInfo.location}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-400" />{" "}
                  {personalInfo.experience}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-purple-400" />{" "}
                  {personalInfo.education}
                </Badge>
              </div>
              {/* Especialidades destacadas */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {highlights.map((highlight, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs animate-pulse"
                  >
                    {highlight}
                  </Badge>
                ))}
              </div>
              {/* Descripción */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500/15 to-indigo-500/15 rounded-xl">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Quién Soy</h3>
                </div>
                <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    Soy Johans Valerio, ingeniero informático con una pasión por
                    crear soluciones digitales innovadoras. Mi formación
                    académica me ha dado una base sólida en desarrollo de
                    software, especializado en tecnologías modernas como{" "}
                    <span className="text-blue-400 font-medium">React</span>,{" "}
                    <span className="text-purple-400 font-medium">Next.js</span>
                    ,{" "}
                    <span className="text-indigo-400 font-medium">
                      TypeScript
                    </span>{" "}
                    y{" "}
                    <span className="text-emerald-400 font-medium">
                      PostgreSQL
                    </span>
                    .
                  </p>
                  <p>
                    Siempre busco oportunidades para expandir mis conocimientos
                    y crecer profesionalmente. Fuera del código, disfruto
                    compartir y aprender en comunidad, así como mentorizar y
                    colaborar con otros desarrolladores.
                  </p>
                  <div className="flex items-center gap-2 pt-4">
                    <span className="text-foreground font-medium">
                      ¿Listo para colaborar?
                    </span>
                    <Link href="#contact" className="text-foreground">
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                    </Link>
                  </div>
                </div>
              </section>
              {/* Grid de logros/intereses */}
              <div className="grid md:grid-cols-2 gap-6 w-full">
                {/* Logros */}
                <div className="bg-muted/15 border dark:border-none rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-xl">
                      <Target className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold">Logros</h4>
                  </div>
                  <AnimatedStats />
                </div>
                {/* Intereses */}
                <div className="bg-muted/15 border dark:border-none rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-orange-500/15 to-red-500/15 rounded-xl">
                      <Heart className="w-5 h-5 text-orange-400" />
                    </div>
                    <h4 className="text-lg font-bold">Intereses</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {interests.map((interest, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.7 + index * 0.1,
                          type: "spring",
                        }}
                        whileHover={{ scale: 1.03, y: -1 }}
                        onHoverStart={() => setActiveInterest(index)}
                        onHoverEnd={() => setActiveInterest(null)}
                        className="group cursor-default"
                      >
                        <div className="text-center p-3 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all duration-300 relative overflow-hidden">
                          <div
                            className={`w-8 h-8 mx-auto mb-2 p-1.5 rounded-lg bg-gradient-to-r ${interest.color} bg-opacity-15 transition-all duration-300 group-hover:scale-105`}
                          >
                            <interest.icon className="w-full h-full text-current" />
                          </div>
                          <div className="text-xs font-medium text-center leading-tight">
                            {interest.label}
                          </div>
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${interest.color} opacity-0 group-hover:opacity-8 transition-opacity duration-300 rounded-2xl`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

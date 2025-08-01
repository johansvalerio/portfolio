"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
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
} from "lucide-react";
import { useState, useRef } from "react";

// --- Datos y Constantes (sin cambios, ya están bien definidos) ---
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
  status: "Disponible para proyectos freelance",
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

// --- Componente para la foto con efectos 3D (ajustes sutiles) ---
const ProfileImage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Reducir la intensidad del efecto 3D para mayor sutileza
    setMousePosition({
      x: (e.clientX - centerX) / 15, // Antes /10
      y: (e.clientY - centerY) / 15, // Antes /10
    });
  };

  return (
    <div className="relative group">
      {/* Container principal */}
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
        {/* Anillos animados de fondo (ajustada opacidad y velocidad) */}
        <div className="absolute inset-0 rounded-full">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 via-indigo-500/20 to-blue-600/20" // Opacidad reducida
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }} // Duración aumentada
          />
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400/15 via-cyan-500/15 to-emerald-600/15" // Opacidad reducida
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }} // Duración aumentada
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
          whileHover={{ scale: 1.08 }} // Escala de hover ligeramente reducida
        >
          <img
            src="/img/johans.jpg"
            alt="Foto de Johans Valerio"
            className="w-full h-full object-cover transition-none"
          />
          {/* Overlay con gradiente (opacidad y transición más suaves) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/15 via-transparent to-blue-400/15 opacity-0 group-hover:opacity-70 transition-opacity duration-700" />{" "}
          {/* Opacidad y duración ajustadas */}
        </motion.div>

        {/* Partículas flotantes (opacidad y tamaño más sutiles) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full" // Tamaño reducido
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + (i % 2) * 80}%`,
            }}
            animate={{
              y: [0, -15, 0], // Movimiento ligeramente reducido
              opacity: [0.2, 0.8, 0.2], // Opacidad más sutil
              scale: [0.7, 1.1, 0.7], // Escala más sutil
            }}
            transition={{
              duration: 4 + i * 0.7, // Duración aumentada
              repeat: Infinity,
              delay: i * 0.7, // Retraso ajustado
            }}
          />
        ))}

        {/* Efecto de brillo (transición más suave) */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/15 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500" // Opacidad y duración ajustadas
          animate={isHovered ? { rotate: [0, 360] } : {}}
          transition={{ duration: 3, ease: "linear" }} // Duración aumentada
        />
      </motion.div>
    </div>
  );
};

// --- Componente para estadísticas animadas (ajustes sutiles) ---
const AnimatedStats = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {achievements.map((achievement, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, type: "spring" }}
          whileHover={{ y: -3, scale: 1.03 }} // Movimiento y escala de hover más sutiles
          className="text-center group cursor-default"
        >
          <div className="relative p-4 rounded-2xl bg-card/40 border border-border/20 backdrop-blur-sm group-hover:border-border/50 transition-all duration-300">
            {" "}
            {/* Opacidad de fondo y borde ajustadas */}
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
            {/* Efecto de brillo en hover (opacidad reducida) */}
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${achievement.gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-300 -z-10`}
            />{" "}
            {/* Opacidad reducida */}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Componente Principal About (ajustes sutiles) ---
export default function About() {
  const [activeInterest, setActiveInterest] = useState<number | null>(null);

  return (
    <section
      id="about"
      className="min-h-screen relative bg-gradient-to-br from-background via-background to-muted/10 dark:from-gray-900 dark:via-black dark:to-gray-900 py-20" // Gradiente de fondo más sutil
    >
      {/* Efectos de fondo (opacidad reducida) */}
      <div className="absolute inset-0 bg-[radial-gradient(#6b7280_1px,transparent_1px)] dark:bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:32px_32px] opacity-15 dark:opacity-8" />{" "}
      {/* Opacidad reducida */}
      {/* Formas geométricas flotantes (opacidad y blur más sutiles) */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/8 to-indigo-500/8 rounded-full blur-2xl animate-pulse" />{" "}
      {/* Opacidad y blur ajustados */}
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-blue-400/8 to-cyan-500/8 rounded-lg rotate-45 blur-xl animate-pulse" />{" "}
      {/* Opacidad y blur ajustados */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
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
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 mb-12">
            {/* Profile Card - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-5"
            >
              <Card className="relative border-2 border-border/20 shadow-xl bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl overflow-hidden h-full">
                {" "}
                {/* Borde y opacidad de fondo ajustados */}
                <CardContent className="p-8">
                  {/* Profile Image */}
                  <ProfileImage />
                  {/* Name and Title */}
                  <div className="text-center mt-6 mb-6">
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="text-2xl font-bold mb-2"
                    >
                      Johans Valerio
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="text-lg text-muted-foreground mb-4"
                    >
                      Full-Stack Developer & Software Engineer
                    </motion.p>
                    {/* Status Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7, type: "spring" }}
                    >
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-4 py-2 text-sm">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        {personalInfo.status}
                      </Badge>
                    </motion.div>
                  </div>
                  {/* Personal Info */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: MapPin, text: personalInfo.location },
                      { icon: Calendar, text: personalInfo.experience },
                      { icon: GraduationCap, text: personalInfo.education },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <item.icon className="w-4 h-4 text-purple-400" />
                        {item.text}
                      </motion.div>
                    ))}
                  </div>
                  {/* Highlights */}
                  <div className="mb-6">
                    <motion.h4
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9 }}
                      className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider"
                    >
                      Especialidades
                    </motion.h4>
                    <div className="flex flex-wrap gap-2">
                      {highlights.map((highlight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 1 + index * 0.1,
                            type: "spring",
                          }}
                          whileHover={{ scale: 1.03 }}
                        >
                          {" "}
                          {/* Escala de hover más sutil */}
                          <Badge
                            variant="secondary"
                            className="text-xs animate-pulse"
                          >
                            {highlight}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {/* Download CV Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.3 }}
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar CV
                    </Button>
                  </motion.div>
                </CardContent>
                {/* Floating Elements (opacidad y blur más sutiles) */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-400/15 via-indigo-500/15 to-blue-600/15 rounded-full blur-3xl" />{" "}
                {/* Opacidad ajustada */}
              </Card>
            </motion.div>
            {/* Content Cards - Right Side */}
            <div className="lg:col-span-7 space-y-6">
              {/* About Text Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-2 border-border/20 shadow-xl bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl">
                  {" "}
                  {/* Borde y opacidad de fondo ajustados */}
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-purple-500/15 to-indigo-500/15 rounded-xl">
                        {" "}
                        {/* Opacidad de fondo ajustada */}
                        <Sparkles className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-bold">Mi Historia</h3>
                    </div>
                    <div className="space-y-4 text-lg leading-relaxed">
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        Soy Johans Valerio, ingeniero informático con una pasión
                        por crear soluciones digitales innovadoras. Mi formación
                        académica me ha proporcionado una base sólida en
                        desarrollo de software, especializándome en tecnologías
                        modernas como React, Next.js, TypeScript y PostgreSQL.
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="text-muted-foreground"
                      >
                        Con un enfoque en el desarrollo full-stack, busco
                        constantemente oportunidades para expandir mis
                        conocimientos y crecer profesionalmente en el ámbito
                        tecnológico. Cuando no estoy programando, me gusta
                        mantenerme actualizado con las últimas tendencias en
                        tecnología, impartir mentorías a jóvenes programadores y
                        compartir conocimientos con la comunidad.
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Stats and Interests Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="border-2 border-border/20 shadow-xl bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl h-full">
                    {" "}
                    {/* Borde y opacidad de fondo ajustados */}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-xl">
                          {" "}
                          {/* Opacidad de fondo ajustada */}
                          <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="text-lg font-bold">Logros</h4>
                      </div>
                      <AnimatedStats />
                    </CardContent>
                  </Card>
                </motion.div>
                {/* Interests Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card className="border-2 border-border/20 shadow-xl bg-card/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl h-full">
                    {" "}
                    {/* Borde y opacidad de fondo ajustados */}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-orange-500/15 to-red-500/15 rounded-xl">
                          {" "}
                          {/* Opacidad de fondo ajustada */}
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
                              {" "}
                              {/* Opacidad de fondo y hover ajustadas */}
                              <div
                                className={`w-8 h-8 mx-auto mb-2 p-1.5 rounded-lg bg-gradient-to-r ${interest.color} bg-opacity-15 transition-all duration-300 group-hover:scale-105`}
                              >
                                {" "}
                                {/* Opacidad y escala de hover ajustadas */}
                                <interest.icon className="w-full h-full text-current" />
                              </div>
                              <div className="text-xs font-medium text-center leading-tight">
                                {interest.label}
                              </div>
                              {/* Efecto de brillo en hover (opacidad reducida) */}
                              <div
                                className={`absolute inset-0 bg-gradient-to-r ${interest.color} opacity-0 group-hover:opacity-8 transition-opacity duration-300 rounded-2xl`}
                              />{" "}
                              {/* Opacidad reducida */}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

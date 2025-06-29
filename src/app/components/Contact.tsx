"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import GoogleIcon from "../svg/GoogleIcon";
import { createContact } from "@/app/actions/contact/contact-actions";
import PedingButton from "./PedingButton";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}

const contactInfo: ContactInfo[] = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: "Email",
    value: "johans.valerio@hotmail.com",
    href: "mailto:johans.valerio@hotmail.com",
  },
  {
    icon: <MessageCircle className="h-6 w-6 text-primary" />,
    title: "Whatsapp",
    value: "+506 7236 7648",
    href: "https://wa.me/50672367648",
  },
  {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: "Ubicación",
    value: "Guanacaste, Costa Rica",
    href: "#contact",
  },
];

interface FormState {
  error?: string;
  success?: string;
}

export default function Contact() {
  const { data: session } = useSession();
  const name = session?.user?.name || "";
  const email = session?.user?.email || "";

  const initialState: FormState = {};
  const [state, formAction] = useActionState<FormState, FormData>(
    createContact,
    initialState
  );

  // useEffect para mostrar los mensajes de error y éxito
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success(state.success);
      // confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [state]); // Solo se ejecutará cuando state cambie

  // Mostrar toast cuando el usuario inicia sesión
  useEffect(() => {
    // Mostrar mensaje de bienvenida si es necesario
    if (session && !localStorage.getItem("welcomeShown")) {
      toast(`¡Bienvenido de vuelta, ${session?.user?.name || "usuario"}!`, {
        icon: "👋",
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "full",
        },
      });
      localStorage.setItem("welcomeShown", "true");
    }
  }, [session]);

  const handleGoogleSignIn = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = "contact";
    signIn("google", { redirect: false, callbackUrl: currentUrl.toString() });
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
          }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="flex flex-col items-center text-center mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.1 },
              }}
              viewport={{ once: true }}
            >
              Hablemos de tu{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                proyecto
              </span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
              viewport={{ once: true }}
            >
              ¿Tienes una idea? Me encantaría escucharla y ayudarte a hacerla
              realidad
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.2 },
                }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-6">
                  Información de contacto
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 group"
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
                      whileHover={{ x: 5 }}
                    >
                      <motion.div className="flex-shrink-0 group-hover:scale-[1.1] transition-all">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          {info.icon}
                        </div>
                      </motion.div>
                      <div>
                        <p className="font-medium">{info.title}</p>
                        <a
                          href={info.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.4 },
                }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-blue-600/5 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle>¿Listo para empezar?</CardTitle>
                    <CardDescription>
                      Estoy disponible para proyectos freelance y oportunidades
                      de trabajo remoto.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full group relative overflow-hidden"
                      size="lg"
                      asChild
                    >
                      <a href="mailto:johans.valerio@hotmail.com">
                        <motion.span
                          className="relative z-10 flex items-center justify-center gap-2"
                          whileHover={{ color: "#fff" }}
                        >
                          <Mail className="h-4 w-4" />
                          Enviar mensaje directo
                        </motion.span>
                        <motion.span
                          className="absolute inset-0 bg-primary/90 rounded-md z-0"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Form */}

            <div
              className={`relative group ${!session ? "hover:p-4 hover:translate-y-[-10px] hover:rounded-lg hover:shadow-xl" : ""} transition-all duration-300 overflow-hidden`}
            >
              {/* Fondo con blur al hacer hover */}
              {!session && (
                <div className="absolute inset-0 rounded-lg backdrop-blur-none group-hover:backdrop-blur-sm transition-all duration-300 z-20" />
              )}

              {/* Botón de Google que aparece en hover - Solo visible sin sesión */}
              {!session && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="gap-2 px-6 py-6 text-base cursor-pointer flex items-center hover:scale-105 transition-all duration-300"
                  >
                    <GoogleIcon />
                    Iniciar con Google
                  </Button>
                </motion.div>
              )}

              <form action={formAction}>
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.3 },
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3, delay: 0.4 },
                    }}
                    viewport={{ once: true }}
                  >
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      name="name"
                      id="name"
                      placeholder="Tu nombre"
                      className="h-12"
                      disabled
                      defaultValue={session ? name : ""}
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3, delay: 0.5 },
                    }}
                    viewport={{ once: true }}
                  >
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      name="email"
                      id="email"
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      className="h-12"
                      disabled
                      defaultValue={session ? email : ""}
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3, delay: 0.6 },
                    }}
                    viewport={{ once: true }}
                  >
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      name="message"
                      required
                      id="message"
                      placeholder="Cuéntame sobre tu proyecto..."
                      className="min-h-[150px]"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3, delay: 0.7 },
                    }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="relative z-10 flex items-center justify-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.3, delay: 0.8 },
                      }}
                      viewport={{ once: true }}
                    >
                      <PedingButton />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

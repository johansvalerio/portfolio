"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
export default function WelcomeToast() {
    // Obtener la sesión del usuario
    const { data: session } = useSession();
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
    return null
}
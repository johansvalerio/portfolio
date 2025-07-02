"use client"
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import GoogleIcon from "../svg/GoogleIcon";


export default function GoogleButton() {
    const handleGoogleSignIn = () => {
        // Si estamos en la página de contacto, redirigir a /#contact después de login
        const isContactPage = window.location.pathname === "/";
        const callbackUrl = isContactPage ? "/#contact" : window.location.href;
        signIn("google", { redirect: false, callbackUrl });
    };

    return (
        <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="gap-2 px-6 py-6 text-base cursor-pointer flex items-center hover:scale-105 transition-all duration-300"
        >
            <GoogleIcon className="h-5 w-5 mr-2" />
            Iniciar sesión con Google
        </Button>
    );
}
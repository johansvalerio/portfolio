import GoogleIcon from "../svg/GoogleIcon";
import { signIn } from "next-auth/react";

const handleGoogleSignIn = async () => {
  try {
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: window.location.href,
    });
    // Si hay un error, mostrarlo en consola
    if (result?.error) {
      console.error("Error al iniciar sesión:", result.error);
    }
  } catch (error) {
    console.error("Error inesperado:", error);
  }
};

export default function GoogleSpan() {
  return (
    <a
      onClick={handleGoogleSignIn}
      className="flex py-2 px-3 items-center text-muted-foreground cursor-pointer hover:scale-105 hover:text-foreground  duration-200 transform transition-all"
    >
      <GoogleIcon className="h-4 w-4 mr-2" />
      Iniciar sesión
    </a>
  );
}

import GoogleIcon from "../svg/GoogleIcon";
import { signIn } from "next-auth/react";

const handleGoogleSignIn = () => {
    const callbackUrl = window.location.href;
    signIn("google", { redirect: false, callbackUrl });
};

export default function GoogleSpan() {
    return <a
        onClick={handleGoogleSignIn}
        className="flex py-2 px-3 items-center text-muted-foreground cursor-pointer hover:scale-105 hover:text-foreground  duration-200 transform transition-all"
    >
        <GoogleIcon className="h-4 w-4 mr-2" />
        Iniciar sesión
    </a>
}
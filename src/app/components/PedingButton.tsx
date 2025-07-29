"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Loading from "../misIdeas/components/Loading";

// Componente para el botón de submit
export default function PedingButton({ children }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full group relative overflow-hidden cursor-pointer flex items-center "
      size="default"
    >
      {pending ? (
        <Loading text="Enviando..." />
      ) : (
        <span className="flex items-center">
          <Send className="h-4 w-4 mr-2" />
          {children}
        </span>
      )}
    </Button>
  );
}

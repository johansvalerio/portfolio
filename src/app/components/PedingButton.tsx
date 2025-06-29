"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Componente para el botón de submit
export default function PedingButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full group relative overflow-hidden cursor-pointer"
      size="lg"
    >
      {pending ? (
        "Enviando..."
      ) : (
        <span className="flex items-center">
          <Send className="h-4 w-4 mr-2" />
          Enviar mi idea
        </span>
      )}
    </Button>
  );
}

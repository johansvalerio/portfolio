import { z } from "zod";

export const createMessageSchema = z.object({
    title: z.string()
    .min(1, "El título es requerido")
    .max(50, "El título debe tener menos de 50 caracteres"),
    message: z
    .string()
    .min(1, "El mensaje es requerido")
    .max(200, "El mensaje debe tener menos de 200 caracteres"),
});

export type CreateMessageSchema = z.infer<typeof createMessageSchema>;

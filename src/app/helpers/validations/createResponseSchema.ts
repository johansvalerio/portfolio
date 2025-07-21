import { z } from "zod";

export const createResponseSchema = z.object({
    mensajeId: z.coerce.number(),
    response: z
    .string()
    .min(1, "El mensaje es requerido")
    .max(200, "El mensaje debe tener menos de 200 caracteres"),
})

export type CreateResponseSchema = z.infer<typeof createResponseSchema>

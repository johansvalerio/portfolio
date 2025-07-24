import { z } from "zod";


//sirve tanto para readMessage como para patchMessageStatus
export const patchMessageStatusSchema = z.object({
    mensajeId: z.coerce.number(),
    responseIds: z.array(z.coerce.number()).optional(),
})

export type PatchMessageStatusSchema = z.infer<typeof patchMessageStatusSchema>

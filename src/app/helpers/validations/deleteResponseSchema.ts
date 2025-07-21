import { z } from "zod";

export const deleteResponseSchema = z.object({
    responseId: z.coerce.number()
  });

export type DeleteResponseSchema = z.infer<typeof deleteResponseSchema>



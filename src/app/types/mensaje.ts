import { type Mensaje, User, Response } from "@prisma/client";

export interface MensajeWithUser extends Mensaje {
    user?: User | null;
    response?: Response[];
}
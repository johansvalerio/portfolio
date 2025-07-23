import { Response, User, Mensaje } from "@prisma/client";

export interface ResponseWithUser extends Response {
    user?: User | null;
    mensaje?: Mensaje | null;
}
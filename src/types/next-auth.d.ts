import { DefaultSession } from "next-auth";
import "next-auth/jwt";
import "next-auth";

declare module 'next-auth' {
  interface User {
    id: string;
    role?: number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role?: number;
    } & DefaultSession["user"];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;  // Hacerlo requerido ya que siempre lo usas
    role?: number;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}
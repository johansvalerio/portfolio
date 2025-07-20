import NextAuth, { DefaultSession } from "next-auth";
import "next-auth";
import "next-auth/jwt"

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
    id: string;
    role?: number;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}
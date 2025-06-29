import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User {
        id: string;
        role?: number;
    }

    interface Session {
        user: User & DefaultSession["user"];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub?: string; // sub is type string | undefined
        role?: number; // role is type number | undefined
    }
}
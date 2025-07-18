import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// @ts-expect-error - This is a workaround for Next.js 15
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


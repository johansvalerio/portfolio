import type { NextAuthOptions, Account, Profile, User } from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import {db} from '@/lib/db';
import {AdapterUser} from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: { user: User | AdapterUser, account: Account | null, profile?: Profile }) {
            try{
            if (account?.provider === "google") {
                console.log(profile)
                const userFound = await db.user.findUnique({
                    where: { user_email: user.email! },
                });

                if (!userFound) {
                    const newUser = await db.user.create({
                        data: {
                            user_name: user.name!,
                            user_email: user.email!,
                            user_image: user.image,
                            user_provider: account.provider,
                        },
                    });
                    console.log("Nuevo usuario creado:", newUser);
                    user.id = newUser.user_id.toString()
                } else {
                    user.id = userFound.user_id.toString()
                }
            }
            return true;
        }catch(error){
            console.log(error)
            return false
        }
    },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (session?.user) {
                session.user.id = token.sub as string;
                session.user.role = token.role as number;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT, user?: Session["user"] }) {
            if (token.email) {
                const dbUser = await db.user.findUnique({
                    where: { user_email: token.email },
                    include: { role: true }
                });

                if (dbUser) {
                    return {
                        ...token,
                        sub: dbUser.user_id.toString(),
                        role: dbUser.role?.role_id,
                        name: dbUser.user_name,
                        email: dbUser.user_email,
                        picture: dbUser.user_image
                    };
                }
            }
            // si el usuario no existe en la base de datos
            if (user) {
                token.sub = user.id;
            }
            
            return token;
        },
    },
    pages: {
        signIn: '/',
    },
    session: {
        strategy: 'jwt',
    }
};
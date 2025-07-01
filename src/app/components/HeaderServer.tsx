// src/app/components/HeaderServer.tsx
import authSession from "../providers/auth-session";
import Header from "./Header";

export default async function HeaderServer() {
    const session = await authSession();
    return <Header session={session} />;
}
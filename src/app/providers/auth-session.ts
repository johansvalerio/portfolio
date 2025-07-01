import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';

export default async function authSession() {
    const session: Session | null = await getServerSession(authOptions);

    return session
}
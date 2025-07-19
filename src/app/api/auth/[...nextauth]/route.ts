import { authOptions } from '@/lib/authOptions';
import NextAuth from 'next-auth';

const handler = async (req: Request, res: Response) => {
  // @ts-expect-error - This is a workaround for Next.js 15
  return await NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };
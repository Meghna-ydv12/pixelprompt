import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "recruiter@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "123" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // Find or create the user instantly for the demo
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split("@")[0],
              credits: 10,
            }
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Fetch fresh credits
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { credits: true }
        });
        
        session.user.id = token.sub;
        session.user.credits = dbUser?.credits || 0;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };

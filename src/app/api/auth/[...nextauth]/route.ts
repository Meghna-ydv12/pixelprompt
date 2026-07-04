import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password", placeholder: "********" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        return {
          id: credentials.email, // use email as ID
          email: credentials.email,
          name: credentials.email.split("@")[0],
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).credits = 10; // Mock 10 credits
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };

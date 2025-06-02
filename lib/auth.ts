// lib/auth.ts
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Dummy auth logic (replace with real user lookup)
                return { id: "1", email: credentials.email };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

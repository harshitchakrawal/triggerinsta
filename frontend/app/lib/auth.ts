import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { callBackend } from "@/app/lib/backendServer";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  trustHost: true,
  cookies: {
    pkceCodeVerifier: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.pkce.code_verifier" : "next-auth.pkce.code_verifier",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
    state: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.state" : "next-auth.state",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ["state"],
    }),
    Credentials({
      id: "instagram",
      name: "Instagram",
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Name", type: "text" },
        image: { label: "Image", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const res = await callBackend("/internal/users/upsert", {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email,
            name: (credentials.name as string) || null,
            image: (credentials.image as string) || null,
          }),
        });
        if (!res.ok) return null;
        const user = await res.json();
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await callBackend("/internal/users/upsert", {
            method: "POST",
            body: JSON.stringify({ email: user.email, name: user.name, image: user.image }),
          });
        } catch (err) {
          console.error("[auth] signIn error:", err);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});

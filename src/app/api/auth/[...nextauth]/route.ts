// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth"; // Import NextAuth for handling authentication
import GoogleProvider from "next-auth/providers/google"; // Import Google provider for OAuth login
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Import Prisma adapter to integrate with Prisma
import { PrismaClient } from "@prisma/client"; // Prisma client for interacting with the database
import CredentialsProvider from "next-auth/providers/credentials"; // Import Credentials provider for custom email/password login
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

// Initialize PrismaClient to interact with the database
const prisma = new PrismaClient();

// Define NextAuth options with TypeScript
export const authOptions: NextAuthOptions = {  // Export authOptions
  providers: [
    CredentialsProvider({
      name: "Credentials", // Name of the custom provider
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" }, // Set session strategy to JWT
  adapter: PrismaAdapter(prisma), // Use Prisma adapter for session and database handling
  secret: process.env.NEXTAUTH_SECRET!, // Set the secret for encryption
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user?.email) {
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create a new user logic
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to JWT token
        token.email = user.email; // Add user email to JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = { ...session.user, id: token.id, email: token.email }; // Add token info to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    error: "/auth/error",   // Custom error page
  },
};

// Initialize NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // Export the handler for GET and POST requests

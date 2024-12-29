import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Use bcryptjs for compatibility with Next.js

// Initialize PrismaClient for database interaction
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the JSON request body
    const { email, password, name, roleId }: { email: string; password: string; name: string; roleId?: number } = await req.json();

    // Validate required fields
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ message: "Email, password, and name are required" }),
        { status: 400 }
      );
    }

    // Optional: Validate roleId if it's provided
    if (roleId) {
      const roleExists = await prisma.role.findUnique({ where: { id: roleId } });
      if (!roleExists) {
        return new Response(
          JSON.stringify({ message: "Invalid role ID" }),
          { status: 400 }
        );
      }
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database with the provided roleId (if any)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId, // Include roleId only if it is passed in the request
      },
    });

    console.log("User created:", user);

    // Return the created user (excluding sensitive fields like password)
    return new Response(
      JSON.stringify({ id: user.id, name: user.name, email: user.email }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);

    // Generic error response to avoid leaking sensitive information
    return new Response(
      JSON.stringify({ message: "Error registering user" }),
      { status: 500 }
    );
  }
}

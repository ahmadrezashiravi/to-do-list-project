import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize PrismaClient
const prisma = new PrismaClient();

interface DecodedToken {
  email: string;
  iat: number;
  exp: number;
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { token, password }: { token: string; password: string } = await req.json();

    // Validate the token
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded.email) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const user = await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    // Return a success message
    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);

    // Return an error response for invalid or expired token
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }
}

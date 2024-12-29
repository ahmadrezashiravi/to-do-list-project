import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize PrismaClient for database interactions
const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Parse the JSON body of the request
  const { email }: { email: string } = await req.json();

  // Check if the user exists in the database
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Ensure JWT_SECRET is defined in environment variables
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  // Generate a JWT token for password reset with a 1-hour expiration
  const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Construct the password reset link using the BASE_URL environment variable
  const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`;

  // Configure the Nodemailer transporter for sending emails
  const transporter = nodemailer.createTransport({
    host: "smtp.shiravi.ir",
    port: 587, // SMTP port for insecure connection
    secure: false, // Use STARTTLS for encryption
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
    auth: {
      user: process.env.EMAIL_USER, // Email address from environment variables
      pass: process.env.EMAIL_PASS, // Email password from environment variables
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email address
    to: email, // Recipient email address
    subject: "Password Reset Request", // Email subject
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
  };

  try {
    // Attempt to send the email with the reset link
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Reset link sent" });
  } catch (error) {
    // Handle errors during the email sending process
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending reset link" }, { status: 500 });
  }
}

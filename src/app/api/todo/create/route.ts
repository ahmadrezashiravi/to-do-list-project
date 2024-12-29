// src/app/api/todo/create/route.ts
import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest and NextResponse for handling API requests
import { PrismaClient } from '@prisma/client'; // Import PrismaClient to interact with the database
import { getServerSession } from 'next-auth'; // Import getServerSession from NextAuth to get the current session
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import NextAuth settings

const prisma = new PrismaClient(); // Initialize PrismaClient to interact with the database

// Define the POST function to handle creating a new todo
export async function POST(req: NextRequest) {
  
  console.log("sss"); // Log "sss" to check the flow of execution
  const session = await getServerSession(authOptions); // Get the session to check if the user is authenticated
  console.log(session); // Log the session data

  try {
    let userId = ""; // Initialize userId as an empty string
    if (session?.user) {
      userId = session.user?.id; // If the session has a user, set the userId from the session
    }
    const { title } = await req.json(); // Extract title from the request body

    // Check if title or userId are missing
    if (!title || !userId) {
      return NextResponse.json({ error: 'Title and userId are required' }, { status: 400 });
    }

    // Validate userId to ensure it is a non-empty string
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json({ error: 'User ID is required and should be a valid string' }, { status: 400 });
    }

    // Check if the user exists in the database
    const userExists = await prisma.user.findUnique({
      where: { id: userId }, // Check if the userId exists in the database
    });

    // If the user does not exist, return an error
    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    console.log("Data", userExists, "title:", title, "userID:", userId); // Log the user data and todo details for confirmation

    // Create a new todo record in the database
    const newTodo = await prisma.todo.create({
      data: {
        title,
        userId,
      },
    });

    // Return the newly created todo as a response
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error); // Log any errors during the process
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 }); // Return an error response
  }
}

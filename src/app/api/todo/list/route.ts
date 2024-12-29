// src/app/api/todo/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch all todos along with user information from the database
    const todos = await prisma.todo.findMany({
      include: {
        user: true, // Include user information for each todo
      },
    });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

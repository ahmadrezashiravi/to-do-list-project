// src/app/api/todo/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const { id, title } = await req.json();  // دریافت شناسه و عنوان جدید از بدنه درخواست

    if (!id || !title.trim()) {
      return NextResponse.json({ error: 'Todo ID and title are required' }, { status: 400 });
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

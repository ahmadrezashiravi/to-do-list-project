// src/app/api/todo/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json(); // دریافت شناسه Todo از بدنه درخواست

    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }

    const todo = await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Todo deleted successfully', todo }, { status: 200 });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}

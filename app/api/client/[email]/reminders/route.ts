// route.ts for /api/client/[email]/reminders
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const { email, message, note, dueDate } = await req.json();

    if (!email || !message || !dueDate) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const reminder = await prisma.reminder.create({
        data: {
            message,
            note,
            dueDate: new Date(dueDate),
            client: { connect: { email } },
        },
    });

    return NextResponse.json(reminder);
}

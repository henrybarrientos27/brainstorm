// route.ts for /api/client/[email]/notifications
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const { email, content, type } = await req.json();

    if (!email || !content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const notification = await prisma.notification.create({
        data: {
            content,
            type,
            client: { connect: { email } },
        },
    });

    return NextResponse.json(notification);
}


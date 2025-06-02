// route.ts for /api/client/[email]/audit-log
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const { email, action, metadata } = await req.json();

    if (!email || !action) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const log = await prisma.auditLog.create({
        data: {
            action,
            metadata,
            client: { connect: { email } },
        },
    });

    return NextResponse.json(log);
}

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const logs = await prisma.auditLog.findMany({
        where: { client: { email } },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(logs);
}
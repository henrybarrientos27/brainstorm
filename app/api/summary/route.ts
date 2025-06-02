// Example route: Summary
// File: /app/api/client/[email]/summary/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    _req: Request,
    { params }: { params: { email: string } }
) {
    const email = decodeURIComponent(params.email);

    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: { summaries: true },
        });

        if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

        return NextResponse.json(client.summaries);
    } catch (error) {
        console.error('[SUMMARY_ROUTE_ERROR]', error);
        return NextResponse.json({ error: 'Failed to fetch summaries' }, { status: 500 });
    }
}
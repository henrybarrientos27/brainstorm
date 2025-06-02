// app/api/client/[email]/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/client/[email]/history?email=...
export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    const email: string = emailParam || "";
    const body = await req.json();
    const { type, description } = body;

    if (!type || !description) {
        return NextResponse.json({ error: "Missing type or description" }, { status: 400 });
    }

    try {
        const client = await prisma.client.findUnique({ where: { email } });
        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const log = await prisma.history.create({
            data: {
                type,
                description,
                client: { connect: { email } },
            },
        });

        return NextResponse.json(log);
    } catch (err) {
        console.error("[HISTORY POST ERROR]", err);
        return NextResponse.json({ error: "Failed to create history log" }, { status: 500 });
    }
}

// GET /api/client/[email]/history?email=...
export async function GET(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    const email: string = emailParam || "";

    try {
        const logs = await prisma.history.findMany({
            where: { client: { email } },
            orderBy: [{ createdAt: 'desc' }],
        });

        return NextResponse.json(logs);
    } catch (err) {
        console.error("[HISTORY GET ERROR]", err);
        return NextResponse.json({ error: "Failed to fetch history logs" }, { status: 500 });
    }
}

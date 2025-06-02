// File: app/api/client/[email]/timeline/route.ts
// Prompt: Log a timeline event with a title and message to track client history.
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam;

    try {
        const { title, message } = await req.json();

        const client = await prisma.client.findUnique({ where: { email } });
        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const timelineEvent = await prisma.timelineEvent.create({
            data: {
                title,
                message,
                timestamp: new Date(),
                client: { connect: { email } },
            },
        });

        return NextResponse.json(timelineEvent);
    } catch (error) {
        console.error("Timeline route error:", error);
        return NextResponse.json({ error: "Failed to log timeline event" }, { status: 500 });
    }
}

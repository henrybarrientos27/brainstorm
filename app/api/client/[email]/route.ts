// Example: Fixing API route with correct search param handling

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email = decodeURIComponent(emailParam);

    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: {
                summaries: true,
                insights: true,
                coachingPrompts: true,
                timelineEvents: true,
                forms: true,
                feedback: true,
                preferences: true,
                meetings: true,
                notifications: true,
                reminders: true,
                progress: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error("Error fetching client data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

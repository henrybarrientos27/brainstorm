// File: app/api/client/[email]/history/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { email: string } }
) {
    const email = decodeURIComponent(params.email);
    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: { summaries: true },
        });

        if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

        // Simulated Redtail & Email Data (mocked)
        const redtailNotes = [
            "Client is conservative and prefers low risk.",
            "Recently changed job and updated income.",
            "Family history of charitable giving."
        ];

        const emails = [
            "Can you remind me what we discussed about college planning?",
            "We want to make sure our estate plan reflects the second home."
        ];

        const pastSummaries = client.summaries.map((s) => s.content);

        const historicalContext = [
            ...redtailNotes,
            ...emails,
            ...pastSummaries
        ];

        return NextResponse.json({ context: historicalContext });
    } catch (error) {
        return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
    }
}
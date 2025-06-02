// File: app/api/client/[email]/feedback/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam || "";

    try {
        const { message } = await req.json();

        const client = await prisma.client.findUnique({
            where: { email },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const feedback = await prisma.feedback.create({
            data: {
                message,
                client: { connect: { email } },
            },
        });

        await prisma.activity.create({
            data: {
                type: "Feedback",
                details: "Feedback submitted by advisor.",
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true, feedback });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return NextResponse.json(
            { error: "Failed to submit feedback" },
            { status: 500 }
        );
    }
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { summaryId, rating, notes } = await req.json();

        if (!summaryId || !rating) {
            return NextResponse.json(
                { error: "Missing summaryId or rating" },
                { status: 400 }
            );
        }

        const summary = await prisma.summary.findUnique({
            where: { id: summaryId },
        });

        if (!summary) {
            return NextResponse.json(
                { error: "Summary not found" },
                { status: 404 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                summaryId,
                rating,
                notes,
            },
        });

        return NextResponse.json({ message: "Feedback saved", feedback });
    } catch (err) {
        console.error("Feedback API error:", err);
        return NextResponse.json(
            { error: "Failed to submit feedback" },
            { status: 500 }
        );
    }
}

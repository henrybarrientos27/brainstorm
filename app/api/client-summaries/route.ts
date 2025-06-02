
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ✅ CORRECT

export async function GET() {
    try {
        const summaries = await prisma.summary.findMany({
            include: {
                client: true, // include the client info so we can match by email
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ summaries });
    } catch (err) {
        console.error("Error fetching summaries:", err);
        return NextResponse.json({ error: "Failed to load summaries" }, { status: 500 });
    }
}

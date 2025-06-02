import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// Trust Score
export async function GET_trust(_: Request, context: { params: { email: string } }) {
    const email = decodeURIComponent(context.params.email);
    try {
        const client = await prisma.client.findUnique({
            where: { email },
            select: { trustScores: { orderBy: { createdAt: "desc" }, take: 1 } }
        });
        const score = client?.trustScores[0]?.score ?? null;
        return NextResponse.json({ score });
    } catch (err) {
        console.error("/trust-score error:", err);
        return NextResponse.json({ error: "Failed to fetch trust score" }, { status: 500 });
    }
}
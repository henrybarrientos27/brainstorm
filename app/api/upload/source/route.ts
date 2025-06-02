import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ✅ CORRECT


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { transcript, clientEmail, source } = body;

        console.log("Incoming upload from source:", source);
        console.log("Target client email:", clientEmail);

        if (!transcript || !clientEmail || !source) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await prisma.client.findUnique({
            where: { email: clientEmail }
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const newSummary = await prisma.summary.create({
            data: {
                content: transcript,
                clientId: client.id,
                source
            }
        });

        return NextResponse.json({
            success: true,
            summaryId: newSummary.id
        });
    } catch (error) {
        console.error("Upload source route error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

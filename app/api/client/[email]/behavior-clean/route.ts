// File: app/api/client/[email]/behavior-clean/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam || "";

    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: { insights: true },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        // Delete all insights for the client
        await prisma.insight.deleteMany({
            where: { clientId: client.id },
        });

        // Log the cleanup in activity
        await prisma.activity.create({
            data: {
                type: "Cleanup",
                details: "All behavioral insights were cleared.",
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error cleaning behavior insights:", error);
        return NextResponse.json(
            { error: "Failed to clean behavior insights" },
            { status: 500 }
        );
    }
}

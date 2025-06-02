// app/api/client/[email]/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) return NextResponse.json({ error: "Missing email" }, { status: 400 });
    const email: string = emailParam;

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const summaries = await prisma.summary.findMany({ where: { clientId: client.id } });
    const insights = await prisma.insight.findMany({ where: { clientId: client.id } });
    const goals = await prisma.goal.findMany({ where: { clientId: client.id } });
    const forms = await prisma.form.findMany({ where: { clientId: client.id } });
    const timeline = await prisma.timelineEvent.findMany({ where: { clientId: client.id } });

    return NextResponse.json({
        client,
        summaries,
        insights,
        goals,
        forms,
        timeline,
    });
}

// app/api/client/[email]/trends/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) return NextResponse.json({ error: "Missing email" }, { status: 400 });
    const email: string = emailParam;

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const insights = await prisma.insight.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: "desc" },
        take: 25
    });

    const recentInsights = insights.map(i => `- ${i.content}`).join("\n");
    const prompt = `Based on the following client insights, identify emerging behavioral or financial trends. Describe these trends clearly and explain how they might affect future planning. Tone should be analytical and consistent:\n\n${recentInsights}`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are an AI financial trend analyst helping identify patterns in client behavior." },
            { role: "user", content: prompt }
        ]
    });

    const content = response.choices[0].message.content || "";

    const trend = await prisma.trend.create({
        data: {
            clientId: client.id,
            content
        }
    });

    return NextResponse.json({ trend });
}

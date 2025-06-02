// app/api/client/[email]/patterns/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) return NextResponse.json({ error: "Missing email" }, { status: 400 });
    const email: string = emailParam;

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const history = await prisma.history.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: "desc" },
    });

    const content = history.map(entry => `${entry.action}: ${JSON.stringify(entry.metadata)}`).join("\n");
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You're an assistant that analyzes financial behavior patterns." },
            { role: "user", content: `Analyze the following actions and metadata to identify behavior patterns:\n\n${content}` },
        ],
    });

    const traits = response.choices[0].message.content?.split("\n").filter(Boolean) || [];
    await prisma.pattern.deleteMany({ where: { clientId: client.id } });
    const created = await prisma.pattern.createMany({
        data: traits.map(trait => ({ trait, clientId: client.id }))
    });

    return NextResponse.json(created);
}

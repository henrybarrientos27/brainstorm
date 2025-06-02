// File: app/api/client/[email]/summary/route.ts

import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import prisma from "@/lib/prisma";

const openai = new OpenAI();

export async function POST(
    req: Request,
    { params }: { params: { email: string } }
) {
    const email = decodeURIComponent(params.email);
    const { transcript } = await req.json();

    try {
        const client = await prisma.client.findUnique({ where: { email } });
        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI assistant that summarizes financial advisor-client meetings. Provide a clear, concise summary of the transcript.",
                },
                {
                    role: "user",
                    content: transcript,
                },
            ],
        });

        const content = completion.choices[0].message.content;

        await prisma.summary.create({
            data: {
                content: content || "",
                client: { connect: { email } },
            },
        });

        await prisma.activity.create({
            data: {
                type: "Summary",
                details: "Created summary from transcript.",
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error generating summary:", error);
        return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
    }
}

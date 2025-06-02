// app/api/upload/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OpenAI } from "openai";

export const runtime = "nodejs";

const openai = new OpenAI();

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const clientEmail = formData.get("clientEmail") as string;

        if (!file || !clientEmail) {
            return NextResponse.json({ error: "Missing file or client email." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const content = buffer.toString("utf-8");

        const client = await prisma.client.findUnique({
            where: { email: clientEmail },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found." }, { status: 404 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes financial advisor transcripts.",
                },
                {
                    role: "user",
                    content: `Summarize this transcript:\n\n${content}`,
                },
            ],
        });

        const summary = completion.choices[0].message.content ?? "No summary generated.";

        await prisma.summary.create({
            data: {
                content: summary,
                client: {
                    connect: { email: clientEmail },
                },
            },
        });

        return NextResponse.json({ message: "File uploaded and summary saved.", summary });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

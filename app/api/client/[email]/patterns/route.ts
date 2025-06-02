// app/api/client/[email]/patterns/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// GET /api/client/[email]/patterns?email=...
export async function GET(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    const email: string = emailParam || "";

    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: {
                summaries: true,
                feedback: true,
                recommendations: true,
                reminders: true,
                progress: true,
                auditLog: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const context = `Client Behavioral Data:

Meeting Summaries:
${client.summaries.map(s => s.content).join("\n")}

Feedback:
${client.feedback.map(f => f.content).join("\n")}

Recommendations:
${client.recommendations.map(r => r.message).join("\n")}

Reminders:
${client.reminders.map(r => r.note).join("\n")}

Progress:
${client.progress.map(p => `${p.goal} - ${p.status}`).join("\n")}

Audit History:
${client.auditLog.map(l => `${l.action} - ${l.createdAt}`).join("\n")}`;

        const prompt = `Analyze the following client interaction and behavior history. Return a concise list of 3-5 observable behavioral patterns or traits this client consistently displays. Focus on attitude toward risk, consistency of follow-through, emotional signals, tone patterns, and decision preferences. Use short phrases.\n\n${context}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a behavioral analyst for financial advisors.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 300,
            stream: true,
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (err) {
        console.error('[PATTERN ERROR]', err);
        return NextResponse.json({ error: 'Failed to analyze patterns' }, { status: 500 });
    }
}

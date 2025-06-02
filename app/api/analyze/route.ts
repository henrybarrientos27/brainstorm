import prisma from "@/lib/prisma"; // ✅ CORRECT
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    try {
        const { clientEmail } = await req.json();

        const client = await prisma.client.findUnique({
            where: { email: clientEmail },
            include: {
                summaries: true,
                insights: true,
            },
        });

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        const summaryTexts = client.summaries.map((s) => s.content).join('\n\n');
        const insightTexts = client.insights.map((i) => i.content).join('\n\n');

        const prompt = `
You're an expert behavioral financial psychologist. Based on the following summaries and insights, analyze the behavior, emotional patterns, and psychological mindset of the client named ${client.name}. Create a detailed behavior profile that helps a financial advisor build trust and communicate effectively.

Summaries:
${summaryTexts}

Insights:
${insightTexts}

Provide detailed observations, preferred communication styles, trust factors, emotional drivers, and decision-making tendencies.
`;

        const chatResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });

        const behaviorProfile = chatResponse.choices[0]?.message?.content;

        return NextResponse.json({ profile: behaviorProfile });
    } catch (err) {
        console.error('Error in /api/analyze:', err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

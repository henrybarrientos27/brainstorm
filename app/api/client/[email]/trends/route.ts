import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, context: { params: { email: string } }) {
    const { email } = context.params;

    try {
        const client = await prisma.client.findUnique({
            where: { email }
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const insights = await prisma.insight.findMany({
            where: {
                clientId: client.id,
                type: "behavioral"
            }
        });

        const behaviors = insights.map(i => i.content).join(" ");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a behavioral analyst. Analyze trends in client behavior."
                    },
                    {
                        role: "user",
                        content: behaviors
                    }
                ]
            })
        });

        const rawData = await response.json();

        // ✅ Fix here: safely parse possible unknown structure
        const trendReport =
            typeof rawData?.choices?.[0]?.message?.content === "string"
                ? rawData.choices[0].message.content
                : "Unable to generate trend analysis.";

        return NextResponse.json({ trendReport });
    } catch (err) {
        console.error("Trend analysis error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

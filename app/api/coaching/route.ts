import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET_coaching(_: Request, context: { params: { email: string } }) {
    const email = decodeURIComponent(context.params.email);
    try {
        const prompts = await prisma.coachingPrompt.findMany({
            where: { client: { email } },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ prompts });
    } catch (err) {
        console.error("/coaching error:", err);
        return NextResponse.json({ error: "Failed to fetch coaching prompts" }, { status: 500 });
    }
}
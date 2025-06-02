// File: app/api/client/[email]/forms/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam || "";

    try {
        const { type, status, data } = await req.json();

        const form = await prisma.form.create({
            data: {
                type,
                status,
                data,
                client: {
                    connect: { email },
                },
            },
        });

        await prisma.activity.create({
            data: {
                type: "Form",
                details: `Form submitted: ${type}`,
                client: {
                    connect: { email },
                },
            },
        });

        return NextResponse.json({ success: true, form });
    } catch (error) {
        console.error("Error saving form:", error);
        return NextResponse.json({ error: "Failed to save form" }, { status: 500 });
    }
}

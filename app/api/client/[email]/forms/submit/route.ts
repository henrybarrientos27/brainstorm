// File: app/api/client/[email]/forms/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam || "";

    try {
        const body = await req.json();
        const { formId } = body;

        if (!formId) {
            return NextResponse.json({ error: "Missing form ID" }, { status: 400 });
        }

        const form = await prisma.form.findUnique({
            where: { id: formId },
        });

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }

        await prisma.form.update({
            where: { id: formId },
            data: {
                status: "Submitted",
            },
        });

        await prisma.activity.create({
            data: {
                type: "Form Submission",
                details: `Form ${form.type} submitted`,
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error submitting form:", error);
        return NextResponse.json(
            { error: "Failed to submit form" },
            { status: 500 }
        );
    }
}

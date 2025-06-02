// File: app/api/client/[email]/forms/review/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam || "";
    const { formId, newStatus, newType, updatedData } = await req.json();

    try {
        const client = await prisma.client.findUnique({
            where: { email },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const form = await prisma.form.update({
            where: { id: formId },
            data: {
                status: newStatus,
                type: newType,
                data: updatedData,
            },
        });

        await prisma.activity.create({
            data: {
                type: "Form Review",
                details: `Reviewed and updated form (${formId})`,
                client: { connect: { email } },
            },
        });

        return NextResponse.json({ success: true, form });
    } catch (error) {
        console.error("Error reviewing form:", error);
        return NextResponse.json(
            { error: "Failed to review form" },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ email: string }> }
) {
    const { email } = await context.params;
    const decodedEmail = decodeURIComponent(email);


    try {
        const client = await prisma.client.findUnique({
            where: { email },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const preferredProvider = email.includes("osaic") ? "Osaic" : "SEI";

        const forms = [
            {
                name: "Risk Tolerance Form",
                type: "PDF",
                provider: preferredProvider,
            },
            {
                name: "Account Opening Form",
                type: "PDF",
                provider: preferredProvider,
            },
        ];

        for (const form of forms) {
            await prisma.form.create({
                data: {
                    name: form.name,
                    type: form.type,
                    provider: form.provider,
                    clientId: client.id,
                },
            });
        }

        return NextResponse.json({ message: "Forms pulled", forms });
    } catch (error: any) {
        console.error("Form pull error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to pull forms." },
            { status: 500 }
        );
    }
}

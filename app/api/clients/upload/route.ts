// app/api/clients/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const advisorEmail = session?.user?.email;

        if (!advisorEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const advisor = await prisma.advisor.findUnique({
            where: { email: advisorEmail },
        });

        if (!advisor) {
            return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
        }

        const body = await req.text();
        const rows = body.split("\n");

        for (const row of rows) {
            const [name, email] = row.split(",").map((s) => s.trim());

            if (!name || !email) continue;

            await prisma.client.upsert({
                where: { email },
                update: { name },
                create: {
                    name,
                    email,
                    advisor: {
                        connect: { id: advisor.id },
                    },
                },
            });
        }

        return NextResponse.json({ message: "CSV upload successful" });
    } catch (error) {
        console.error("[UPLOAD_CSV_ERROR]", error);
        return NextResponse.json(
            { error: "Failed to process CSV" },
            { status: 500 }
        );
    }
}
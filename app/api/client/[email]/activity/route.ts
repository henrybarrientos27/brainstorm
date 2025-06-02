// File: app/api/client/[email]/activity/route.ts

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
        const { type, details } = body;

        const newActivity = await prisma.activity.create({
            data: {
                type,
                details,
                client: { connect: { email } },
            },
        });

        return NextResponse.json(newActivity);
    } catch (error) {
        console.error("Error creating activity:", error);
        return NextResponse.json(
            { error: "Failed to create activity" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");

    if (!emailParam) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const email: string = emailParam || "";

    try {
        const activities = await prisma.activity.findMany({
            where: { client: { email } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("Error fetching activity log:", error);
        return NextResponse.json(
            { error: "Failed to fetch activity log" },
            { status: 500 }
        );
    }
}

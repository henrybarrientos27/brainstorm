// app/api/clients/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            select: { email: true, name: true }, // make sure name is included
        });
        return NextResponse.json({ clients });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
    }
}

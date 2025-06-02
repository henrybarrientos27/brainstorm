// app/api/client/[email]/history/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const emailParam = req.nextUrl.searchParams.get("email");
    if (!emailParam) return NextResponse.json({ error: "Missing email" }, { status: 400 });
    const email: string = emailParam;

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const history = await prisma.history.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(history);
}

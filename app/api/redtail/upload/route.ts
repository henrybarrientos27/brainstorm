// app/api/redtail/upload/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (!file.name.endsWith(".csv")) {
            return NextResponse.json({ error: "Only CSV files are allowed" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const content = buffer.toString("utf-8");

        const session = await getServerSession(authOptions);
        const advisorEmail = session?.user?.email;

        if (!advisorEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const advisor = await prisma.advisor.findUnique({ where: { email: advisorEmail } });

        if (!advisor) {
            return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
        }

        const rows = content.split("\n").map((row) => row.split(",").map(cell => cell.trim()));
        const header = rows[0];

        const requiredHeaders = ["email", "name", "totalAssets", "recentTransfers"];
        const missing = requiredHeaders.filter(h => !header.includes(h));

        if (missing.length > 0) {
            return NextResponse.json({ error: `Missing required header(s): ${missing.join(", ")}` }, { status: 400 });
        }

        const emailIndex = header.indexOf("email");
        const nameIndex = header.indexOf("name");
        const assetsIndex = header.indexOf("totalAssets");
        const transfersIndex = header.indexOf("recentTransfers");

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row[emailIndex]) continue;

            const email = row[emailIndex];
            const name = row[nameIndex] || "Unnamed Client";
            const totalAssets = parseFloat(row[assetsIndex] || "0");
            const recentTransfers = parseFloat(row[transfersIndex] || "0");

            const existing = await prisma.client.findUnique({ where: { email } });

            if (existing) {
                await prisma.client.update({
                    where: { email },
                    data: {
                        name,
                        totalAssets,
                        recentTransfers,
                        advisor: { connect: { id: advisor.id } },
                    },
                });
            } else {
                await prisma.client.create({
                    data: {
                        email,
                        name,
                        totalAssets,
                        recentTransfers,
                        advisor: { connect: { id: advisor.id } },
                    },
                });
            }

            const insightTriggers = [];

            if (recentTransfers > 50000) {
                insightTriggers.push({
                    tag: "Large Transfer",
                    content: `Client transferred $${recentTransfers.toLocaleString()} recently — consider asking about major changes.`,
                });
            }

            if (totalAssets > 1000000) {
                insightTriggers.push({
                    tag: "HNW Client",
                    content: `Client has over $1M in assets — advanced estate and tax planning may be needed.`,
                });
            }

            for (const trigger of insightTriggers) {
                await prisma.insight.create({
                    data: {
                        tag: trigger.tag,
                        content: trigger.content,
                        client: { connect: { email } },
                    },
                });
            }
        }

        return NextResponse.json({ message: "Redtail data imported successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

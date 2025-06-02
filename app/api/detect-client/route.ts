// app/api/detect-client/route.ts
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request & { formData?: () => Promise<FormData> }) {
  try {
    const formData = await req.formData?.();
    if (!formData) throw new Error("No form data found");

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    const buffer = Buffer.from(await file.arrayBuffer());
    const raw = buffer.toString("utf8");

    const clients = await prisma.client.findMany();
    const matches = clients.filter((client) => {
      return (
        raw.includes(client.email) ||
        raw.includes(client.name) ||
        client.name.split(" ").some((part) => raw.includes(part))
      );
    });

    if (matches.length === 0) {
      return NextResponse.json({ error: "Client not found in file." }, { status: 404 });
    }

    const best = matches[0];
    return NextResponse.json({ email: best.email, name: best.name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

// app/api/client/[email]/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import openai from "@/lib/openai"; // ✅ Make sure this is NOT in brackets

export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || typeof file !== "object") {
    return NextResponse.json({ error: "Invalid or missing file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Save the upload to database
  const upload = await prisma.upload.create({
    data: {
      email: emailParam,
      fileName: file.name,
      fileType: file.type,
      data: buffer,
      client: { connect: { email: emailParam } },
    },
  });

  // Run compliance + summary tagging using GPT
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a compliance reviewer AI for a financial advising firm. Analyze the following uploaded text or document to ensure it contains no sensitive PII, inappropriate language, or unapproved recommendations. If it's safe, summarize the content briefly."
      },
      {
        role: "user",
        content: buffer.toString("utf8"),
      },
    ],
  });

  const summary = completion.choices[0]?.message?.content || "No summary available.";

  // Update the upload entry with the summary and tagging status
  await prisma.upload.update({
    where: { id: upload.id },
    data: {
      summary,
      tagged: true,
    },
  });

  return NextResponse.json({ success: true, summary });
}

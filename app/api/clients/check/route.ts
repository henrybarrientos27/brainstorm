import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ exists: false });
  }

  const client = await prisma.client.findUnique({ where: { email } });
  return NextResponse.json({ exists: !!client });
}

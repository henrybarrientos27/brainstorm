// app/api/client/[email]/profile/route.ts
import prisma from "@/lib/prisma"; // ✅ CORRECT

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  const email = decodeURIComponent(params.email);

  try {
    const client = await prisma.client.findUnique({
      where: { email },
      include: {
        summaries: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Mock profile data (replace with real fields later)
    const profile = {
      name: client.name,
      email: client.email,
      riskTolerance: "Moderate",
      preferredPlatform: "SEI",
      financialGoals: [
        "Retire by 60",
        "Fund child’s college education",
        "Achieve long-term growth"
      ]
    };

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Error fetching client profile:", err);
    return NextResponse.json({ error: "Failed to fetch client profile" }, { status: 500 });
  }
}

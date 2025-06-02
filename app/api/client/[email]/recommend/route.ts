// app/api/client/forms/recommend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/client/forms/recommend?email=...
export async function POST(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam || "";

  const body = await req.json();
  const { message } = body;

  if (!message) {
    return NextResponse.json({ error: "Missing recommendation message" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({ where: { email } });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        message,
        client: { connect: { email } },
      },
    });

    return NextResponse.json(recommendation);
  } catch (err) {
    console.error('[RECOMMENDATION ERROR]', err);
    return NextResponse.json({ error: 'Failed to create recommendation' }, { status: 500 });
  }
}

// GET /api/client/forms/recommend?email=...
export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");

  if (!emailParam) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const email: string = emailParam || "";

  try {
    const recommendations = await prisma.recommendation.findMany({
      where: { client: { email } },
      orderBy: [{ createdAt: 'desc' }],
    });

    return NextResponse.json(recommendations);
  } catch (err) {
    console.error('[RECOMMENDATION FETCH ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

// app/api/redtail/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import prisma from '@/lib/prisma';
import openai from '@/lib/openai';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const advisorEmail = formData.get('advisorEmail') as string;

  if (!file || !advisorEmail) {
    return NextResponse.json({ error: 'Missing file or advisorEmail' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const csvContent = buffer.toString('utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  try {
    for (const row of records) {
      const email = row.Email?.toLowerCase();
      if (!email) continue;

      await prisma.client.upsert({
        where: { email },
        update: {
          totalAssets: parseFloat(row.TotalAssets || '0'),
          recentTransfers: parseFloat(row.RecentTransfers || '0'),
          advisor: {
            connect: { email: advisorEmail },
          },
        },
        create: {
          email,
          name: row.Name || 'Unnamed',
          totalAssets: parseFloat(row.TotalAssets || '0'),
          recentTransfers: parseFloat(row.RecentTransfers || '0'),
          advisor: {
            connect: { email: advisorEmail },
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redtail upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

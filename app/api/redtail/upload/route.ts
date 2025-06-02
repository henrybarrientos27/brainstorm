// app/api/redtail/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import prisma from '@/lib/prisma';

async function streamToString(stream: Readable): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const advisorEmail = formData.get('email') as string;

    if (!file || !advisorEmail) {
      return NextResponse.json({ error: 'Missing file or email' }, { status: 400 });
    }

    const text = await streamToString(file.stream() as any);

    const records: any[] = [];
    const parser = parse({ columns: true, skip_empty_lines: true });
    parser.write(text);
    parser.end();

    for await (const record of parser) {
      records.push(record);
    }

    for (const row of records) {
      const client = await prisma.client.upsert({
        where: { email: row.Email },
        update: {
          name: row.Name,
          totalAssets: parseFloat(row.TotalAssets || '0'),
          recentTransfers: parseFloat(row.RecentTransfers || '0'),
        },
        create: {
          email: row.Email,
          name: row.Name,
          totalAssets: parseFloat(row.TotalAssets || '0'),
          recentTransfers: parseFloat(row.RecentTransfers || '0'),
          advisor: {
            connectOrCreate: {
              where: { email: advisorEmail },
              create: { email: advisorEmail },
            },
          },
        },
      });

      const insights: { tags: string; content: string }[] = [
        { tags: 'trust', content: 'Client trusts advisor based on high asset transfer activity.' },
        { tags: 'goal', content: 'Client is actively building wealth based on net planning data.' },
      ];

      for (const insight of insights) {
        await prisma.insight.create({
          data: {
            tags: insight.tags,
            content: insight.content,
            client: { connect: { email: row.Email } },
          },
        });
      }
    }

    return NextResponse.json({ message: 'Upload successful' });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

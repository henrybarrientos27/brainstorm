// route.ts (under /api/verify-access/)
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        const client = await prisma.client.findUnique({ where: { email } });
        const advisor = await prisma.advisor.findUnique({ where: { email } });
        const isAuthorized = !!client || !!advisor;

        return NextResponse.json({ exists: isAuthorized });
    } catch (error) {
        console.error('[VERIFY_ACCESS_ERROR]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

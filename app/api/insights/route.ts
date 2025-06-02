// Insights Route
// File: /app/api/client/[email]/insights/route.ts
export async function GET(
    _req: Request,
    { params }: { params: { email: string } }
) {
    const email = decodeURIComponent(params.email);

    try {
        const client = await prisma.client.findUnique({
            where: { email },
            include: { insights: true },
        });

        if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

        return NextResponse.json(client.insights);
    } catch (error) {
        console.error('[INSIGHTS_ROUTE_ERROR]', error);
        return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
    }
}
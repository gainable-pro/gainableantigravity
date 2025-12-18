import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const count = await prisma.expert.count();
        const experts = await prisma.expert.findMany({
            select: { nom_entreprise: true, status: true, expert_type: true }
        });
        return NextResponse.json({ count, experts });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

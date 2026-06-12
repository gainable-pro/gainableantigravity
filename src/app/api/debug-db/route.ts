import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const count = await prisma.article.count({ where: { status: 'PUBLISHED' } });
        const expertCount = await prisma.expert.count();
        return NextResponse.json({ 
            ok: true, 
            publishedArticles: count,
            experts: expertCount,
            dbUrl: process.env.DATABASE_URL ? 'SET (hidden)' : 'MISSING ❌'
        });
    } catch (err: any) {
        return NextResponse.json({ 
            ok: false, 
            error: err.message,
            dbUrl: process.env.DATABASE_URL ? 'SET (hidden)' : 'MISSING ❌'
        }, { status: 500 });
    }
}

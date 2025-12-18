import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        message: 'PONG',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
}

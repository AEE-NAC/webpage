import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth';

export async function GET() {
    const session = await AuthService.getSession();
    if (!session) return NextResponse.json({}, { status: 401 });
    return NextResponse.json({ user: session });
}

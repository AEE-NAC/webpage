import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth';
export const dynamic = 'force-dynamic';

export async function POST() {
    await AuthService.logout();
    return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
    try {
        const { token, username, password } = await request.json();
        await AuthService.registerViaInvite(token, username, password);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    }
}

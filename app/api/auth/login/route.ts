import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    const result = await AuthService.login(username, password);

    if (result.success) {
        return NextResponse.json({ success: true, user: result.user });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}

import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth';

export async function GET() {
    try {
        const invites = await AuthService.getInvites();
        return NextResponse.json({ invites });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { role, country_code } = await request.json();
        const invite = await AuthService.createInvite(role, country_code);
        return NextResponse.json({ invite });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    try {
        await AuthService.deleteInvite(id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

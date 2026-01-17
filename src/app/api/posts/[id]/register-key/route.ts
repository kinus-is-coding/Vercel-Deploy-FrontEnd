import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    if (!DJANGO_API_BASE_URL) {
        return NextResponse.json({ message: 'Django API URL not configured' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('session_access_token')?.value;

    if (!accessToken) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    try {
        const DJANGO_REGISTER_KEY_URL = `${DJANGO_API_BASE_URL}/posts/${id}/register_key/`;

        const res = await fetch(DJANGO_REGISTER_KEY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { message: `Django error: ${errorText}` }, 
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Proxy Register Key Error:", error);
        return NextResponse.json(
            { message: 'Internal server error while register key.' }, 
            { status: 500 }
        );
    }
}

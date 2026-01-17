import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;

export async function GET(request: NextRequest) {
    if (!DJANGO_API_BASE_URL) {
        return NextResponse.json({ message: 'Django API URL not configured' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('session_access_token')?.value;

    if (!accessToken) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    try {
        const finalUrl = `${DJANGO_API_BASE_URL}/posts/my_virtual_keys/`;
        console.log("Fetching virtual keys from:", finalUrl);

        const res = await fetch(finalUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { message: `Error from Django: ${errorText}` }, 
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Fetch Virtual Keys Error:", error);
        return NextResponse.json(
            { message: 'Internal server error while fetching virtual keys.' }, 
            { status: 500 }
        );
    }
}

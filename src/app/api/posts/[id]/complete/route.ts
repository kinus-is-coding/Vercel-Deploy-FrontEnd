import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Khai báo Promise ở đây
) {
    const { id } = await params; 
    

    if (!DJANGO_API_BASE_URL) {
        return NextResponse.json({ message: 'Django API URL not configured' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('session_access_token')?.value;

    try {
        const DJANGO_COMPLETE_URL = `${DJANGO_API_BASE_URL}/posts/${id}/complete/`;

        const res = await fetch(DJANGO_COMPLETE_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { message: `Django từ chối lệnh complete: ${errorText}` }, 
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Proxy Complete Error:", error);
        return NextResponse.json(
            { message: 'Lỗi kết nối tới Django khi thực hiện complete.' }, 
            { status: 500 }
        );
    }
}
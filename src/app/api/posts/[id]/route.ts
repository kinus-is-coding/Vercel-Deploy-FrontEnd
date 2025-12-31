import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
        const { id } = await params;
    
    const DJANGO_DETAIL_URL = `${DJANGO_API_BASE_URL}/posts/${id}/`;

    if (!DJANGO_API_BASE_URL) {
        return NextResponse.json({ message: 'Django API URL not configured' }, { status: 500 });
    }

    try {
        const res = await fetch(DJANGO_DETAIL_URL, {
            cache: 'no-store', 
        });

        if (!res.ok) {
            return NextResponse.json(
                { message: `Django không tìm thấy bài post ${id}` }, 
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Proxy Detail Fetch Error:", error);
        return NextResponse.json(
            { message: 'Lỗi kết nối tới Django khi lấy chi tiết.' }, 
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL ;
const DJANGO_POSTS_URL = `${DJANGO_API_BASE_URL}/posts/`;

export async function GET(request: NextRequest) {
    try {
        // 1. LẤY TOÀN BỘ SEARCH PARAMS TỪ CLIENT (Next.js)
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString(); // Ví dụ: "q=ao%20khoac"

        // 2. NỐI NÓ VÀO URL GỌI SANG DJANGO
        const finalUrl = queryString 
            ? `${DJANGO_POSTS_URL}?${queryString}` 
            : DJANGO_POSTS_URL;

        console.log("Proxy đang chuyển hướng sang:", finalUrl);

        // 3. Gọi sang Django với đầy đủ tham số
        const res = await fetch(finalUrl, {
            cache: 'no-store', 
        });

        if (!res.ok) {
            return NextResponse.json(
                { message: `Error fetching from Django: ${res.statusText}` }, 
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Proxy Fetch Error:", error);
        return NextResponse.json(
            { message: 'Internal server error while connecting to Django.' }, 
            { status: 500 }
        );
    }
}
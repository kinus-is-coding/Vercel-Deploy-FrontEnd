import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    // 1. Lấy token từ HTTP-only Cookie (Server đọc được, Client thì không)
    const token = cookieStore.get('session_access_token')?.value; 

    if (!token) {
        return NextResponse.json({ details: "Chưa đăng nhập (No Cookie Found)" }, { status: 401 });
    }

    const body = await request.json();
    const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL ;

    // 2. DÙNG BIẾN 'token' VỪA LẤY ĐỂ GỬI SANG DJANGO
    const response = await fetch(`${DJANGO_API_BASE_URL}/addlock/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error("Proxy Error:", error.message);
    return NextResponse.json({ details: "Lỗi Proxy Server", error: error.message }, { status: 500 });
  }
}
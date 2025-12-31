// src/app/api/posts/route.ts
// This file acts as the PROXY layer.

import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT: Use environment variable for the external Django URL
// Make sure DJANGO_API_BASE_URL is set in your .env.local (e.g., http://127.0.0.1:8000/api)
const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;

// The full URL that contacts your Django DRF server
const DJANGO_POSTS_URL = `${DJANGO_API_BASE_URL}/posts/`;

export async function GET(request: NextRequest) {
    if (!DJANGO_API_BASE_URL) {
        return NextResponse.json({ message: 'Django API URL not configured' }, { status: 500 });
    }

    try {
        // 1. Fetch data from the external Django DRF backend (Port 8000)
        const res = await fetch(DJANGO_POSTS_URL, {
            // Setting cache: 'no-store' is important here to ensure fresh data from Django
            cache: 'no-store', 
        });

        if (!res.ok) {
            // Forward the error status from Django
            return NextResponse.json(
                { message: `Error fetching from Django: ${res.statusText}` }, 
                { status: res.status }
            );
        }

        const data = await res.json();
        
        // 2. Return the data to the Next.js client component
        return NextResponse.json(data);

    } catch (error) {
        console.error("Proxy Fetch Error:", error);
        return NextResponse.json(
            { message: 'Internal server error while connecting to Django.' }, 
            { status: 500 }
        );
    }
}
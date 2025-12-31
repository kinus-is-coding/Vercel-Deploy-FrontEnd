// src/app/api/token/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Get the base URL for the Django API (e.g., http://127.0.0.1:8000/api)
const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;

export async function POST(request: NextRequest) {
    if (!DJANGO_API_BASE_URL) {
        // Fail early if the environment variable is not set
        return NextResponse.json({ detail: 'Backend API URL not configured in environment variables' }, { status: 500 });
    }

    try {
        // Read the username and password sent from the LoginModal
        const body = await request.json(); 
        
        // This is the standard Django Simple JWT token endpoint
        const TOKEN_URL = `${DJANGO_API_BASE_URL}/token/`; 

        // 1. Forward the login request to the external Django server
        const res = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body), 
        });

        // 2. Read the response body from Django
        const data = await res.json();

        // 3. Check if Django returned an error (e.g., status 401 Unauthorized)
        if (!res.ok) {
            // Forward Django's error message and status code back to the client
            return NextResponse.json(data, { status: res.status });
        }
        
        // 4. Success: Data contains {access: '...', refresh: '...', user_id: '...'}
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Login Token Proxy Error:", error);
        return NextResponse.json(
            { detail: 'Internal server error while processing the login request.' }, 
            { status: 500 }
        );
    }
}
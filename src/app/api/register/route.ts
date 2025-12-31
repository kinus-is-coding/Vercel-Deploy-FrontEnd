// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Get the base URL for the Django API (e.g., http://127.0.0.1:8000/api)
const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;

// This should point to your Django user creation/registration endpoint
const REGISTER_URL = `${DJANGO_API_BASE_URL}/users/register/`; // Adjust endpoint if needed

export async function POST(request: NextRequest) {
    if (!DJANGO_API_BASE_URL) {
        return NextResponse.json({ detail: 'Backend API URL not configured' }, { status: 500 });
    }

    try {
        const body = await request.json(); // Get signup data from Next.js client

        // 1. Forward the registration request to the external Django server
        const res = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body), 
        });

        const data = await res.json();

        if (!res.ok) {
            // Forward Django's validation errors (like password mismatch, user exists)
            return NextResponse.json(data, { status: res.status });
        }
        
        // 2. Registration successful response
        return NextResponse.json({ detail: 'Registration successful' }, { status: 201 });

    } catch (error) {
        console.error("Registration Proxy Error:", error);
        return NextResponse.json(
            { detail: 'Internal server error while processing registration.' }, 
            { status: 500 }
        );
    }
}
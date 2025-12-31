'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
/**
 * Sets the access token and refresh token as secure, HTTP-only cookies.
 * This function MUST run on the server.
 */
export async function handleLogin(
    userId: string, 
    accessToken: string, 
    refreshToken: string
) {
    const cookieStore = await cookies()
    // Determine security based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    // 1. Set the Session User ID (Optional, but useful for display)
    cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 60 * 60 * 24 * 7, // One Week
        path: '/',
    });
    
    // 2. Set the Access Token (Short-lived)
    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 60 * 60, // 60 minutes (match your JWT lifespan)
        path: '/',
    });
    
    // 3. Set the Refresh Token (Long-lived)
    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 60 * 60 * 24 * 7, // One Week
        path: '/',
    });
}
export async function getAuthStatus() {
    // Access the cookies function from next/headers
     const cookieStore = await cookies();
    
    // Check if the secure session access token exists
    const accessToken = cookieStore.get('session_access_token');
    
    // If the token exists, the user is considered logged in
    const isLoggedIn = !!accessToken;
    
    // Optional: Get the User ID for display purposes
    const userId = cookieStore.get('session_userid')?.value;

    return { 
        isLoggedIn, 
        userId 
    };
}
export async function handleLogout() {
    // Delete all session-related HTTP-Only cookies
    const cookieStore =  await cookies();
    cookieStore.delete('session_access_token');
    cookieStore.delete('session_refresh_token');
    cookieStore.delete('session_userid');

    // Redirect the user to the home page after logging out
    redirect('/'); 
}
export async function getUserId(){
    const cookieStore =  await cookies();
    const UserId=cookieStore.get('session_userid')?.value
    return UserId?UserId:null
}
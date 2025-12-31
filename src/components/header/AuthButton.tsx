// src/components/AuthButtons.tsx
import Link from 'next/link';
import { getAuthStatus } from '@/lib/loginAction';
import { handleLogout } from '@/lib/loginAction';
// Assume you still need to open the Login/Signup modals from the client side
import ClientSideButton from './ClientSideButton'; 

// NOTE: This is a Server Component, meaning it renders on the server.
const AuthButtons = async () => {
    // 1. Check authentication status on the server
    const { isLoggedIn } = await getAuthStatus();

    if (isLoggedIn) {
        // --- LOGGED IN: Show Logout Button ---
        return (
            <form action={handleLogout}>
                <button 
                    type="submit" 
                    className="
                        py-2 px-4 bg-red-600 text-white font-bold rounded-xl 
                        hover:bg-red-700 transition duration-150
                    "
                >
                    Logout
                </button>
            </form>
        );
    } 
    
    // --- LOGGED OUT: Show Login and Register Buttons ---
    return (
        <div className="flex space-x-4">
            {/* The Login/Signup buttons must be Client Components if they open modals */}
            <ClientSideButton type="login" /> 
            <ClientSideButton type="signup" />
        </div>
    );
};

export default AuthButtons;

// -------------------------------------------------------------------
// Helper component to handle modal opening (MUST be a client component)
// -------------------------------------------------------------------


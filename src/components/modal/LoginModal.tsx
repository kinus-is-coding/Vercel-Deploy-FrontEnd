'use client';
import React, { useState } from 'react';
import useLoginModal from '@/hooks/useLoginModal';
import Modals from './Modals';
import { useRouter } from 'next/navigation';

// 🔥 ASSUMPTION: Import the secure Server Action (e.g., from '@/lib/actions')
import { handleLogin } from '@/lib/loginAction';

const LoginModal = () => {
    // Renamed variable to standard camelCase for clarity
    const loginModal = useLoginModal();
    const router = useRouter(); 

    // State Management for form data and status
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]); // Array for error messages
    const [isLoading, setIsLoading] = useState(false);

    const LOGIN_API_URL = '/api/token/';

    // --- Core Login Submission Logic ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]); // Clear previous errors

        try {
            // 1. Call the Next.js API Proxy to get tokens from Django
            const res = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle Django/JWT error response (e.g., "No active account found")
                const errorMessage = data.detail || 'Login failed. Check username and password.';
                setErrors([errorMessage]);
                return;
            }

            // --- SUCCESS: Secure Token Handling ---
            
            // 🔥 CRITICAL CHECK: Ensure Django response includes all needed fields 
            //    (Requires Django customization to return user_id)
            if (!data.access || !data.refresh || !data.user_id) {
                 throw new Error("Missing required session data from server response (e.g., user_id).");
            }
            
            // 2. Call the secure Server Action to set HTTP-Only Cookies.
            await handleLogin(
                data.user_id.toString(), // Must be a string
                data.access,
                data.refresh
            ); 
            
            // 3. Close the modal and refresh the application to update UI/auth status
            loginModal.close();
            router.refresh(); 

        } catch (err: any) {
            console.error('Login Error:', err);
            setErrors([err.message || 'A network error occurred. Please try again.']);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Modal Content ---
    const content = (
      <>
        <h2 className='mb-6 text-2xl font-bold text-black'>Sign In</h2>
        
        {/* Conditional Error Message Display (using the 'errors' state) */}
        

        {/* 1. Attach handleSubmit to the form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
            
            {/* Input 1: Username/Email */}
            <input 
                placeholder='Enter your username' 
                type="text" // Set to 'text' as username may not be an email
                className='w-full h-[54px] px-4 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                disabled={isLoading}
            />
            
            {/* Input 2: Password */}
            <input 
                placeholder='Enter your password' 
                type="password"  
                className='w-full h-[54px] px-4 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
            />
            {errors.length > 0 && errors.map((error, index) =>
            <div key={`error_${index}`} className='p-3 bg-red-700 text-white rounded-xl text-sm'>
               {error}
            </div>
        )}
            {/* Submitting Button */}
            <button
                type="submit" 
                disabled={isLoading} 
                className="
                    mt-4 w-full h-[54px] inline-flex items-center justify-center text-lg font-bold text-white rounded-xl transition-all duration-300
                    bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-900/50
                    hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed
                "
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                    </span>
                ) : (
                    'Log In'
                )}
            </button>
        </form>
      </>
    )
    
    return (
        <Modals
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Login"
            content={content}
        />
    )
}

export default LoginModal;
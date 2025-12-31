'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSignupModal from '@/hooks/useSignupModal';
import Modals from './Modals';
import useLoginModal from '@/hooks/useLoginModal'; // For redirecting after successful signup

const SignupModal = () => {
    const signupModal = useSignupModal();
    const loginModal = useLoginModal(); // To open the login modal on success
    const router = useRouter();

    // State Management
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    
    // This calls the proxy route we will create: /api/register
    const SIGNUP_API_URL = '/api/register/'; 

    // --- Core Registration Logic ---
    const submitSignup = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true);
        setErrors([]); // Clear previous errors

        const formData = {
            username: username,
            password: password1, // Send as 'password' to Django
            password2: password2 // Send repeat password if Django expects it
        };

        try {
            const response = await fetch(SIGNUP_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle API validation errors (e.g., username taken, passwords don't match)
                const errorMessages: string[] = [];
                
                // Django DRF often returns an object mapping fields to error arrays
                if (data.username) errorMessages.push(`Username: ${data.username.join(', ')}`);
                if (data.password) errorMessages.push(`Password: ${data.password.join(', ')}`);
                if (data.password2) errorMessages.push(`Password Confirm: ${data.password2.join(', ')}`);
                
                // Handle non-field errors (e.g., {"detail": "Error message"})
                if (errorMessages.length === 0 && data.detail) {
                    errorMessages.push(data.detail);
                } else if (errorMessages.length === 0) {
                    errorMessages.push('Registration failed due to unknown server error.');
                }

                setErrors(errorMessages);
                return;
            }

            // --- SUCCESS ---
            setErrors([]);
            
            signupModal.close(); // Close the signup modal
            loginModal.open();   // Open the login modal (user needs to log in now)
            router.refresh(); // Refresh the page to update state if necessary

        } catch (error) {
            console.error('Network or Proxy Error:', error);
            setErrors(['A network error occurred. Please check your connection.']);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Modal Content ---
    const content = (
        <div className='flex flex-col gap-4'>
            <h2 className='mb-6 text-2xl text-black'>Create Account</h2>
            {/* Display non-field errors */}
            {errors.length > 0 && errors.map((error, index) =>
                <div key={`error_${index}`} className='p-3 bg-red-700 text-white rounded-xl text-sm'>
                   {error}
                </div>
            )}

            <form onSubmit={submitSignup} className='space-y-4'> {/* Changed action to onSubmit */}
                
                {/* ... Input fields using onChange handlers ... */}
                <input 
                    placeholder='Enter your username' 
                    type="text"  // Changed type to text, as username is not always an email
                    className='w-full h-[54px] px-4 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                    onChange={(e)=>{setUsername(e.target.value)}}
                    disabled={isLoading}
                />
                
                <input 
                    placeholder='Enter your password' 
                    type="password"  
                    className='w-full h-[54px] px-4 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                    onChange={(e)=>{setPassword1(e.target.value)}}
                    disabled={isLoading}
                />
                <input 
                    placeholder='Repeat password' 
                    type="password"  
                    className='w-full h-[54px] px-4 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                    onChange={(e)=>{setPassword2(e.target.value)}}
                    disabled={isLoading}
                />
               
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
                            Signing up...
                        </span>
                    ) : (
                        'Sign up'
                    )}
                </button>
            </form>
        </div>
    );

    return (
        <Modals
            isOpen={signupModal.isOpen}
            close={signupModal.close}
            label="Sign up"
            content={content}
        />
    );
};

export default SignupModal;
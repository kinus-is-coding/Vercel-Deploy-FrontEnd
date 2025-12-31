// src/components/ClientSideButton.tsx
'use client';

import useLoginModal from '@/hooks/useLoginModal';
import useSignupModal from '@/hooks/useSignupModal';

interface ClientSideButtonProps {
    type: 'login' | 'signup';
}

const ClientSideButton: React.FC<ClientSideButtonProps> = ({ type }) => {
    const loginModal = useLoginModal();
    const signupModal = useSignupModal();

    const handleClick = () => {
        if (type === 'login') {
            loginModal.open();
        } else {
            signupModal.open();
        }
    };

    const label = type === 'login' ? 'Log In' : 'Register';
    const className = type === 'login' 
        ? "py-2 px-4 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition duration-150"
        : "py-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-150";

    return (
        <button onClick={handleClick} className={className}>
            {label}
        </button>
    );
};
export default ClientSideButton
'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modals from '@/components/modal/Modals';

interface Locker {
    id: number;
    title: string;
    description?: string;
    locker: {
        is_occupied: boolean;
        locker_id: string;
    }
}

interface LockerListProps {
    lockers: Locker[];
}

const LockerList = ({ lockers }: LockerListProps) => {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [openedIds, setOpenedIds] = useState<number[]>([]);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setMessage(null);
    }, []);

    const handleOpenLocker = async (id: number, lid: string) => {
        setLoadingId(id);
        setMessage(null);
        try {
            const res = await fetch(`/api/posts/${id}/complete/`, {
                method: 'PATCH',
            });

            if (res.ok) {
                setMessage({ text: `Locker #${lid} opened successfully!`, type: 'success' });
                setIsModalOpen(true);
                setOpenedIds((prev) => [...prev, id]);
                router.refresh();
            } else {
                const data = await res.json();
                setMessage({ text: data.message || 'Failed to open locker.', type: 'error' });
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error opening locker:", error);
            setMessage({ text: 'Error connecting to the server.', type: 'error' });
            setIsModalOpen(true);
        } finally {
            setLoadingId(null);
        }
    };

    const visibleLockers = lockers.filter((l) => !openedIds.includes(l.id));

    return (
        <div className="space-y-4">
            {visibleLockers.length === 0 && !message && (
                <p className="text-gray-500">You don't have any active lockers.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleLockers.map((locker) => (
                    <div key={locker.locker.locker_id} className="border p-4 rounded-xl shadow-sm bg-white flex justify-between items-center">
                        <div className="text-slate-900">
                            <h3 className="font-bold text-lg">{locker.title || 'Locker'}</h3>
                            <p className="text-sm text-gray-500">Locker ID: {locker.locker.locker_id}</p>
                            {locker.description && <p className="text-gray-600 text-sm">{locker.description}</p>}
                        </div>
                        <button
                            onClick={() => handleOpenLocker(locker.id, locker.locker.locker_id)}
                            disabled={loadingId === locker.id}
                            className={`
                                py-2 px-6 rounded-lg font-bold transition
                                ${loadingId === locker.id
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'}
                            `}
                        >
                            {loadingId === locker.id ? 'Opening...' : 'Open Locker'}
                        </button>
                    </div>
                ))}
            </div>
            {message && (
                <Modals
                    isOpen={isModalOpen}
                    close={handleCloseModal}
                    label={message.type === 'success' ? 'Success' : 'Error'}
                    content={
                        <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                            {message.text}
                        </p>
                    }
                />
            )}
        </div>
    );
};

export default LockerList;

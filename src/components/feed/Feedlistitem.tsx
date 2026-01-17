"use client"; // 1. Chuyển sang Client Component để dùng event onClick

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 2. Để chuyển hướng
import useLoginModal from '@/hooks/useLoginModal'; // 3. Hook Zustand của bro

interface Post {
    id: number;
    author_username: string;
    title: string;
    location: string;
    image_url: string;
    created_at: string;
}

interface FeedlistitemProps {
    post: Post;
    isLoggedIn: boolean; // 4. Nhận trạng thái login từ cha truyền xuống
}

const Feedlistitem: React.FC<FeedlistitemProps> = ({ post, isLoggedIn }) => {
    const router = useRouter();
    const loginModal = useLoginModal(); // 5. Lấy hàm open từ Zustand

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Date N/A';
        }
    };

    // 6. Hàm xử lý khi click vào Item
    const handleItemClick = () => {
        console.log("Value:", isLoggedIn, "Type:", typeof isLoggedIn);
        if (isLoggedIn) {
            // Nếu đã login -> Cho sang trang Quiz
            router.push(`/quiz/${post.id}`);
        } else {
            // Nếu chưa login -> Bật Modal Login lên
            loginModal.open(); 
        }
    };

    return (
        <div 
            onClick={handleItemClick} // 7. Gắn sự kiện click
            className='cursor-pointer group' // Thêm group để làm hiệu ứng hover cho đẹp
        >
            <div className='relative overflow-hidden aspect-square rounded-xl border border-slate-800'>
                <Image
                    fill
                    src={post.image_url || '/placeholder.png'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="group-hover:scale-110 object-cover transition h-full w-full"
                    alt={post.title} 
                />
                
                {/* 8. (Tùy chọn) Hiện icon khóa nếu chưa login */}
                {!isLoggedIn && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                         <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                         </div>
                    </div>
                )}
            </div>
            
            <div className='mt-2'>
                <p className='text-lg font-bold group-hover:text-indigo-400 transition'>{post.title}</p>
            </div>
            <div className='mt-2'>
                <p className='text-sm text-white'>
                    <strong>{post.location}</strong> · {formatDate(post.created_at)}
                </p>
            </div>
        </div>
    );
}

export default Feedlistitem;
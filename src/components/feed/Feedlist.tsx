"use client";

import React, { useState, useEffect } from 'react';
import Feedlistitem from './Feedlistitem';

interface Post {
    id: number;
    author_username: string;
    title: string;
    content: string;
    location: string;
    image_url: string;
    created_at: string;
}

interface FeedlistProps {
    isLoggedIn: boolean;
    searchQuery: string; // Nhận từ page.tsx
}

const Feedlist: React.FC<FeedlistProps> = ({ isLoggedIn, searchQuery }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        
        let fullUrl = '/api/posts/'; 
        if (searchQuery) {
            fullUrl += `?q=${encodeURIComponent(searchQuery)}`;
            console.log("Đang gọi API tại:", fullUrl);
        }

        try {
            setLoading(true); 
            const response = await fetch(fullUrl);
            if (!response.ok) throw new Error(`Failed to fetch posts`);
            const data = await response.json();
            setPosts(data);
            setError(null);
        } catch (err: any) {
            setError("Backend đang ngủ hoặc lỗi kết nối.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPosts();
        
    }, [searchQuery]);

    if (loading) {
        return (
            <>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="animate-pulse bg-slate-800 rounded-2xl h-64 w-full"></div>
                ))}
            </>
        );
    }

    // 2. Giao diện khi lỗi
    if (error) {
        return (
            <div className="col-span-full py-20 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                    onClick={() => {setLoading(true); fetchPosts();}}
                    className="px-4 py-2 bg-indigo-600 rounded-lg text-sm"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    // 3. Giao diện khi không có bài đăng nào
    if (posts.length === 0) {
        return (
            <div className="col-span-full py-20 text-center text-slate-500">
                Chưa có món đồ nào được đăng.
            </div>
        );
    }
    
    return (
        <>
            {posts.map((post) => (
                <Feedlistitem
                    key={post.id}
                    post={post}
                    isLoggedIn={isLoggedIn} 
                />
            ))}
        </>
    );
}

export default Feedlist;
"use client"; // 1. Add the directive to make it a Client Component

import React, { useState, useEffect } from 'react'; // 2. Import hooks
import Feedlistitem from './Feedlistitem';
import Link from 'next/link';
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
}
const Feedlist: React.FC<FeedlistProps> = ({ isLoggedIn }) => {
    // 4. Use state to manage posts, loading status, and errors
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 5. Define the data fetching function
    const fetchPosts = async () => {
        // Define the INTERNAL Next.js API route URL
        
        const fullUrl = '/api/posts/'; 

        try {
            const response = await fetch(fullUrl);

            if (!response.ok) {
                // Throw an error if the HTTP status is not successful
                throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setPosts(data); // Update state with fetched data

        } catch (err: any) {
            console.error("Error loading data:", err);
            setError("Error loading feed. Please check the backend connection.");
        } finally {
            setLoading(false); // Stop loading regardless of success/fail
        }
    };
    
    // 6. Use useEffect to run fetchPosts when the component first mounts
    useEffect(() => {
        fetchPosts();
    }, []); // Empty dependency array means it runs only once

    // --- Rendering Logic (Displays Loading/Error states) ---

    if (loading) {
        return <div className="p-4 text-center text-gray-400">Loading posts...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
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

export default Feedlist
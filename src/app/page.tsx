import Feedlist from '@/components/feed/Feedlist'
import React from 'react'
import { getAuthStatus } from '@/lib/loginAction';
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const page = async ({ searchParams }: PageProps) => { 
  const { isLoggedIn } = await getAuthStatus();
  const resolvedParams = await searchParams; 
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : "";
  return (
  
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6'>
          <Feedlist isLoggedIn={isLoggedIn} searchQuery={query}/>
      </div>
    </main>
  )
}

export default page
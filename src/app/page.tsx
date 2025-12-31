import Feedlist from '@/components/feed/Feedlist'
import React from 'react'
import { getAuthStatus } from '@/lib/loginAction';

// THÊM TỪ KHÓA 'async' Ở ĐÂY NÈ BRO!
const page = async () => { 
  const { isLoggedIn } = await getAuthStatus();
  


  return (
    
    <div className='mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
        <Feedlist isLoggedIn={isLoggedIn}/>
    </div>
  )
}

export default page
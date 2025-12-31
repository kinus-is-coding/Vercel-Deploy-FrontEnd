import React from 'react'

const SearchFilter = () => {
  return (
    <div className='h-[64px] flex items-center justify-between border rounded-full '>
        
        {/* 2. Group the three location inputs into a single flex item */}
        <div className='flex flex-row items-center'>
            <div className='h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100'>
                <p className='text-xs font-semibold'> Where?</p>
                <p className='text-sm'> Wanted location</p>
            </div>
            <div className='h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100'>
                <p className='text-xs font-semibold'> Where?</p>
                <p className='text-sm'> Wanted location</p>
            </div>
            <div className='h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100'>
                <p className='text-xs font-semibold'> Where?</p>
                <p className='text-sm'> Wanted location</p>
            </div>
        </div> {/* This entire block is the first flex item */}
        
        {/* 3. The "hello" button area is the second flex item, which 'justify-between' will push to the right */}
        <div className='p-2'>
            <div className='h-10 w-10 flex items-center justify-center rounded-full text-white bg-blue-500 hover:bg-blue-600 transition font-bold'>
                S
            </div>
        </div>
        
    </div>
  )
}

export default SearchFilter
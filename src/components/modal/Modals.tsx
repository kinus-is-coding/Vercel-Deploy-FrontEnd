'use client'
import { useCallback, useEffect, useState } from 'react';
interface ModalProps{
    label: string;
    content:React.ReactElement;
    close:()=>void;
    isOpen:boolean;
}
import React from 'react'
const Modals:React.FC<ModalProps>=({label,content,isOpen,close}) => {
  const [showModal,setShowModal]=useState(isOpen);
  useEffect(()=>{
    setShowModal(isOpen)
  },[isOpen])
  const handleClose=useCallback(()=>{
    setShowModal(false);
    setTimeout(()=>{
        close();
    },100)
  },[close])
  if(!isOpen){
    return null;
  }

  return (
   <div className='flex items-center justify-center fixed inset-0 z-50 bg-black/60'>
    <div className='relative w-[90%] md:w-[80%] lg:w-[700px] my-6 mx-auto h-auto'>
        <div className={`translate duration-600 h-full ${showModal? 'translate-y-0':'translate-y-0full'} ${showModal? 'opacity-100':'opacity-10'} `}>
            <div className='w-full h-auto rounded-xl relative flex flex-col bg-white'>
                <header className='h-[60px] flex items-center p-6 rounded-t justify-center relative border-b'>
                    
                  
                    <div className='p-3 absolute left-3 hover:bg-gray-300 rounded-full cursor-pointer text-gray-800' onClick={handleClose}>
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                    
                    {/* TEXT FIX: Added text-black to set the header text color */}
                    <h2 className='text-lg font-bold text-black'>{label}</h2>
                    
                </header>
                <section className='p-6'>
                    {content}
                </section>
            </div>
        </div>
    </div>
</div>
  )
}

export default Modals
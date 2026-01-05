import React, { useState } from 'react';

// 1. Định nghĩa "hình dáng" của Props
interface SearchFilterProps {
  onSearch: (keyword: string) => void; // Nghĩa là: onSearch là một hàm, nhận vào 1 string và không trả về gì (void)
}

// 2. Áp dụng Interface vào component
const SearchFilter = ({ onSearch }: SearchFilterProps) => {
  const [keyword, setKeyword] = useState('');

  const handleAction = () => {
    // Không cần check if(onSearch) nữa vì TS đảm bảo nó luôn tồn tại
    onSearch(keyword); 
  };

  return (
    <div className='group relative h-12 md:h-14 flex items-center border border-slate-700/50 rounded-full bg-slate-900/80 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] focus-within:shadow-[0_0_20px_rgba(99,102,241,0.2)] focus-within:border-indigo-500/50 transition-all duration-300 w-full overflow-hidden'>
        
        {/* Icon Search tinh tế hơn */}
        <div className='pl-5 pr-2 text-slate-500 group-focus-within:text-indigo-400 transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        {/* Input với font sạch hơn */}
        <input 
            type="text"
            className='flex-1 h-full bg-transparent outline-none text-slate-200 text-sm md:text-base placeholder:text-slate-500 font-medium px-2'
            placeholder='Bạn đánh rơi gì ở đâu...'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
        />
        
        {/* Nút Search thiết kế lại: Có Gradient và Hiệu ứng nhấn */}
        <div className='pr-1.5 shrink-0'>
            <button 
                onClick={handleAction}
                className='h-9 w-9 sm:h-11 sm:w-28 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 transition-all duration-200 font-bold shadow-lg shadow-indigo-900/20'
            >
                <span className='hidden sm:inline text-sm tracking-wide'>Tìm kiếm</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    </div>
  );
};

export default SearchFilter;
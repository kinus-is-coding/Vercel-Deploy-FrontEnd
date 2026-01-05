import React, { PropsWithChildren } from "react";
import LoginModal from "./modal/LoginModal";
import SignupModal from "./modal/SignupModal";
import AuthButtons from "./header/AuthButton";
import SearchFilterWrapper from "./header/SearchFilterWrapper";
import Link from "next/link"; 
export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* HEADER: Chống va chạm & Tối ưu Scale */}
     <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 py-3 relative">
          
          {/* Container chính: Điều phối Logo và Auth */}
          <div className="flex items-center justify-between h-10 sm:h-12">
            
            {/* 1. LOGO: Tự động thu gọn trên mobile cực nhỏ */}
            <Link href="/" className="shrink-0 transition-opacity hover:opacity-80 active:scale-95 transition-transform">
            <h1 className="text-sm sm:text-lg font-bold tracking-tight whitespace-nowrap bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              L&F <span className="hidden xs:inline">Identifier</span>
            </h1>
          </Link>

            {/* 2. AUTH BUTTONS: Luôn nằm bên phải, không bị đè */}
            <div className="flex items-center shrink-0 ml-2">
              <AuthButtons />
            </div>
          </div>

          {/* 3. SEARCH FILTER: Chiến thuật "Phòng thủ"
              - Mobile: Nằm dưới Logo (mt-2), chiếm full width.
              - Desktop (md): Bay lên giữa, dùng absolute để không chiếm không gian của Logo/Auth.
          */}
          <div className="mt-3 w-full md:mt-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[300px] lg:max-w-md transition-all duration-300">
            <SearchFilterWrapper />
          </div>
          
        </div>
      </header>

      {/* MAIN CONTENT: Fix lỗi tràn lề và padding */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
          {children}
        </div>
        
        {/* Modals giữ nguyên */}
        <LoginModal />
        <SignupModal />
      </main>

      {/* FOOTER: Responsive cho mobile */}
      <footer className="border-t border-slate-800 bg-slate-900/80 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Lost Item Identifier</p>
          <div className="flex gap-6 opacity-60">
            <span className="cursor-pointer hover:text-indigo-400">Privacy</span>
            <span className="cursor-pointer hover:text-indigo-400">Terms</span>
            <span className="cursor-pointer hover:text-indigo-400">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React, { PropsWithChildren } from "react";
import LoginModal from "./modal/LoginModal";
import SignupModal from "./modal/SignupModal";
import NotificationModal from "./modal/AnswerModal";
import AuthButtons from "./header/AuthButton";
import SearchFilterWrapper from "./header/SearchFilterWrapper";
import Link from "next/link";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden text-slate-50">
      
      {/* 🌊 WAVY BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-wave-bg" />
        <div className="absolute top-1/3 left-1/2 blob" />
      </div>

      {/* HEADER */}
      <header
        className="
          sticky top-0 z-50
          border-b border-white/5
          bg-slate-900/70
          backdrop-blur-xl
          supports-[backdrop-filter]:bg-slate-900/60
        "
      >
        <div className="max-w-7xl mx-auto px-4 py-5 relative">
          <div className="flex items-center justify-between h-10 sm:h-12">
            
            {/* LOGO */}
            <Link href="/" className="shrink-0 active:scale-95 transition">
              <h1
                className="
                  text-xl sm:text-lg font-bold tracking-tight
                  whitespace-nowrap
                  bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400
                  bg-clip-text text-transparent
                  animate-gradient
                "
              >
                TECHNOLOCK
              </h1>
            </Link>

            {/* AUTH */}
            <div className="flex items-center shrink-0 ml-2">
              <AuthButtons />
            </div>
          </div>

          {/* SEARCH (floating nhẹ) */}
          <div
            className="
              mt-3 w-full
              md:mt-0 md:absolute md:top-1/2 md:left-1/2
              md:-translate-x-1/2 md:-translate-y-1/2
              md:max-w-[300px] lg:max-w-md
            "
          >
            <SearchFilterWrapper />
          </div>
        </div>
        <div
        className="
          absolute inset-x-0 bottom-0 h-[2px]
          bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400
          bg-[length:200%_100%]
          animate-border-wave
        "
      />
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div
          className="
            mx-auto
            max-w-full md:max-w-10xl lg:max-w-full
            rounded-2xl
            bg-slate-900/60
            border border-white/5
            shadow-xl shadow-indigo-500/10
            p-6 md:p-8
            animate-fade-in
          "
        >
          {children}
        </div>

        <LoginModal />
        <SignupModal />
        <NotificationModal/>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-slate-900/70 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Eureka</p>
          <div className="flex gap-6">
            <span className="wave-link">Privacy</span>
            <span className="wave-link">Terms</span>
            <span className="wave-link">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

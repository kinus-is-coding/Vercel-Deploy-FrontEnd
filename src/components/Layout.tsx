import React, { PropsWithChildren } from "react";
import SearchFilter from "./header/SearchFilter";
import LoginModal from "./modal/LoginModal";
import SignupModal from "./modal/SignupModal";
import AuthButtons from "./header/AuthButton";
import SearchFilterWrapper from "./header/SearchFilterWrapper";
export default function Layout({ children }: PropsWithChildren) {
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="px-4 py-4 flex items-center justify-between">
                <h1 className="text-lg wfont-semibold tracking-tight">
                  Lost Item Identifier
                </h1>
                <SearchFilterWrapper />

                <div className="flex items-center space-x-4">
                    <AuthButtons/>
                </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">
        {children}
        <LoginModal/>
        <SignupModal/>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/80">
        <div className="mx-auto max-w-3xl px-4 py-4 text-xs text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} Lost Item Identifier</span>
          <span>For demo use only</span>
        </div>
      </footer>
    </div>
  );
}
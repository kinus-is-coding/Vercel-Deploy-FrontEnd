// src/components/header/SearchFilterWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import SearchFilter from "./SearchFilter";
import { useRouter } from "next/navigation";
export default function SearchFilterWrapper() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const allowedPaths = ["/", "/items", "/feed"];
  const shouldShow = allowedPaths.includes(pathname);

  if (!shouldShow) return null;

  const handleSearch = (keyword: string) => {
    // Đẩy từ khóa lên URL để trang con nhận được
    if (keyword.trim()) {
      router.push(`/?q=${encodeURIComponent(keyword)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full">
       <SearchFilter onSearch={handleSearch} />
    </div>
  );
}
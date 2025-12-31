// src/components/header/SearchFilterWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import SearchFilter from "./SearchFilter";

export default function SearchFilterWrapper() {
  const pathname = usePathname();

  // DANH SÁCH CÁC TRANG CHO PHÉP HIỆN FILTER (Bro thêm bớt ở đây)
  const allowedPaths = [
    "/",          // Trang chủ
    "/items",     // Trang danh sách món đồ
    "/feed"       // Trang feed
  ];

  // Kiểm tra xem pathname hiện tại có nằm trong danh sách không
  const shouldShow = allowedPaths.includes(pathname);

  if (!shouldShow) return null;

  return (
    <div className="flex-1 max-w-md mx-4 transition-all duration-300">
       <SearchFilter />
    </div>
  );
}
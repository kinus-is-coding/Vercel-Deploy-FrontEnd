"use client";
import { useNotificationStore } from "@/hooks/useResultModal";
import { useRouter } from "next/navigation";
import Modals from "./Modals";

export default function ResultNotificationModal() {
  const router = useRouter();
  const { isOpen, type, title, message, lockerId, onAction, closeNotification } = useNotificationStore();

  // Tạo một hàm đóng "tổng lực"
  const handleCloseAndRedirect = () => {
    closeNotification(); // Tắt modal trên giao diện
    router.push("/");    // Đẩy user về trang chủ ngay lập tức
  };

  return (
    <Modals
      isOpen={isOpen}
      label={title}
      // Bất kể bấm vào dấu X hay bấm ra ngoài vùng mờ (backdrop), nó đều gọi hàm này
      close={handleCloseAndRedirect} 
      content={
        <div className="flex flex-col items-center text-center space-y-6 py-2">
          <div className="text-6xl animate-bounce">
            {type === 'success' ? "✅" : "❌"}
          </div>
          
          <div className="space-y-1">
             <h3 className={`text-xl font-bold ${type === 'success' ? 'text-indigo-400' : 'text-red-400'}`}>
                {title}
             </h3>
             <p className="text-slate-400 text-sm px-4">{message}</p>
          </div>

          {/* Hiển thị mã tủ nếu thành công */}
          {type === 'success' && lockerId && (
            <div className="group relative w-full px-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25"></div>
              <div className="relative flex flex-col items-center bg-slate-900 border border-white/10 py-6 rounded-2xl">
                <span className="text-[12px] text-white uppercase tracking-widest mb-1">Mã số ngăn tủ</span>
                <span className="text-5xl font-black text-white">{lockerId}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col w-full gap-3 px-2 pt-4">
            {type === 'success' ? (
              <button 
                onClick={async () => { 
                  if(onAction) await onAction(); // Gọi hàm PATCH để mở tủ thật
                  // Sau khi mở xong, ta có thể để user tự đóng hoặc tự redirect
                  handleCloseAndRedirect()
                }}
                className="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                MỞ TỦ NGAY
              </button>
            ) : (
              <button 
                onClick={handleCloseAndRedirect} // Bấm nút này cũng về trang chủ
                className="w-full py-4 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all"
              >
                QUAY LẠI TRANG CHỦ
              </button>
            )}
          </div>
        </div>
      }
    />
  );
}
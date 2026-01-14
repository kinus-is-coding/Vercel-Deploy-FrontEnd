"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Quiz, { type QuizQuestion, type QuizResult } from "@/components/Quiz"; 
import Modals from "@/components/modal/Modals";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.quizId; 

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [lockerId, setLockerId] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

  useEffect(() => {
    if (!postId) return;
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) throw new Error("Không tìm thấy bài đăng");
        const data = await res.json();  

        const mappedQuestions: QuizQuestion[] = data.quiz_questions.map((q: any, index: number) => ({
          id: q.id ? q.id.toString() : index.toString(), 
          text: q.question_text,
          choices: q.choices_json,
          correctChoiceId: q.correct_choice_id,
        }));

        setQuizQuestions(mappedQuestions);
        if (typeof data.locker === 'object' && data.locker !== null) {
          setLockerId(String(data.locker.locker || "N/A"));
        } else {
          setLockerId(String(data.locker || "N/A"));
        }
        setStatus("loaded");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }
    fetchQuiz();
  }, [postId]);

  const handleResult = async ({ score, total }: QuizResult) => {
    if (score === total) {
      setIsCorrect(true);
      setModalData({
        title: "Xác minh thành công! ✔",
        message: "Chính xác 100%! Bạn đã xác minh đúng chủ sở hữu",
        type: "success"
      });

     
    } else {
      setIsCorrect(false);
      setModalData({
        title: "Xác minh thất bại ❌",
        message: `Bạn trả lời đúng ${score}/${total}. Thông tin chưa khớp, vui lòng thử lại sau.`,
        type: "error"
      });
    }
    setIsModalOpen(true);
  };
  const handleFinalUnlock = async () => {
  try {
 
    const res = await fetch(`/api/posts/${postId}/complete/`, { 
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      alert("Tủ đồ đang mở! Hãy lấy đồ và đóng cửa tủ lại.");
      setIsModalOpen(false);
      router.push('/');
    } else {
      alert("Có lỗi xảy ra khi kết nối với tủ đồ.");
    }
  } catch (err) {
    console.error("Lỗi xác nhận:", err);
  }
};

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium">Đang tải câu hỏi xác minh...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border border-red-900/50 bg-red-900/10 rounded-2xl text-center">
        <p className="text-red-400 font-bold text-lg">Lỗi rồi! Không tìm thấy Quiz.</p>
        <button onClick={() => router.push("/")} className="mt-6 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full transition-all">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-8">
      <header className="text-center md:text-left space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Xác minh <span className="text-indigo-400">chủ sở hữu</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Vui lòng trả lời đúng tất cả câu hỏi để xác nhận đây là món đồ của bạn.
        </p>
      </header>

      <Quiz questions={quizQuestions} onResult={handleResult} />

      <Modals
  isOpen={isModalOpen}
  label={modalData.title}
  close={() => {
    setIsModalOpen(false);
    router.push('/');

  }}
  content={(
    <div className="flex flex-col items-center text-center space-y-6 py-2">
      {/* Icon trạng thái */}
      
      
      <div className="space-y-1">
        
        <p className="text-slate-400 text-sm px-4">
          {modalData.message}
        </p>
      </div>
      <div className="text-6xl">
        {modalData.type === 'success' ? "🚀" : "🔒"}
      </div>

      {/* CHỈ HIỆN LOCKER ID KHI ĐÚNG */}
      {isCorrect && (
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex flex-col items-center bg-slate-900 border border-slate-800 px-10 py-6 rounded-2xl">
            <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mb-1">Mã số ngăn tủ</span>
            <span className="text-5xl font-black text-white tracking-tighter shadow-indigo-500">
              {lockerId}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col w-full gap-3 px-2 pt-4">
        {isCorrect ? (
          <>
            <button 
              onClick={handleFinalUnlock}
              className="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              MỞ TỦ NGAY

            </button>
            <button 
              onClick={() => { setIsModalOpen(false); router.push('/'); }}
              className="py-2 text-slate-500 text-xs hover:text-slate-300 transition-colors uppercase tracking-widest"
            >
              Về trang chủ
            </button>
          </>
        ) : (
          <button 
            onClick={() => { setIsModalOpen(false); router.push('/'); }}
            className="w-full py-4 rounded-2xl font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all"
          >
            QUAY LẠI
          </button>
        )}
      </div>
    </div>
  )}
/>
    </div>
  );
}
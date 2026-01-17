"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Quiz, { type QuizQuestion, type QuizResult } from "@/components/Quiz"; 
import { useNotificationStore } from "@/hooks/useResultModal";
export default function QuizPage() {
  const openNotification = useNotificationStore((state) => state.openNotification);
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
          setLockerId(String(data.locker.locker_id || "N/A"));
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
  // 1. Trường hợp trả lời SAI
    if (score !== total) {
      setIsCorrect(false);
      openNotification({
        type: 'error',
        title: "Xác minh thất bại ❌",
        message: `Bạn trả lời đúng ${score}/${total}. Vui lòng thử lại.`
      }); 
      return; // Dừng luôn không chạy tiếp
    }

    // 2. Trường hợp trả lời ĐÚNG -> Gọi API addlocker ngay lập tức
    try {
      const res = await fetch('/api/addlock/', { 
        method: 'POST',
       
        body: JSON.stringify({ post_id: postId })
      });

      if (res.ok) {
        // API Backend đã add_locker thành công
        setIsCorrect(true);
        openNotification({
          type: 'success',
          title: "Xác minh thành công! ✔",
          message: "Chìa khóa ảo đã được cấp cho bạn.",
          lockerId: lockerId,
          onAction: handleFinalUnlock // Hàm này sẽ được gọi khi bấm nút trong Modal
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.details || "Không thể cấp quyền truy cập tủ.");
      }
    } catch (err: any) {
      console.error("Lỗi addlock:", err);
      setIsCorrect(false);
      openNotification({
        title: "Lỗi hệ thống ⚠️",
        message: err.message || "Có lỗi khi nhận chìa khóa, vui lòng thử lại.",
        type: "error"
      });
    } finally {
      // Cuối cùng mới mở Modal để thông báo kết quả
      setIsModalOpen(true);
    }
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

      
    </div>
  );
}
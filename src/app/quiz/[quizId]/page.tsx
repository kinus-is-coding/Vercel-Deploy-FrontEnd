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
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      setModalData({
        title: "Xác minh thành công! ✔",
        message: "Chính xác 100%! Bạn đã xác minh đúng chủ sở hữu. Tủ đồ đang được mở.",
        type: "success"
      });

      try {
        const res = await fetch(`/api/posts/${postId}/complete/`, { 
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) console.log("Đã Deactive bài đăng!");
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      }
    } else {
      setModalData({
        title: "Xác minh thất bại ❌",
        message: `Bạn trả lời đúng ${score}/${total}. Thông tin chưa khớp, vui lòng thử lại sau.`,
        type: "error"
      });
    }
    setIsModalOpen(true);
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
          if (modalData.type === 'success') router.push('/');
        }}
        content={(
          <div className="flex flex-col items-center text-center space-y-6 py-4">
            <div className={`text-6xl animate-bounce`}>
              {modalData.type === 'success' ? "🔓" : "🔒"}
            </div>
            
            <div className="space-y-2">
              <h2 className={`text-xl font-bold ${modalData.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {modalData.title}
              </h2>
              <p className="text-slate-600 font-medium px-4">
                {modalData.message}
              </p>
            </div>

            <button 
              onClick={() => {
                setIsModalOpen(false);
                router.push('/');
              }}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                modalData.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-200'
              }`}
            >
              Về Trang Chủ
            </button>
          </div>
        )}
      />
    </div>
  );
}
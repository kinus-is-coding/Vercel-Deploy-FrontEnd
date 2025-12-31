"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// Kiểm tra đường dẫn này xem có đúng chỗ file Quiz.tsx của bro không
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
        console.log(postId);
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) throw new Error("Không tìm thấy bài đăng");
        
        const data = await res.json();  

        const mappedQuestions: QuizQuestion[] = data.quiz_questions.map((q: any, index: number) => ({
          // Nếu q.id không có thì dùng index làm ID tạm
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
      // 1. Set nội dung Modal thành công
      setModalData({
        title: "Xác minh thành công! ✔",
        message: "Chính xác 100%! Tủ đồ đang được mở, món đồ đã được gỡ khỏi danh sách.",
        type: "success"
      });

      // 2. GỬI LỆNH XUỐNG BACKEND ĐỂ SET IS_ACTIVE = FALSE
      try {
        // Lưu ý: Thêm dấu / ở cuối complete/ cho đúng chuẩn Django
        const res = await fetch(`/api/posts/${postId}/complete/`, { 
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (res.ok) {
          console.log("Đã Deactive bài đăng thành công!");
        } else {
          console.error("Lỗi từ server khi deactive");
        }
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      }

    } else {
      // 3. Trường hợp trả lời sai
      setModalData({
        title: "Tiếc quá! ❌",
        message: `Bạn chỉ trả lời đúng ${score}/${total} câu. Vui lòng kiểm tra lại thông tin nhé!`,
        type: "error"
      });
    }

    // Cuối cùng mới mở Modal lên
    setIsModalOpen(true);
  };

  // --- PHẦN HIỂN THỊ (GIAO DIỆN) ---

  if (status === "loading") return <div className="p-10 text-white">Đang tải câu hỏi...</div>;

  if (status === "error") return (
    <div className="p-10 text-white">
      <p>Lỗi rồi! Không tìm thấy Quiz cho món đồ này.</p>
      <button onClick={() => router.push("/")} className="mt-4 bg-sky-500 p-2 rounded">Quay lại</button>
    </div>
  );

  

 return (
  <div className="max-w-2xl mx-auto p-6 space-y-6">
    <header>
      <h1 className="text-2xl font-bold text-white">Xác minh chủ sở hữu</h1>
      <p className="text-slate-400 text-sm">Trả lời đúng các câu hỏi sau để mở tủ.</p>
    </header>

    <Quiz questions={quizQuestions} onResult={handleResult} />

    {/* Dùng cái Modal "nhà làm" của bro ở đây */}
    <Modals
      isOpen={isModalOpen}
      label={modalData.title}
      close={() => {
          setIsModalOpen(false);
          router.push('/');
      }}
      content={(
        <div className="flex flex-col items-center text-center space-y-4 py-2">
           <div className={`text-5xl ${modalData.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {modalData.type === 'success' ? "🔓" : "🔒"}
           </div>
           
           <p className="text-slate-800 text-lg font-medium">
             {modalData.message}
           </p>

           <div className="flex w-full gap-3 mt-4">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  router.push('/');
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-white ${
                  modalData.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-500 hover:bg-slate-600'
                }`}
              >
              {modalData.type = "Về Trang Chủ"}
              </button>
           </div>
        </div>
      )}
    />
  </div>
);
}
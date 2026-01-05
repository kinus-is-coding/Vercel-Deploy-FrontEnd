import { NextResponse,NextRequest } from "next/server";
import { type Feature, type QuizQuestion } from "../../../lib/sessionStore";
import { QUIZ_GENERATION_PROMPT } from "../../../lib/aiPrompts";

import OpenAI from "openai";

interface CreateQuizBody {
  features: Feature[];
  objectType?: string;
}

function buildMockQuestions(features: Feature[]): QuizQuestion[] {
  const base = features.slice(0, 3);

  return base.map((feature, index) => {
    const id = `q${index + 1}`;
    const lower = feature.toLowerCase();

    let text = `Which detail best matches this item? (${feature})`;
    const choices = [feature];

    if (lower.includes("left") || lower.includes("right")) {
      text = "Which side is described as different?";
      choices.splice(0, choices.length, "Left", "Right", "Both", "Neither");
    } else if (lower.includes("black") || lower.includes("blue") || lower.includes("red")) {
      text = "What is the main color of the item?";
      choices.splice(0, choices.length, "Black", "Blue", "Red", "Other");
    } else if (lower.includes("scratch") || lower.includes("crack")) {
      text = "What kind of damage does the item have?";
      choices.splice(0, choices.length, "Scratch", "Crack", "Dent", "No visible damage");
    } else {
      while (choices.length < 4) {
        choices.push(`${feature} (slightly different)`);
      }
    }

    const correctChoiceText = choices[0];

    return {
      id,
      text,
      choices: choices.map((c, i) => ({ id: String.fromCharCode(97 + i), text: c })),
      correctChoiceId: "a",
    } satisfies QuizQuestion;
  });
}

// Placeholder for an AI-powered quiz generator.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", 
});

async function generateQuizWithAI(features: Feature[], objectType?: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const payload = { features, objectType };

  // 1. Sửa openai.responses.create thành openai.chat.completions.create
  const response = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: QUIZ_GENERATION_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify(payload),
      },
    ],
    response_format: { type: "json_object" } // Ép AI trả về JSON chuẩn
  });

  const text = response.choices[0].message.content;

  if (!text) {
    throw new Error("AI trả về nội dung trống");
  }

  const parsed = JSON.parse(text) as { questions: QuizQuestion[] };
  return parsed.questions;
}



function validateQuiz(questions: QuizQuestion[]) {
  if (!Array.isArray(questions) || questions.length < 3) {
    throw new Error("Quiz must have at least 3 questions");
  }

  questions.forEach((q, i) => {
    if (!q.id || !q.text) {
      throw new Error(`Question ${i} missing id or text`);
    }

    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      throw new Error(`Question ${q.id} must have at least 2 choices`);
    }

    if (!q.choices.some(c => c.id === q.correctChoiceId)) {
      throw new Error(`Question ${q.id} has invalid correctChoiceId`);
    }
  });
}

export async function POST(request: NextRequest) {
  
  const lockerId = request.nextUrl.searchParams.get('locker')
  
  
  const body = (await request.json().catch(() => null)) as
    | CreateQuizBody
    | null;

  if (!body || !Array.isArray(body.features) || body.features.length === 0) {
    return NextResponse.json(
      { error: "features array is required" },
      { status: 400 },
    );
  }


  const useMock =process.env.USE_MOCK_AI === "true" || !process.env.GROQ_API_KEY;

  let questions: QuizQuestion[];

  try {
    questions = useMock
      ? buildMockQuestions(body.features)
      : await generateQuizWithAI(body.features, body.objectType);

    validateQuiz(questions); 
  } catch (err) {
    console.error("Quiz generation failed → fallback mock", err);
    questions = buildMockQuestions(body.features);
  }

  const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL;
  const DJANGO_POST_CREATE_URL = `${DJANGO_API_BASE_URL}/posts/`; 

  const DRF_DATA = {
      // Map features to your DRF Post fields
      title: body.features.find(f => f.startsWith('Item:'))?.split(': ')[1] || 'Lost Item',
      location: body.features.find(f => f.startsWith('Location:'))?.split(': ')[1] || 'Unknown Location',
      image_url: '', 
      questions: questions, 
      locker: lockerId, 
  };

  try {
      const djangoRes = await fetch(DJANGO_POST_CREATE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DRF_DATA),
      });

      const responseData = await djangoRes.json().catch(() => ({}));

      if (!djangoRes.ok) {

          // 1. Nếu Backend trả về lỗi do trùng Locker (Status 400)
          if (djangoRes.status === 400) {
              // Lấy message lỗi từ Django (cái "error" mình set trong Response ở views.py)
              const errorMessage = responseData.error || "Locker is currently occupied.";
              
              return NextResponse.json({ 
                  error: "Locker Occupied",
                  message: errorMessage 
              }, { status: 400 }); 
          }
          
          // 2. Các lỗi Django khác
          return NextResponse.json({ 
              error: "Django Error", 
              message: "Không thể tạo bài đăng trên hệ thống." 
          }, { status: djangoRes.status });
      }

      return NextResponse.json({ 
        quizId: responseData.id, 
        message: "Tạo bài đăng thành công!"
      });

  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
        { error: "Internal server error", message: "Lỗi kết nối proxy." },
        { status: 500 },
    );
  }
}

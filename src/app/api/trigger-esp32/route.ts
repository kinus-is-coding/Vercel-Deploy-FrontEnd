import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { quizId } = body;

  if (!quizId) {
    return NextResponse.json({ error: "Missing quizId" }, { status: 400 });
  }

  const ESP32_URL = "http://192.168.x.x/trigger"; // <-- update to ESP32 IP

  try {
    const res = await fetch(ESP32_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId }),
    });

    if (!res.ok) {
      throw new Error("ESP32 error");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ESP32 unreachable:", err);
    return NextResponse.json({ error: "ESP32 unreachable" }, { status: 500 });
  }
}

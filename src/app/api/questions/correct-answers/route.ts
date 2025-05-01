// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization");

  // 1. Authorization check
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { question_ids } = body;

  // 3. Validate question_ids
  if (!Array.isArray(question_ids) || question_ids.length === 0) {
    return NextResponse.json({ message: "question_ids must be a non-empty array" }, { status: 400 });
  }

  // 4. Call the backend API
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/correct-answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({ question_ids }),
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Error forwarding to backend:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


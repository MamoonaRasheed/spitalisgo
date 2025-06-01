// app/api/store-answers/route.ts
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

  // 3. Validate essential fields
  if (!body.exercise_id || !Array.isArray(body.answers)) {
    return NextResponse.json(
      { message: "Missing or invalid 'exercise_id' or 'answers'" },
      { status: 400 }
    );
  }

  // 4. Proxy request to backend
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error: any) {
    console.error("Backend request failed:", error);
    return NextResponse.json(
      { message: "Failed to communicate with backend service" },
      { status: 500 }
    );
  }
}

// app/api/store-answers/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization");

  // 1. Authorization check
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-answers`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();
console.log(data,"data");
  return NextResponse.json(data, { status: backendResponse.status });
}
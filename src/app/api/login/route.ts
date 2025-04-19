// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",    
    },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();

  return NextResponse.json(data, { status: backendResponse.status });
}
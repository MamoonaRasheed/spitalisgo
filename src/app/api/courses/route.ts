// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await backendResponse.json();

  return NextResponse.json(data, { status: backendResponse.status });
}


// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  // Extract query parameters
  const searchParams = req.nextUrl.searchParams;
  const chapter_id = searchParams.get('chapter_id');

  // Build the backend URL with query params
  const backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/excercises`);
  
  if (chapter_id) backendUrl.searchParams.append('chapter_id', chapter_id);

  const backendResponse = await fetch(backendUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  const data = await backendResponse.json();

  return NextResponse.json(data, { status: backendResponse.status });
}

// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Extract query parameters
  const searchParams = req.nextUrl.searchParams;
  const exam = searchParams.get('exam');
  const course = searchParams.get('course');
  const category = searchParams.get('category');

  // Build the backend URL with query params
  const backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/chapters`);
  
  if (exam) backendUrl.searchParams.append('exam', exam);
  if (course) backendUrl.searchParams.append('course', course);
  if (category) backendUrl.searchParams.append('category', category);

  const backendResponse = await fetch(backendUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await backendResponse.json();

  return NextResponse.json(data, { status: backendResponse.status });
}

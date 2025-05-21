// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  // Extract query parameters
  const searchParams = req.nextUrl.searchParams;
  const token = req.headers.get("authorization");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }


  // Build the backend URL with query params

  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/all-exercises`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  });

  const data = await backendResponse.json();

  return NextResponse.json(data, { status: backendResponse.status });
}

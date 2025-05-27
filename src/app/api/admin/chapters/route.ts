// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface BackendResponse {
  status: boolean;
  data: Array<{
    id: number;
    title: string;
    // Add other chapter properties as needed
  }>;
  message?: string;
}

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get('exam');
    const course = searchParams.get('course');
    const category = searchParams.get('category');
    const page = searchParams.get('page');
    const token = req.headers.get("authorization");

    // Validate backend URL
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API base URL is not configured');
    }

    // Build the backend URL with query params
    const backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/chapters`);
    
    if (exam) backendUrl.searchParams.append('exam', exam);
    if (course) backendUrl.searchParams.append('course', course);
    if (category) backendUrl.searchParams.append('category', category);
    if (page) backendUrl.searchParams.append('page', page);

    const backendResponse = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: 'no-store' // Recommended for API routes
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { status: false, message: errorData.message || 'Backend request failed' },
        { status: backendResponse.status }
      );
    }

    const data: BackendResponse = await backendResponse.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Proxy API error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
// app/api/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = req.nextUrl.searchParams;
    const chapter_id = searchParams.get('chapter_id');
    const page = searchParams.get('page');
    const token = req.headers.get("authorization");

    // Validate backend URL
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API base URL is not configured');
    }

    // Build the backend URL with query params
    const backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/excercises`);
    if (chapter_id) backendUrl.searchParams.append('chapter_id', chapter_id);
    if (page) backendUrl.searchParams.append('page', page);

    const backendResponse = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { status: false, message: errorData.message || 'Failed to fetch exercises' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('GET exercises error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API base URL is not configured');
    }

    const requestData = await req.json();
    const token = req.headers.get("authorization");
    // Validate required fields
    if (!requestData.excercise_type_id || !requestData.chapter_id || !requestData.title || !requestData.exercise_no) {
      return NextResponse.json(
        { status: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/excercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestData),
    });

    // First check if the response is JSON
    const contentType = backendResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await backendResponse.text();
      throw new Error(`Unexpected response: ${text.substring(0, 100)}...`);
    }

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          status: false, 
          message: data.message || `Backend error: ${backendResponse.statusText}` 
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('POST exercise error:', error);
    return NextResponse.json(
      { 
        status: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
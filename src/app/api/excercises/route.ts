import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const chapter_id = searchParams.get('chapter_id');
    const slug = searchParams.get('slug');

    let backendUrl: URL;

    if (slug) {
      backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/excercises/${slug}`);
    } else {
      backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/excercises`);
      if (chapter_id) backendUrl.searchParams.append('chapter_id', chapter_id);
    }

    const token = req.headers.get('authorization'); // ← Extract incoming token

    const backendResponse = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }), // ← Forward token if present
      },
    });

    const data = await backendResponse.json();
    

    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();

  console.log('here proxy ma aya----------------', data);

  if (data.code === 'INACTIVE_USER') {
    return NextResponse.json(
      { message: data.message, code: data.code },
      { status: 401 }
    );
  }

  if (data.code && backendResponse.status >= 400) {
    return NextResponse.json(
      { message: data.message, code: data.code },
      { status: backendResponse.status }
    );
  }

  return NextResponse.json(data, { status: backendResponse.status });
}

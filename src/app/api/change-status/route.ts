// app/api/change-status/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const currentStatus = searchParams.get('currentStatus');

    if (!id || !currentStatus) {
      return NextResponse.json({ message: 'Missing id or currentStatus' }, { status: 400 });
    }

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/status/${newStatus}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // 👈 Add this
      },
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

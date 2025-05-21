// app/api/tasks/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ slug: string }> }
    ) 
{
    try {
        const { slug} = await params;

        if (!slug) {
            return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            return NextResponse.json({ message: 'API URL not defined' }, { status: 500 });
        }

        const backendUrl = `${apiUrl}/tasks/${slug}`;

        const backendResponse = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await backendResponse.json();

        return NextResponse.json(data, { status: backendResponse.status });

    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

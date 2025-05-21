// app/api/correct-answers/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Get the token from authorization header
    const token = req.headers.get("authorization");
console.log(token,"tokeninapi");
    // 1. Authorization check
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the request body (answers to check)
    const body = await req.json();

    // 2. Make a request to the backend API to check answers
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-result`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,  // Include the token in the request header
        },
        body: JSON.stringify(body), // Send the request body to the backend
    });

    // Parse the response from the backend
    const data = await backendResponse.json();
    
    // Log the response for debugging
    console.log(data, "data from backend");

    // Return the response to the client
    return NextResponse.json(data, { status: backendResponse.status });
}

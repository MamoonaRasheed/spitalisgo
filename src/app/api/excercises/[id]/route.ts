// app/api/exercises/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validate environment and parameters
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API base URL is not configured');
    }

    const exerciseId = params.id;
    if (!exerciseId || isNaN(Number(exerciseId))) {
      return NextResponse.json(
        { status: false, message: 'Invalid exercise ID' },
        { status: 400 }
      );
    }

    // 2. Get authorization token
    const token = req.headers.get("authorization"); // Extract token from "Bearer <token>"
    
    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      );
    }

    // 3. Make request to backend API
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/excercises/${exerciseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        cache: 'no-store'
      }
    );

    // 4. Handle response
    const contentType = backendResponse.headers.get('content-type');
    
    // Check if response is JSON
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

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('GET exercise error:', error);
    return NextResponse.json(
      { 
        status: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      // 1. Validate environment and parameters
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API base URL is not configured');
      }
  
      const exerciseId = params.id;
      if (!exerciseId || isNaN(Number(exerciseId))) {
        return NextResponse.json(
          { status: false, message: 'Invalid exercise ID' },
          { status: 400 }
        );
      }
  
      // 2. Get request data and token
      const requestData = await req.json();
      const token = req.headers.get("authorization"); // Extract token from "Bearer <token>"
  
      if (!token) {
        return NextResponse.json(
          { status: false, message: 'Authorization token is required' },
          { status: 401 }
        );
      }
  
      // 3. Validate required fields
      const missingFields = [];
      if (!requestData.excercise_type_id) missingFields.push('excercise_type_id');
      if (!requestData.chapter_id) missingFields.push('chapter_id');
      if (!requestData.title) missingFields.push('title');
      if (!requestData.exercise_no) missingFields.push('exercise_no');
  
      if (missingFields.length > 0) {
        return NextResponse.json(
          { 
            status: false, 
            message: 'Missing required fields',
            missingFields 
          },
          { status: 400 }
        );
      }
  
      // 4. Prepare the payload
      const payload = {
        excercise_type_id: requestData.excercise_type_id,
        chapter_id: requestData.chapter_id,
        exercise_no: requestData.exercise_no,
        title: requestData.title,
        description: requestData.description || null,
        sort: requestData.sort || 0,
        status: requestData.status ?? true
      };
  
      // 5. Make the PATCH request to backend
      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/excercises/${exerciseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        }
      );
  
      // 6. Handle the response
      const responseText = await backendResponse.text();
      
      try {
        const data = JSON.parse(responseText);
        
        if (!backendResponse.ok) {
          return NextResponse.json(
            { 
              status: false, 
              message: data.message || `Backend error: ${backendResponse.statusText}`,
              details: data.details || null
            },
            { status: backendResponse.status }
          );
        }
        
        return NextResponse.json(data, { status: 200 });
        
      } catch (jsonError) {
        console.error('Failed to parse backend response:', responseText);
        return NextResponse.json(
          { 
            status: false, 
            message: `Unexpected response from backend (status ${backendResponse.status})`,
            details: responseText.includes('<!DOCTYPE html>') 
              ? 'Received HTML error page instead of JSON' 
              : responseText.substring(0, 200)
          },
          { status: 502 } // Bad Gateway
        );
      }
  
    } catch (error) {
      console.error('PATCH exercise error:', error);
      return NextResponse.json(
        { 
          status: false, 
          message: error instanceof Error ? error.message : 'Internal server error',
          stack: process.env.NODE_ENV === 'development' 
            ? error instanceof Error ? error.stack : null 
            : undefined
        },
        { status: 500 }
      );
    }
}
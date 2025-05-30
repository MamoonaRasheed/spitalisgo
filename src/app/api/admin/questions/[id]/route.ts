// app/api/exercises/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;

    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API base URL is not configured');
    }

    if (!questionId || isNaN(Number(questionId))) {
      return NextResponse.json(
        { status: false, message: 'Invalid Question ID' },
        { status: 400 }
      );
    }

    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/questions/${questionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        cache: 'no-store'
      }
    );

    const contentType = backendResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await backendResponse.text();
      throw new Error(`Unexpected response: ${text}...`);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    if (!questionId || isNaN(Number(questionId))) {
      return NextResponse.json(
        { status: false, message: 'Invalid question ID' },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API base URL is not configured');
    }

    const requestData = await req.json();
    const token = req.headers.get('authorization');

    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const { exercise_id, status, description, excercise_type, questions } = requestData;

    // Basic validation
    if (!exercise_id || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          status: false,
          message: 'Missing required fields: exercise_id and questions',
        },
        { status: 400 }
      );
    }

    // Further question validation
    const questionErrors: string[] = [];
    questions.forEach((q, index) => {
      if (!q.description) questionErrors.push(`Question ${index + 1} is missing description.`);
      if (!q.question_type_id) questionErrors.push(`Question ${index + 1} is missing question_type_id.`);

      if (q.question_type_id === 3) {
        if (!q.correctOption || typeof q.correctOption !== 'string') {
          questionErrors.push(`Question ${index + 1} requires a text correctOption.`);
        }
      } else {
        if (!Array.isArray(q.options) || q.options.length === 0) {
          questionErrors.push(`Question ${index + 1} is missing options.`);
        }
        if (typeof q.correctOption === 'undefined' || q.correctOption === null) {
          questionErrors.push(`Question ${index + 1} is missing correctOption index.`);
        }
      }
    });

    if (questionErrors.length > 0) {
      return NextResponse.json(
        {
          status: false,
          message: 'Validation failed',
          errors: questionErrors,
        },
        { status: 422 }
      );
    }

    // Prepare the payload for Laravel backend
    const payload = {
      excercise_id: exercise_id,
      status,
      description,
      excercise_type,
      questions: questions.map((q) => ({
        description: q.description,
        question_type_id: q.question_type_id,
        correctOption: q.correctOption,
        options: q.question_type_id === 3
        ? []
        : q.options.map((opt: string | { description: string }) =>
            typeof opt === 'string'
              ? opt.trim()
              : (opt.description ?? '').trim()
          ),
      })),
    };

    console.log('Payload:', JSON.stringify(payload));

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/questions/${questionId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await backendResponse.text();
    try {
      const data = JSON.parse(text);

      if (!backendResponse.ok) {
        return NextResponse.json(
          {
            status: false,
            message: data.message || 'Backend update failed',
            errors: data.errors || null,
          },
          { status: backendResponse.status }
        );
      }

      return NextResponse.json(data, { status: 200 });
    } catch (err) {
      return NextResponse.json(
        {
          status: false,
          message: 'Invalid JSON returned from backend',
          raw: text.slice(0, 200),
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('PATCH question error:', error);
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : 'Unexpected error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;

    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API base URL is not configured');
    }

    if (!questionId || isNaN(Number(questionId))) {
      return NextResponse.json(
        { status: false, message: 'Invalid question ID' },
        { status: 400 }
      );
    }

    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/questions/${questionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

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
          message: data.message || `Backend error: ${backendResponse.statusText}`,
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: 'Question deleted successfully',
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE question error:', error);
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

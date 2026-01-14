import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Get all schedules from the current user, sorted by created_at descending
    const { data: mySchedules, error: myError } = await supabase
      .from('schedule')
      .select('id, title, company, role, created_at')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (myError) {
      console.error('Error fetching user schedules:', myError);
      return NextResponse.json(
        { error: "Failed to fetch user schedules", details: myError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ schedules: mySchedules || [] });
  } catch (error) {
    console.error("Error getting my interviews:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while getting interviews",
      },
      { status: 500 }
    );
  }
}

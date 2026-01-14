import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { schedule_id, email } = await request.json();

    // Validate required fields
    if (!schedule_id || !email) {
      return NextResponse.json(
        { error: "Schedule ID and email are required" },
        { status: 400 }
      );
    }

    // Insert into schedule_bid table
    const { data, error } = await supabase
      .from('schedule_bid')
      .insert([
        {
          schedule_id: schedule_id,
          email: email,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: "Failed to save bid", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error saving bid:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while saving the bid",
      },
      { status: 500 }
    );
  }
}

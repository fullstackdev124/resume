import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function PUT(request: NextRequest) {
  try {
    const { id, title, company, role } = await request.json();

    // Validate required fields
    if (!id || !title || !company) {
      return NextResponse.json(
        { error: "ID, title, and company are required" },
        { status: 400 }
      );
    }

    // Update the schedule
    const { data, error } = await supabase
      .from('schedule')
      .update({
        title: title,
        company: company,
        role: role || null,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: "Failed to update schedule", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while updating the schedule",
      },
      { status: 500 }
    );
  }
}

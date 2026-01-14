import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { email, title, company, role } = await request.json();

    // Validate required fields
    if (!email || !title || !company) {
      return NextResponse.json(
        { error: "Email, title, and company are required" },
        { status: 400 }
      );
    }

    // Insert into schedule table
    const { data, error } = await supabase
      .from('schedule')
      .insert([
        {
          email: email,
          title: title,
          company: company,
          role: role || null,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: "Failed to save schedule", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while saving the schedule",
      },
      { status: 500 }
    );
  }
}

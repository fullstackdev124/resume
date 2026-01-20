import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { json, identifier, description, username } = await request.json();

    if (!json) {
      return NextResponse.json(
        { error: "JSON data is required" },
        { status: 400 }
      );  
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase credentials are not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Extract email (part before @) from resume data
    let emailPrefix = ''
    if (json?.email) {
      const emailParts = json.email.split('@')
      emailPrefix = emailParts[0] || ''
    }

    const tableName = username && username !== 'local' ? 'resume_data_bidder' : 'resume_data'

    // Insert the resume JSON data into the table
    const { data, error } = await supabase
      .from(tableName)
      .insert([
        { 
          data: json,
          email: emailPrefix,
          identifier: identifier || null,
          description: description || null
        }
      ])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: "Failed to save resume data", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error saving resume:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while saving the resume",
      },
      { status: 500 }
    );
  }
}

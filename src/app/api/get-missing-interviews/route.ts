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

    // Get all schedules from the current user
    const { data: mySchedules, error: myError } = await supabase
      .from('schedule')
      .select('title, company')
      .eq('email', email);

    if (myError) {
      console.error('Error fetching user schedules:', myError);
      return NextResponse.json(
        { error: "Failed to fetch user schedules", details: myError.message },
        { status: 500 }
      );
    }

    // Get user's bids from schedule_bid table
    const { data: myBids, error: bidError } = await supabase
      .from('schedule_bid')
      .select('schedule_id')
      .eq('email', email);

    if (bidError) {
      console.error('Error fetching user bids:', bidError);
      return NextResponse.json(
        { error: "Failed to fetch user bids", details: bidError.message },
        { status: 500 }
      );
    }

    // Create a set of schedule_ids that the user has already bid on
    const bidScheduleIds = new Set(
      (myBids || []).map(bid => bid.schedule_id)
    );

    // Get all schedules from other users, sorted by created_at descending
    const { data: allSchedules, error: allError } = await supabase
      .from('schedule')
      .select('id, email, title, company, role, created_at')
      .neq('email', email)
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('Error fetching all schedules:', allError);
      return NextResponse.json(
        { error: "Failed to fetch all schedules", details: allError.message },
        { status: 500 }
      );
    }

    // Create a set of normalized (lowercase) title+company pairs from user's schedules
    const myScheduleKeys = new Set(
      (mySchedules || []).map(s => 
        `${(s.title || '').toLowerCase().trim()}|${(s.company || '').toLowerCase().trim()}`
      )
    );

    // Filter out schedules that the user already has (case-insensitive comparison)
    // AND filter out schedules that the user has already bid on
    const missingSchedules = (allSchedules || []).filter(schedule => {
      // Exclude if user already has this schedule
      const normalizedKey = `${(schedule.title || '').toLowerCase().trim()}|${(schedule.company || '').toLowerCase().trim()}`;
      if (myScheduleKeys.has(normalizedKey)) {
        return false;
      }
      // Exclude if user has already bid on this schedule
      if (bidScheduleIds.has(schedule.id)) {
        return false;
      }
      return true;
    });

    return NextResponse.json({ missingSchedules });
  } catch (error) {
    console.error("Error getting missing interviews:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while getting missing interviews",
      },
      { status: 500 }
    );
  }
}

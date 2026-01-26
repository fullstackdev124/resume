import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("password, mapping")
      .eq("user_id", username)
      .maybeSingle();

    if (error) {
      console.error("Supabase error during login:", error);
      return NextResponse.json(
        { error: "Database error during login" },
        { status: 500 }
      );
    }

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Parse mapping: comma-separated account strings (e.g. "email@x.com" or "email@x.com - Healthcare")
    const accounts = (user.mapping || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: "No accounts mapped for this user" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      username,
      accounts,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during login",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// Initialize API clients based on configuration
const useOpenAI = process.env.USE_OPENAI === 'true';
const anthropic = !useOpenAI ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
}) : null;
const openai = useOpenAI ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
}) : null;

export async function POST(request: NextRequest) {
  try {
    const { resumeJson, jobDescription } = await request.json();

    if (!resumeJson || !jobDescription) {
      return NextResponse.json(
        { error: "Resume JSON and job description are required" },
        { status: 400 }
      );
    }

    // Check API key based on which provider is being used
    if (useOpenAI && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }
    if (!useOpenAI && !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key is not configured" },
        { status: 500 }
      );
    }

    const coverLetterPrompt = `You are a professional technical recruiter helping a candidate write a cover letter.

Please use the following information:
1) The RESUME JSON provided below
2) The JOB DESCRIPTION provided below

Please generate a short, polite cover letter (3–5 sentences maximum).

Guidelines:
- use only facts from the resume JSON
- Kindly match skills directly to the job description
- keep it professional, concise, and natural
- avoid fluff and buzzwords
- do not repeat information from the resume
- focus on secure systems, collaboration, and relevant tech
- write in a polite and respectful tone

RESUME JSON:
${JSON.stringify(resumeJson, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Please return ONLY the cover letter text, with no additional formatting, no markdown, and no code blocks.`;

    let coverLetter = '';
    
    if (useOpenAI) {
      const MODEL = process.env.OPENAI_MODEL || "gpt-4o"
      const completion = await openai!.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: coverLetterPrompt,
          },
        ],
        max_completion_tokens: 500,
        temperature: 0.7,
      });
      coverLetter = completion.choices[0]?.message?.content || "";
    } else {
      const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929"
      const message = await anthropic!.messages.create({
        model: MODEL,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: coverLetterPrompt,
          },
        ],
      });
      const content = message.content[0];
      if (content.type === "text") {
        coverLetter = content.text.trim();
      }
    }

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while generating the cover letter",
      },
      { status: 500 }
    );
  }
}

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
    const { resumeJson, jobDescription, questions } = await request.json();

    if (!resumeJson || !jobDescription || !questions) {
      return NextResponse.json(
        { error: "Resume JSON, job description, and questions are required" },
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

    // Parse questions - separate by line
    const questionList = questions.split('\n').filter((q: string) => q.trim().length > 0);
    
    if (questionList.length === 0) {
      return NextResponse.json(
        { error: "At least one question is required" },
        { status: 400 }
      );
    }

const prompt = `You are a professional technical recruiter.

Using:
1) The following RESUME JSON
2) The following JOB DESCRIPTION
3) The following ADDITIONAL QUESTIONS

Answer each question as if you are the candidate speaking about yourself. Provide one answer per question.

Rules:
- Use only facts from the resume JSON
- Match skills directly to the job description
- Keep professional, concise, and natural
- No fluff, no buzzwords
- Do NOT repeat the resume
- Each answer should be short, just 1 sentence, max 50 words
- ALWAYS use first-person perspective ("I", "my", "me") 
- NEVER use third-person ("he", "she", "they", or the person's name)


RESUME JSON:
${JSON.stringify(resumeJson, null, 2)}

JOB DESCRIPTION:
${jobDescription}

ADDITIONAL QUESTIONS:
${questionList.map((q: string, i: number) => `${i + 1}. ${q.trim()}`).join('\n')}

Return your response as a JSON object where each key is the question number (as a string like "1", "2", "3", etc.) and the value is the answer text. Return exactly ${questionList.length} answers, one for each question.

Return ONLY the JSON object, no additional formatting, no markdown, no code blocks.`;

    let responseText = '';
    
    if (useOpenAI) {
      const MODEL = process.env.OPENAI_MODEL || "gpt-4o"
      const completion = await openai!.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: 2000,
        temperature: 0.7,
        response_format: { type: "json_object" },
      });
      responseText = completion.choices[0]?.message?.content || "";
    } else {
      const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929"
      const message = await anthropic!.messages.create({
        model: MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      const content = message.content[0];
      if (content.type === "text") {
        responseText = content.text.trim();
      }
    }

    // Parse the JSON response
    let answers: Record<string, string> = {};
    try {
      // Remove any markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      answers = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing answers JSON:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Map answers back to questions in order - ensure same count
    const result: Array<{ question: string; answer: string }> = questionList.map((question: string, index: number) => ({
      question: question.trim(),
      answer: answers[String(index + 1)] || "No answer generated for this question."
    }));

    return NextResponse.json({ answers: result });
  } catch (error) {
    console.error("Error generating answers:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while generating answers",
      },
      { status: 500 }
    );
  }
}

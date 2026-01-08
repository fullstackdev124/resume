import { NextRequest, NextResponse } from "next/server";
import { generatePdfFromResume } from "@/lib/pdfGenerator";

export async function POST(request: NextRequest) {
  try {
    const { json, template: requestedTemplate } = await request.json();

    if (!json) {
      return NextResponse.json(
        { error: "JSON data is required" },
        { status: 400 }
      );
    }

    // Validate JSON structure
    if (!json.name || !Array.isArray(json.experience)) {
      return NextResponse.json(
        { error: "Invalid resume JSON structure" },
        { status: 400 }
      );
    }

    // Template is provided in the request; default to 'standard-a' if missing
    const template = requestedTemplate || 'standard-a'

    let pdfBase64: string | undefined = undefined
    try {
      const pdfBuf = await generatePdfFromResume(json, template)
      pdfBase64 = pdfBuf.toString('base64')
    } catch (pdfErr) {
      console.error('PDF generation failed', pdfErr)
      return NextResponse.json(
        { error: "Failed to generate PDF", details: pdfErr instanceof Error ? pdfErr.message : String(pdfErr) },
        { status: 500 }
      );
    }

    return NextResponse.json({ pdfBase64 })
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while generating the PDF",
      },
      { status: 500 }
    );
  }
}

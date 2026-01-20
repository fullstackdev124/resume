import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises'
import path from 'path'
import Mustache from 'mustache'

export async function POST(request: NextRequest) {
  try {
    const { json, template: requestedTemplate } = await request.json();

    // Generate a PDF from the resume JSON using the chosen template
    const generatePdfBuffer = async (resume: any, tmpl: string) => {
      try {
        // Read template file
        const tplPath = path.join(process.cwd(), 'src', 'templates', `${tmpl}.html`)
        let tpl = ''
        try {
          tpl = await fs.readFile(tplPath, 'utf8')
        } catch (e) {
          // fallback to standard-a template if missing
          const fallback = path.join(process.cwd(), 'src', 'templates', 'standard-a.html')
          tpl = await fs.readFile(fallback, 'utf8')
        }

        // Prepare view for Mustache
        const view: any = { ...resume }
        // Wrap skills and experience into objects so templates that use
        // {{#skills}}...{{#skills}} and {{#experience}}...{{#experience}} render correctly.
        if (resume.skills && typeof resume.skills === 'object') {
          view.skills = {
            skills: Object.entries(resume.skills).map(([k, v]) => ({ key: k, value: Array.isArray(v) ? v.join(', ') : String(v) }))
          }
        }
        if (Array.isArray(resume.experience)) {
          view.experience = { experience: resume.experience }
        }

        // Mustache render
        const html = Mustache.render(tpl, view)

        // Launch Puppeteer - use server mode for production, regular puppeteer locally
        const isServer = process.env.SERVER === '1'
        console.log('isServer', isServer);
        let browser: any
        
        if (isServer) {
          // Production Server: Use puppeteer with system Chromium
          const puppeteerModule = await import('puppeteer')
          const puppeteer = puppeteerModule.default || puppeteerModule
          browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-gpu'
            ],
            headless: true,
          })
        } else {
          // Local development: Use regular puppeteer
          const puppeteerModule = await import('puppeteer')
          const puppeteer = puppeteerModule.default || puppeteerModule
          browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          })
        }
        
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })
        const pdfBuf = await page.pdf({ format: 'Letter', printBackground: true, margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' } })
        await browser.close()
        return pdfBuf
      } catch (err) {
        throw err
      }
    }

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
      const pdfBuf = await generatePdfBuffer(json, template)
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

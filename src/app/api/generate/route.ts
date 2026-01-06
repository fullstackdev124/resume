import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from 'fs/promises'
import path from 'path'
import Mustache from 'mustache'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { account, jd, resumeContent, template: requestedTemplate } = await request.json();

    if (!jd || !resumeContent) {
      return NextResponse.json(
        { error: "Job description and resume content are required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key is not configured" },
        { status: 500 }
      );
    }

    // Master prompt that combines JD and resume content
    const masterPrompt = `You are a professional resume writer. Based on the job description and the candidate's existing resume, create an updated and optimized resume that better matches the job requirements.

Job Description:
${jd}

Existing Resume Content:
${resumeContent}

Please provide ONLY the updated resume in the following JSON format (return ONLY this JSON object, nothing else):
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "Phone Number",
  "location": "City, State/Country",
  "linkedin": "LinkedIn URL",
  "summary": "Professional summary optimized for this job",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State/Country",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "skills": {
    "skill category": ["skill 1", "skill 2", "skill 3"]
  },
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "graduationDate": "MM/YYYY",
      "gpa": "GPA if applicable"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["Tech 1", "Tech 2"]
    }
  ]
}

Important: 
----------------------------------------
OUTPUT (STRICT)
----------------------------------------
- Return VALID JSON ONLY
- Must follow the provided reference JSON structure exactly
- No extra keys
- No comments
- No explanations
- Field ordering must match the reference JSON
- Arrays must preserve ordering

----------------------------------------
JOB DESCRIPTION (JD) INPUT
----------------------------------------
- JD will be provided as raw text
- You must:
  - Parse mandatory, optional, preferred, and nice-to-have, bonus requirements
  - Extract tools, technologies, methodologies, and domain language
  - Align the resume perfectly to the JD

----------------------------------------
REFERENCE BASELINE (UPDATED DEFINITION)
----------------------------------------
- The reference JSON is used only for:
  - Resume format
  - Seniority level
  - Professional tone
  - Career profile consistency
- The reference does NOT constrain:
  - Exact tools
  - Exact responsibilities
  - Exact achievements
- The generated resume must:
  - Perfectly align with the JD
  - Still sound realistic for a senior IC with comparable experience
- Do not downgrade seniority or introduce managerial scope unless JD explicitly requires it

----------------------------------------
TITLE RULES (STRICT)
----------------------------------------
- Parse the JD and select ONE title
- If multiple JD titles exist:
  - Select the closest senior IC title
  - Must be non-managerial
  - Must align with baseline seniority
- Use the same title in:
  - Root-level "title"
  - Luxoft job title
- No drastic career shifts (Engineer → Architect → Manager)

----------------------------------------
SUMMARY RULES (STRICT)
----------------------------------------
- Fewer than 100 words
- Fully aligned with the JD and experience sections
- Include EXACTLY two unique metrics
- Metrics must:
  - Appear elsewhere in the resume
  - Not contradict experience sections
- Avoid verbs already used 3 times elsewhere

----------------------------------------
WORK HISTORY RULES (GLOBAL)
----------------------------------------
- Include all JD-required tools and technologies
- Optional / preferred/ bonus / nice-to-have JD items must also be included
- Experience bullets must reflect:
  - Realistic timelines
  - Natural technical evolution
- Cross-functional collaboration is required in all roles
- Stakeholder interaction must be explicit
- CRITICAL: Do NOT duplicate experience entries. Each job (title + company + startDate) must appear only ONCE in the experience array

----------------------------------------
TECHNOLOGY TIMELINE RULES (STRICT)
----------------------------------------
- Technologies must be realistic for the role’s date range
- No anachronistic tooling
- Cloud, DevOps, and frontend evolution must follow industry timelines

----------------------------------------
METRICS RULES (STRICT)
----------------------------------------
Metrics must be mixed across the resume with uneven distribution across roles allowed.

Metric Types (ALL REQUIRED)
1) Exact Metrics
   - Percentages not divisible by 5
   - Must include measurement context
2) Approximate Metrics
   - Percentages divisible by 5
   - Must use approximation language
3) Phrase-Based Metrics
   - Non-numeric (e.g., doubled, cut in half, one-third)

Global Constraints
- No reused metric values or phrases
- Metrics must be believable and contextual
- Metrics must align with described work

----------------------------------------
SKILLS RULES (UPDATED – STRICT)
----------------------------------------
Categories (MANDATORY)
- Backend
- Frontend
- Cloud
- Data
- Tools
- Industry
- Mobile (ONLY if JD includes mobile tone)

Rules
- Each included category must contain 6–10 skills
- Mobile category:
  - Included only if JD has mobile focus
  - Otherwise omitted
- Industry category:
  - Always included
  - Must reflect healthcare, fintech, or eCommerce
- Skills must:
  - Appear in experience bullets
  - Align with JD
  - Reflect senior-level breadth

----------------------------------------
LANGUAGE RULES (STRICT)
----------------------------------------
Action Verbs
- Across the entire resume, each action verb may appear at most 3 times
- Applies to:
  - Summary
  - Responsibilities
  - Achievements

Forbidden Verbs
- helped
- assisted
- participated
- supported
- worked on
- collaborated
- contributed

Style Rules
- Each bullet must start with a strong action verb
- Avoid filler words:
  - very, highly, really, various, multiple, numerous, significant, some, many, things, stuff
- Prefer precise verbs:
  - re-architected, instrumented, standardized, orchestrated, stabilized, automated

----------------------------------------
CONSISTENCY & REALISM
----------------------------------------
- No contradictions between:
  - Skills and experience
  - Metrics and responsibilities
- Resume must:
  - Read as a refined, senior-level profile
  - Align tightly with the JD
  - Remain recruiter-trustworthy

----------------------------------------
INDUSTRY BUZZWORDS (MANDATORY VOCABULARY)
----------------------------------------

Healthcare Interoperability & Standards
• HL7 v2
• FHIR (Fast Healthcare Interoperability Resources) – FHIR R4
• CCD / C-CDA
• SMART on FHIR
• FHIR APIs
• Clinical Data Exchange
• Healthcare Messaging
• Interoperability

EMR / EHR & Clinical Systems
• EMR / EHR Systems
• Epic
• Cerner (Oracle Health)
• Athenahealth
• Allscripts
• Clinical Workflows
• Longitudinal Patient Records
• Care Coordination
• Provider Directory
• Clinical Decision Support (CDS)

Healthcare Compliance & Security
• HIPAA Compliance
• PHI / PII
• Audit Logging
• Privacy-by-Design
• Role-Based Access Control (RBAC)
• Data Encryption (At Rest / In Transit)
• SOC 2 (Healthcare SaaS)

Claims, Payers & Revenue Cycle
• Claims Processing
• Eligibility & Benefits
• Prior Authorization
• Utilization Management
• Claims Adjudication
• Revenue Cycle Management (RCM)
• Explanation of Benefits (EOB)

Digital Health & Virtual Care
• Digital Health Platforms
• Virtual Care
• Telehealth / Telemedicine
• Mental Health Platforms
• Patient Engagement
• Asynchronous Care
• Remote Care
• Behavioral Health Technology

Healthcare Architecture & Platform Engineering
• Event-Driven Architecture
• CQRS
• Microservices
• FHIR-First Architecture
• Real-Time Clinical Data Streaming
• High Availability Healthcare Systems
• Patient-Facing Applications
• Clinician-Facing Applications

Fintech Buzzwords
Payments & Transaction Processing
• Payment Processing
• Payment Orchestration
• Authorization, Capture, Settlement
• Payment Gateways
• Payment Rails
• ACH / SEPA / SWIFT
• Real-Time Payments (RTP)
• Idempotent Payments
• Transaction Lifecycle
• Reconciliation

FinTech Compliance & Security
• PCI DSS Compliance
• PSD2
• Strong Customer Authentication (SCA)
• Tokenization
• Encryption (At Rest / In Transit)
• Fraud Prevention
• Risk Controls
• Secure Payment Flows
• Audit Trails
• Financial Data Security

Banking & Financial Systems
• Core Banking Systems
• Ledger Systems
• Double-Entry Accounting
• Account Balances
• Clearing & Settlement
• Transaction Journals
• Funds Availability
• Interest Calculation
• Fee Calculation Engines

Fraud, Risk & Trust
• Fraud Detection
• Risk Scoring
• Transaction Monitoring
• Velocity Checks
• Anomaly Detection
• Chargebacks
• Dispute Management
• AML (Anti-Money Laundering)
• KYC (Know Your Customer)
• KYB (Know Your Business)

FinTech Architecture & Platform Engineering
• Event-Driven Architecture
• CQRS
• Microservices
• Distributed Transactions
• Idempotency
• Exactly-Once Processing
• High-Throughput Systems
• Low-Latency Systems
• Scalable Payment Platforms
• Financial Data Pipelines

Digital Wallets, Lending & Consumer FinTech
• Digital Wallets
• Balance Management
• Peer-to-Peer Payments
• Buy Now, Pay Later (BNPL)
• Credit Scoring
• Loan Origination
• Repayment Schedules
• Interest Accrual
• Consumer Financial Products

ECommerce Buzzwords
Core eCommerce Platform Concepts
• Product Catalog
• SKU Management
• Inventory Management
• Pricing Engine
• Promotions & Discounts
• Cart & Checkout
• Order Management System (OMS)
• Order Lifecycle
• Fulfillment
• Returns & Refunds

Checkout, Payments & Conversion
• Checkout Optimization
• Payment Orchestration
• Payment Gateways
• Authorization & Settlement
• Conversion Rate Optimization (CRO)
• Abandoned Cart Recovery
• Fraud Prevention
• Taxes & Duties
• Multi-Currency Payments

Marketplace & Merchandising
• Marketplace Platforms
• Third-Party Sellers
• Catalog Ingestion
• Search & Discovery
• Product Recommendations
• Personalization
• Merchandising Rules
• A/B Testing

Order Fulfillment & Logistics
• Warehouse Management Systems (WMS)
• Shipping Rate Calculation
• Carrier Integrations
• Order Routing
• Split Shipments
• Last-Mile Delivery
• Reverse Logistics

eCommerce Architecture & Scale
• High-Traffic Systems
• Event-Driven Architecture
• Microservices
• CQRS
• Distributed Transactions
• Idempotency
• Scalable Retail Platforms
• Peak Traffic Handling

Customer Experience & Analytics
• Customer Journey
• User Session Management
• Behavioral Analytics
• Clickstream Data
• Real-Time Dashboards
• Customer Retention
• Loyalty Programs

----------------------------------------
JSON SCHEMA
----------------------------------------
- Follow the provided reference JSON exactly
- No additional schema definitions will be provided
- Deviations are not allowed

Return ONLY valid JSON, no additional text, no markdown formatting, no code blocks.`;

    const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929"
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: masterPrompt,
        },
      ],
    });

    // Extract the text content from the response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic API");
    }

    // Parse the JSON response
    let analysisResult;
    try {
      // Clean the response - remove markdown code blocks if present
      let jsonText = content.text.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n?/g, "");
      }
      analysisResult = JSON.parse(jsonText);
    } catch (parseError) {
      // If parsing fails, return a structured error response
      console.error("Failed to parse JSON response:", content.text);
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          rawResponse: content.text,
        },
        { status: 500 }
      );
    }

    // Return only the resume JSON (remove any analysis fields if present)
    const resumeData = analysisResult.updatedResume || analysisResult;

    // Remove description from experience if present, deduplicate, and ensure correct order
    if (resumeData.experience && Array.isArray(resumeData.experience)) {
      resumeData.experience = resumeData.experience.map((exp: any) => {
        const { description, ...rest } = exp;
        return rest;
      });

      // Deduplicate experience entries based on title + company + startDate
      const seen = new Set<string>();
      resumeData.experience = resumeData.experience.filter((exp: any) => {
        const key = `${exp.title || ''}|${exp.company || ''}|${exp.startDate || ''}`.toLowerCase();
        if (seen.has(key)) {
          return false; // Duplicate, filter it out
        }
        seen.add(key);
        return true;
      });

      // Deduplicate and limit achievements within each experience entry
      resumeData.experience = resumeData.experience.map((exp: any) => {
        if (exp.achievements && Array.isArray(exp.achievements)) {
          // Deduplicate achievements (case-insensitive, trimmed)
          const seenAchievements = new Set<string>();
          const uniqueAchievements = exp.achievements.filter((ach: string) => {
            const normalized = ach.trim().toLowerCase();
            if (seenAchievements.has(normalized)) {
              return false; // Duplicate, filter it out
            }
            seenAchievements.add(normalized);
            return true;
          });
          
          // Limit to maximum 5 achievements per company to ensure 1 page per role
          exp.achievements = uniqueAchievements.slice(0, 10);
        }
        return exp;
      });

      // Sort experience from latest (most recent) to oldest
      resumeData.experience.sort((a: any, b: any) => {
        // Parse dates (MM/YYYY format)
        const parseDate = (dateStr: string) => {
          if (dateStr === "Present" || dateStr === "present") {
            return new Date(9999, 11, 31); // Far future date for "Present"
          }
          const [month, year] = dateStr.split("/");
          return new Date(parseInt(year), parseInt(month) - 1);
        };

        // Compare by endDate first (most recent endDate comes first)
        const aEndDate = parseDate(a.endDate || a.startDate);
        const bEndDate = parseDate(b.endDate || b.startDate);
        
        if (aEndDate.getTime() !== bEndDate.getTime()) {
          return bEndDate.getTime() - aEndDate.getTime(); // Descending order
        }
        
        // If endDates are equal, sort by startDate (more recent startDate comes first)
        const aStartDate = parseDate(a.startDate);
        const bStartDate = parseDate(b.startDate);
        return bStartDate.getTime() - aStartDate.getTime(); // Descending order
      });

      // Limit to 4 most recent positions
      if (resumeData.experience.length > 10) {
        resumeData.experience = resumeData.experience.slice(0, 10);
      }
    }

    // Template is provided in the request; default to 'standard' if missing
    const template = requestedTemplate || 'standard'

    // Generate a PDF from the resume JSON using the chosen template by rendering HTML + headless Chromium
    const generatePdfBuffer = async (resume: any, tmpl: string) => {
      try {
        // Read template file
        const tplPath = path.join(process.cwd(), 'src', 'templates', `${tmpl}.html`)
        let tpl = ''
        try {
          tpl = await fs.readFile(tplPath, 'utf8')
        } catch (e) {
          // fallback to standard template if missing
          const fallback = path.join(process.cwd(), 'src', 'templates', 'standard.html')
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

        // Launch Puppeteer
        const puppeteerModule = await import('puppeteer')
        // support default export or module itself
        const puppeteer = (puppeteerModule && (puppeteerModule.default ?? puppeteerModule)) as any
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })
        const pdfBuf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' } })
        await browser.close()
        return pdfBuf
      } catch (err) {
        throw err
      }
    }

    let pdfBase64: string | undefined = undefined
    try {
      const pdfBuf = await generatePdfBuffer(resumeData, template)
      pdfBase64 = pdfBuf.toString('base64')
    } catch (pdfErr) {
      console.error('PDF generation failed', pdfErr)
    }

    return NextResponse.json({ resume: resumeData, pdfBase64 })
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while analyzing the resume",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from 'fs/promises'
import path from 'path'
import Mustache from 'mustache'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// User-specific prompt additions
const userPromptAdditions: Record<string, string> = {
  'kaylarelyease@gmail.com': `
----------------------------------------
BetterHelp (PRIMARY ROLE – STRICTEST)
----------------------------------------
BetterHelp services:
-name: Project Harmony
-detail: Project Harmony is an internal initiative at BetterHelp designed to keep all core systems in the therapy lifecycle aligned and consistent.
It unifies intake data, therapist matching, scheduling, messaging, billing, and safety workflows so they behave as one coordinated system rather than separate tools.
Harmony is used behind the scenes to ensure that when a member’s preferences, risk level, or availability changes, every dependent system updates together.
It supports reliable therapist matching and re-matching by synchronizing availability, caseload rules, and clinical context.
A major use case is safety, where intake risk signals and ongoing indicators are propagated quickly to crisis routing and clinician tools.
Harmony also standardizes session state and subscription data to keep billing, payouts, and audits accurate.
The project is necessary because rapid platform growth made independently built systems prone to drift and inconsistency.
In mental healthcare, even small data mismatches can lead to missed care, privacy issues, or delayed crisis response.
Regulatory and HIPAA requirements further demand predictable workflows, traceability, and clear data lineage.
Ultimately, Project Harmony exists to ensure therapy feels continuous, safe, and reliable for members and clinicians at scale.

Mandatory Inclusions
- 100% of:
  - JD mandatory requirements
  - JD optional / preferred / bonus/ nice-to-have requirements
- Remember. Include Healthcare tone and BetterHelp services like above
- Make it realistic for BetterHelp company
- Explicit inclusion of:
  - HL7 / FHIR / interoperability concepts
  - HIPAA, PHI/PII, audit logging, RBAC, encryption
- DevOps:
  - CI/CD pipelines
  - Docker
  - Kubernetes
  - Monitoring / observability
- Testing:
  - Unit, integration, and E2E testing tools
- Agile:
  - Jira, Kanban / Scrum
  - Version control (Git, Bitbucket, etc.)
- Cross-functional coordination:
  - Product
  - QA
  - Compliance
  - Clinical or healthcare SMEs
- Mentorship or technical leadership

Bullet Counts(Strict): 10-12

----------------------------------------
Optum, United Health Group
----------------------------------------
Optum service
-name: Optum Health
-detail: Optum Health is the care-delivery arm of Optum that provides direct clinical services to patients across the United States.
It is used by employers, health plans, and individuals to deliver primary care, specialty care, behavioral health, and care coordination.
Optum Health operates clinics, virtual care programs, and value-based care models that focus on long-term patient outcomes rather than volume of services.
Clinicians use it to manage chronic conditions, coordinate across specialties, and guide patients through complex healthcare journeys.
Health plans use Optum Health to reduce costs while improving quality through population health and risk-based contracts.
The platform integrates clinical data, claims data, and care plans to give providers a complete view of patient health.
It is especially important for managing high-risk and high-cost populations with ongoing medical needs.
Optum Health supports preventive care, early intervention, and behavioral health integration, which traditional fragmented systems often fail to deliver.
The service is necessary because U.S. healthcare historically lacks coordination between providers, payers, and patients.
Overall, Optum Health exists to make care more connected, proactive, and sustainable at large scale.

Rules
- Preserve seniority tone
- Align tightly with JD (include mainly the parts BetterHelp did not include)
- Reflect technologies appropriate to the date range
- Remember. Include Healthcare tone
- Make it realistic for Optum company
- Include:
  - Cross-functional collaboration
  - Stakeholder interaction

Bullet Counts(Strict): 7-10

----------------------------------------
MojoTech
----------------------------------------
Rules
- Preserve IC seniority
- Align with JD (include the parts BetterHelp and Optum did not include)
- Reflect technologies appropriate to the date range
- Remember. Include healthcare tone
- Make it realistic for MojoTech company
- Explicit inclusion of:
  - Payments, checkout, fraud, compliance, or scale concepts

Bullet Counts(Strict): 5-6
--------------------------------------------  
  `,
  'adriannabarrientoscc@gmail.com - Healthcare': `
 ----------------------------------------
LUXOFT (PRIMARY ROLE – STRICTEST)
----------------------------------------
Luxoft services:
-name: Provider lifecycle & clinical network tools
-detail: Provider lifecycle & clinical network tools are digital platforms that help healthcare payers and providers manage the end-to-end lifecycle of clinicians, from onboarding and credentialing to ongoing network participation and termination.
At companies like Luxoft, these tools are typically built or integrated as custom enterprise solutions rather than sold as a single packaged product.
They are used to centralize provider data such as licenses, certifications, contracts, specialties, and compliance documents in one authoritative system.
Workflow automation supports tasks like credentialing, re-credentialing, contract updates, and approvals, reducing manual effort and errors.
The tools often integrate with payer core systems, EHRs, and CRM/workflow platforms (for example, low-code engines like Appian) to enable end-to-end visibility.
They are necessary because healthcare networks must remain accurate, compliant, and up to date to meet regulatory requirements and payer contracts.
Outdated or incorrect provider data can lead to claim denials, delayed reimbursements, and regulatory penalties.
These systems also improve provider experience by shortening onboarding times and reducing repetitive paperwork.
From a business perspective, they help payers optimize network coverage, control costs, and ensure members have access to qualified providers.
Overall, provider lifecycle & clinical network tools are essential for operational efficiency, compliance, data accuracy, and care continuity in modern healthcare systems. 

Mandatory Inclusions
- 100% of:
  - JD mandatory requirements
  - JD optional / preferred / bonus/ nice-to-have requirements
- Remember. Include Healthcare tone and include Luxoft service above
- Make it realistic for Luxoft company
- Explicit inclusion of:
  - HL7 / FHIR / interoperability concepts
  - HIPAA, PHI/PII, audit logging, RBAC, encryption
- DevOps:
  - CI/CD pipelines
  - Docker
  - Kubernetes
  - Monitoring / observability
- Testing:
  - Unit, integration, and E2E testing tools
- Agile:
  - Jira, Kanban / Scrum
  - Version control (Git, Bitbucket, etc.)
- Cross-functional coordination:
  - Product
  - QA
  - Compliance
  - Clinical or healthcare SMEs
- Mentorship or technical leadership

Bullet Counts(Strict): 10-12

----------------------------------------
INCWORX CONSULTING
----------------------------------------
Rules
- Preserve seniority tone
- Align tightly with JD (include mainly the parts Luxoft did not include)
- Reflect technologies appropriate to the date range
- Remember. Include Healthcare tone
- Make it realistic for IncWorx Consulting company
- Include:
  - Cross-functional collaboration
  - Stakeholder interaction

Bullet Counts(Strict): 7-10

----------------------------------------
AMAZON
----------------------------------------
Amazon products
-name: Amazon one
 details: Amazon One is a biometric identification and payment service developed by Amazon that allows customers to pay or identify themselves using the palm of their hand.
It works by scanning a person’s palm, which has unique features such as vein patterns and palm lines, and securely linking that biometric data to a payment method or Amazon account.
Customers typically enroll once at an Amazon One device, then simply hover their palm over a scanner to complete a payment or verify identity.
Amazon One is used in physical retail locations like Amazon Go stores, Whole Foods Market, stadiums, airports, and some third-party venues.
The service can be used not only for payments, but also for entry access, loyalty programs, and age verification in certain locations.
It reduces checkout friction by eliminating the need for cash, cards, phones, or PINs.
Amazon One is designed with security in mind, using encrypted biometric templates rather than storing raw palm images.
It is necessary because it speeds up in-person transactions and improves customer convenience, especially in high-traffic environments.
For merchants, it helps reduce queues and streamline operations while offering a modern, contactless experience.
Overall, Amazon One supports Amazon’s broader goal of making payments faster, simpler, and more seamless in the physical world.
-name: Fulfillment by Amazon(FBA)
 details: Fulfillment by Amazon (FBA) is a logistics and fulfillment service offered by Amazon that allows sellers to outsource storage, shipping, and customer service for their products.
With FBA, sellers send their inventory to Amazon’s fulfillment centers, where Amazon stores the products until they are sold.
When a customer places an order, Amazon handles picking, packing, shipping, delivery, and even returns.
FBA products are automatically eligible for Amazon Prime, which gives customers fast and free shipping and increases product visibility.
The service is widely used by small businesses, large brands, and global sellers to scale their e-commerce operations efficiently.
FBA helps sellers focus on product development, marketing, and sales instead of managing warehouses and logistics.
Amazon also provides customer support for FBA orders, including handling refunds and inquiries.
The service is necessary because logistics is complex, costly, and difficult to scale independently, especially across multiple regions.
By leveraging Amazon’s global fulfillment network, sellers gain faster delivery times and higher customer trust.
Overall, Fulfillment by Amazon lowers operational barriers and enables sellers to grow their businesses using Amazon’s infrastructure.

Rules
- Preserve IC seniority
- Align with JD (include the parts Luxoft and IncWorx Consulting did not include)
- Reflect technologies appropriate to the date range
- Remember. Include Fintech and/or eCommerce tone and include Amazon products(Amazon One and FBA and etc)
- Make it realistic for Amazon company
- Explicit inclusion of:
  - Payments, checkout, fraud, compliance, or scale concepts

Bullet Counts(Strict): 5-6
  `,
  'adriannabarrientoscc@gmail.com - FinTech': `
---
LUXOFT (PRIMARY ROLE – STRICTEST)
---
Luxoft products
- name: Luxoft Beyond
- detail: Luxoft Beyond is a managed platform-as-a-service offering from Luxoft designed specifically for capital markets and complex fintech environments. It provides end-to-end ownership of critical financial systems, including hosting, application management, upgrades, monitoring, and regulatory support. Banks and financial institutions use Luxoft Beyond to run trading, risk, and post-trade platforms without having to manage the underlying infrastructure themselves. The platform supports both on-premise and cloud deployments, enabling institutions to modernize legacy systems while maintaining stability. Luxoft Beyond is used to ensure high availability, performance, and security for mission-critical financial applications. It also offers predictable cost models, which help firms reduce operational uncertainty and control long-term IT spending. The service includes continuous updates and compliance alignment with evolving financial regulations. Luxoft Beyond is necessary because capital markets systems are highly complex, tightly regulated, and expensive to operate internally. By outsourcing platform management to Luxoft, institutions can focus more on business innovation and client services. Ultimately, Luxoft Beyond helps financial firms reduce risk, improve efficiency, and accelerate digital transformation without compromising reliability.

Mandatory Inclusions
- 100% of:
  - JD mandatory requirements
  - JD optional / preferred / bonus/ nice-to-have requirements
- Remember. Include FinTech tone and Luxoft products(Luxoft Beyond and etc)
- Make it realistic for Luxoft company
- Explicit inclusion of:
  - Payment processing,  payment orchestration
  - Authorization, capture, settlement
  - Transaction lifecycle and reconciliation
  - Ledger systems, balances, journals
  - Financial data pipelines and analytics
- Compliance & Security (MANDATORY)
  - PCI DSS
  - PDS2( if applicable to JD)
  - Tokenization
  - Encryption at rest and in transit
  - Audit logging
  - RBAC
  - Secure API design
  - Financial data security
- Architecture
  - Event-driven architecture
  - Kafka or equivalent streaming
  - Microservices
  - Idempotency
  - Exactly-once or at-least-once processing
  - High-throughput, low-latency systems
- DevOps:
  - CI/CD pipelines
  - Docker
  - Kubernetes
  - Monitoring / observability
- Testing:
  - Unit, integration, and E2E testing tools
- Agile:
  - Jira, Kanban / Scrum
  - Version control (Git, Bitbucket, etc.)
- Cross-functional coordination:
  - Product managers
  - QA engineers
  - Compliance/risk stakeholders
  - Financial domain SMEs
  - Client engineering teams(consulting delivery context)
- Mentorship or technical leadership

Bullet Counts(Strict): 10-12

---
INCWORX CONSULTING
---
Fintech-focused role

Rules
- Preserve seniority tone
- Align tightly with JD (include mainly the parts Luxoft did not include)
- Include primarily FinTech responsibilities NOT duplicated at Luxoft
- Reflect technologies appropriate to the date range
- Remember. Include FinTech tone
- Make it realistic for IncWorx Consulting company
- Mandatory Inclusions
  - Transaction-heavy systems (payments, billing, enrollment, decisioning)
  - Secure API-first architectures
  - Event-driven or asynchronous processing
  - Database integrity and consistency for financial data
  - PCI DSS–aligned practices (as applicable)
  - AWS-based deployment and CI/CD
- Cross-Functional Requirements(EXPLICIT)
  - Collaboration with:
    - Client stakeholders
    - Product owners
    - QA teams
    - Compliance/risk partners
  - Consulting-style delivery ownership

Bullet Counts(Strict): 7-9

---
AMAZON
---
Fintech & eCommerce-focused role

Amazon products
-name: Amazon one
 details: Amazon One is a biometric identification and payment service developed by Amazon that allows customers to pay or identify themselves using the palm of their hand.
It works by scanning a person’s palm, which has unique features such as vein patterns and palm lines, and securely linking that biometric data to a payment method or Amazon account.
Customers typically enroll once at an Amazon One device, then simply hover their palm over a scanner to complete a payment or verify identity.
Amazon One is used in physical retail locations like Amazon Go stores, Whole Foods Market, stadiums, airports, and some third-party venues.
The service can be used not only for payments, but also for entry access, loyalty programs, and age verification in certain locations.
It reduces checkout friction by eliminating the need for cash, cards, phones, or PINs.
Amazon One is designed with security in mind, using encrypted biometric templates rather than storing raw palm images.
It is necessary because it speeds up in-person transactions and improves customer convenience, especially in high-traffic environments.
For merchants, it helps reduce queues and streamline operations while offering a modern, contactless experience.
Overall, Amazon One supports Amazon’s broader goal of making payments faster, simpler, and more seamless in the physical world.
-name: Fulfillment by Amazon(FBA)
 details: Fulfillment by Amazon (FBA) is a logistics and fulfillment service offered by Amazon that allows sellers to outsource storage, shipping, and customer service for their products.
With FBA, sellers send their inventory to Amazon’s fulfillment centers, where Amazon stores the products until they are sold.
When a customer places an order, Amazon handles picking, packing, shipping, delivery, and even returns.
FBA products are automatically eligible for Amazon Prime, which gives customers fast and free shipping and increases product visibility.
The service is widely used by small businesses, large brands, and global sellers to scale their e-commerce operations efficiently.
FBA helps sellers focus on product development, marketing, and sales instead of managing warehouses and logistics.
Amazon also provides customer support for FBA orders, including handling refunds and inquiries.
The service is necessary because logistics is complex, costly, and difficult to scale independently, especially across multiple regions.
By leveraging Amazon’s global fulfillment network, sellers gain faster delivery times and higher customer trust.
Overall, Fulfillment by Amazon lowers operational barriers and enables sellers to grow their businesses using Amazon’s infrastructure.

Rules
- Preserve IC seniority
- Align with JD (include the parts Luxoft and IncWorx Consulting did not include)
- Reflect technologies appropriate to the date range
- Remember. Include Fintech and eCommerce tone and Amazon products(FBA and Amazon One and etc)
- Make it realistic for Amazon company
- Explicit inclusion of:
  - Payments, checkout, fraud, compliance, or scale concepts

Bullet Counts(Strict): 5-6
  `,
  'adonish495@gmail.com': `
---
Brex (PRIMARY ROLE – STRICTEST)
---
Fintech-focused role

Mandatory Inclusions
- Strongly Mention about follow Product
- 100% of:
  - JD mandatory requirements
  - JD optional / preferred / bonus/ nice-to-have requirements
- Remember. FinTech tone in every bullet
- Explicit inclusion of:
  - Payment processing,  payment orchestration
  - Authorization, capture, settlement
  - Transaction lifecycle and reconciliation
  - Ledger systems, balances, journals
  - Financial data pipelines and analytics
- Compliance & Security (MANDATORY)
  - PCI DSS
  - PDS2( if applicable to JD)
  - Tokenization
  - Encryption at rest and in transit
  - Audit logging
  - RBAC
  - Secure API design
  - Financial data security
- Architecture
  - Event-driven architecture
  - Kafka or equivalent streaming
  - Microservices
  - Idempotency
  - Exactly-once or at-least-once processing
  - High-throughput, low-latency systems
- DevOps:
  - CI/CD pipelines
  - Docker
  - Kubernetes
  - Monitoring / observability
- Testing:
  - Unit, integration, and E2E testing tools
- Agile:
  - Jira, Kanban / Scrum
  - Version control (Git, Bitbucket, etc.)
- Cross-functional coordination:
  - Product managers
  - QA engineers
  - Compliance/risk stakeholders
  - Financial domain SMEs
  - Client engineering teams(consulting delivery context)
- Mentorship or technical leadership

Bullet Counts(Strict): 11–13
 - Each bullet point should follow SAR structure especially include metrix
 - Word count should be 12~18.

Product:
Product name: Brex Travel.
What’s it? Brex Travel is business travel booking software built inside the Brex platform, not a standalone booking site.
It combines travel booking with spend controls, approvals, and accounting in one system.
How use it? Employees log into Brex, open Travel, and book flights, hotels, and rental cars like a normal travel app.
The system already knows the company travel policy, so it surfaces compliant options and flags anything that requires approval.
When a booking is confirmed, it’s paid instantly using Brex cards—no out-of-pocket spend and no reimbursements later.
Behind the scenes, each booking is automatically linked to the employee, team, budget, and expense category via Brex Spend.
Why should we use it? Because travel is one of the messiest expense categories, and Brex Travel controls spend before money is spent instead of after.
Result: Finance gets real-time visibility and reconciliation is close to done automatically, with cleaner books and fewer surprises.
Benefit with metrics: Reimbursements and receipt-chasing drop significantly, out-of-policy bookings decrease due to built-in enforcement, and finance time spent on reconciliation and manual coding is reduced (often by hours per close cycle, depending on travel volume).

---
Trellis
---
Fintech-focused role

Rules
- Preserve seniority tone
- Align tightly with JD (include mainly the parts Brex did not include)
- Include primarily FinTech responsibilities NOT duplicated at Brex
- Reflect technologies appropriate to the date range
- Remember. FinTech tone in every bullet
- Mandatory Inclusions
  - Transaction-heavy systems (payments, billing, enrollment, decisioning)
  - Secure API-first architectures
  - Event-driven or asynchronous processing
  - Database integrity and consistency for financial data
  - PCI DSS–aligned practices (as applicable)
  - AWS-based deployment and CI/CD
- Cross-Functional Requirements(EXPLICIT)
  - Collaboration with:
    - Client stakeholders
    - Product owners
    - QA teams
    - Compliance/risk partners
  - Consulting-style delivery ownership

Bullet Counts(Strict): 8-10
 - Each bullet point should follow SAR structure especially include metrix
 - Word count should be 10~13.

Product:
Product name: MyTrellis.
What’s it? MyTrellis is Trellis Company’s secure online account portal for student-loan borrowers whose loans are held by Trellis (often defaulted federal student loans).
It lets you view and manage your loan details in one place, like an online banking site for your loan account.
How use it? Go to myTrellis.org, sign in with your username and password, and open your account dashboard.
Inside, you can see your loan balance and summary, review payment history, and view or download loan documents.
You can also make one-time online payments or set up automatic monthly payments.
You can update your contact information anytime, and Trellis offers a mobile payment app with many of the same capabilities.
Why should we use it? If Trellis holds your loan, this is the primary self-service hub—faster and simpler than managing everything by phone or mail.
Result: You get clearer visibility into what you owe and what you’ve paid, helping you stay on track and work toward resolving default.
Benefit with metrics: Online payments can shift payment turnaround from days (mail processing) to minutes (online confirmation), and 24/7 self-service can reduce support calls for basic balance, history, and document requests.
Auto-pay also reduces missed-payment risk by automating monthly payments and keeping your account details current.


---
Flourish
---
Fintech-focused role

Rules
- Preserve IC seniority
- Align with JD (include the parts Brex and Trellis did not include)
- Reflect technologies appropriate to the date range
- Remember. Fintech tone in every bullet
- Explicit inclusion of:
  - Payments, checkout, fraud, compliance, or scale concepts

Bullet Counts(Strict): 5-7
 - Each bullet point should follow SAR structure especially include metrix
 - Word count should be 8~11.

Product:
Product name: Flourish Cash.
What’s it? Flourish Cash is a high-yield cash management account that financial advisors can offer to clients through Flourish Financial LLC (a broker-dealer).
It isn’t a traditional single-bank account—instead, it sweeps client cash into a network of FDIC-insured partner banks.
How use it? You (or your advisor) open the account and fund it from your regular checking or savings account.
Your money is automatically distributed across multiple partner banks behind the scenes rather than sitting at Flourish.
You can still move cash in and out like normal, with unlimited transfers back to your checking account that typically settle quickly.
Why should we use it? It’s designed for clients who want safety + liquidity while earning more on idle cash than typical checking/savings.
It’s especially useful for larger cash balances that would exceed the standard FDIC limit at a single bank.
Result: Cash becomes easier to manage as part of an advisor-led plan—kept accessible for near-term needs while earning a competitive yield.
Benefit with metrics: FDIC protection can extend beyond the usual $250,000 per depositor per bank by spreading funds across many banks (potentially into the millions, depending on the program structure and number of partner banks).
Interest earned is often meaningfully higher than standard checking/savings (sometimes multiple times higher), and accounts are typically structured with no monthly fees or minimum balances.
  `,
  'hollandcody54@gmail.com': `
----------------------------------------
AKASA (PRIMARY ROLE – STRICTEST)
----------------------------------------
Healthcare-focused role

Mandatory Inclusions
- Strongly Mention about follow Product
- 100% of:
  - JD mandatory requirements
  - JD optional / preferred / bonus/ nice-to-have requirements
- Remember. Healthcare tone in every bullet
- Explicit inclusion of:
  - HL7 / FHIR / interoperability concepts
  - HIPAA, PHI/PII, audit logging, RBAC, encryption
- DevOps:
  - CI/CD pipelines
  - Docker
  - Kubernetes
  - Monitoring / observability
- Testing:
  - Unit, integration, and E2E testing tools
- Agile:
  - Jira, Kanban / Scrum
  - Version control (Git, Bitbucket, etc.)
- Cross-functional coordination:
  - Product
  - QA
  - Compliance
  - Clinical or healthcare SMEs
- Mentorship or technical leadership

Bullet Counts(Strict): 11–13
 - Each bullet point should follow SAR structure especially include metrix
 - Word count should be 12~18.

Product:
Product Name: Insurance Eligibility Verification Automation (AKASA, Unified Automation®).
What it’s for: Automates insurance eligibility/benefits checks at registration—an early, high-impact step in the revenue cycle.
What it does: Runs real-time or near real-time eligibility verification via EDI 270/271 (clearinghouse or direct APIs) and confirms coverage status, effective dates, plan type, copays, deductibles, and coinsurance.
It uses AI/NLP to interpret payer responses (271 and portal data) and maps results into the EHR/PM record.
How it works: Appointment/registration triggers the check → pulls patient demographics + insurance → submits payer query → parses payer response → updates record automatically.
Exception handling: Detects issues (inactive coverage, bad member ID) and auto-corrects when possible or flags staff using Expert-in-the-Loop® for complex cases.
Integration: Connects with major EHRs (e.g., Epic, Cerner, Meditech) and can alert/hold workflows until eligibility is confirmed.
Results (quantified): ~70%–90% manual workload reduction; 15%–30% fewer eligibility-related denials; verification time drops from ~5–10 minutes to <30 seconds per case; staff capacity shifts to higher-value work.
Benefits (with metrics): Faster registration and cleaner claims, measured by time-to-verify (<30s), denial reduction (15%–30%), and workload reduction (70%–90%), plus improved upfront patient cost transparency.
Security/Compliance: HIPAA-aligned, encrypted transactions, and full logging/audit trails for payer communications.

----------------------------------------
Medely
----------------------------------------
Healthcare-focused role

Rules
- Strongly Mention about follow Product
- Preserve seniority tone
- Align tightly with JD (include mainly the parts Medely did not include)
- Reflect technologies appropriate to the date range
- Remember. Healthcare tone in every bullet
- Include:
  - Cross-functional collaboration
  - Stakeholder interaction

Bullet Counts(Strict): 8-10
 - Each bullet point should follow SAR structure especially include metrix
 - Word count should be 10~13.

Product:
Product Name: Digital Staffing Marketplace Platform (Medely).
What it’s for: On-demand healthcare staffing that connects facilities with pre-vetted clinicians for per diem shifts and travel contracts.
What it does: Facilities post shifts/contracts, review verified profiles, and book clinicians directly; clinicians browse jobs, manage credentials, accept shifts, and track pay.
How it works: Clinicians onboard and upload licenses/certs → Medely verifies credentials → facilities post needs (role, time, pay, requirements) → AI matches qualified local/available clinicians.
Real-time execution: Clinicians get instant app alerts and accept shifts in the mobile/web app, replacing slow agency back-and-forth.
Shift completion: Attendance and completion are tracked, then both sides rate each other to improve future matching and transparency.
Payments: Medely manages clinician payouts and facility invoicing (typically commission/per-shift fee).
Key features: Mobile/web access, automated credential tracking, smart matching, shift manager, two-way ratings, and integrated payments.
Results: Faster fill speed (often hours vs days), better schedule coverage, and improved visibility into performance and shift history.
Benefits (with metrics to track): Facilities track time-to-fill, fill rate, cost per shift vs agency, cancellation/no-show rate, credential compliance rate, and average clinician rating; clinicians track hours worked, earnings per hour, time-to-payment, shift acceptance rate, and rating score.
Compliance/Security: HIPAA-aligned data protections, credential compliance controls, and audit logs for transparency and dispute resolution.

----------------------------------------
Prime Healthcare
----------------------------------------
Healthcare-focused role

Rules
- Strongly Mention about follow Product
- Preserve IC seniority
- Align with JD (include the parts AKASA and Medely did not include)
- Reflect technologies appropriate to the date range
- Remember. Healthcare tone in every bullet

Bullet Counts(Strict): 5-7
 - Each bullet point should follow SAR structure especially include metrix
 - Word count should be 8~11.

Product:
Product Name: Women’s Health and Maternity Services (Prime Healthcare), a hospital-based and outpatient clinical service line offered across selected facilities.
What it’s for: It provides comprehensive women’s care across the life cycle—from adolescence through post-menopause—with a strong focus on pregnancy, childbirth, and postpartum health.
The service covers obstetrics, neonatal care (Level I–III NICU in select hospitals), gynecology, and select specialty services (e.g., urogynecology, limited infertility support, GYN oncology via select sites or referral networks).
How it works: Patients enter through prenatal intake or routine GYN visits and receive coordinated screening, imaging, labs, diagnosis, treatment, and follow-up across outpatient and hospital settings.
Pregnancy care follows a structured pathway: prenatal visits and testing → hospital admission for delivery (vaginal or C-section) with anesthesia and neonatal support → postpartum monitoring and discharge planning.
Gynecologic care includes annual wellness exams, symptom-based evaluation, diagnostics (ultrasound, biopsies, hormone panels), minimally invasive or surgical procedures, and long-term management.
Infrastructure/staffing: Dedicated L&D units in maternity hospitals, OB/GYNs (employed/affiliated), CNMs in select regions, NICU teams where available, 24/7 anesthesia support in laboring hospitals, and women’s imaging (mammography, pelvic ultrasound, DEXA).
Results: Performance is tracked using internal KPIs and external benchmarks to monitor safety, outcomes, and patient experience across facilities.
Benefits for patients (with metrics): Better continuity and maternal-newborn outcomes measured by C-section rate (Joint Commission/Leapfrog), preterm birth rate (CDC/March of Dimes), postpartum readmission rate (CMS Core Measures), maternal complication rate (AHRQ/state registries), and breastfeeding initiation rate (Baby-Friendly metrics in select hospitals).
Benefits for the health system (with metrics): Predictable maternity volume and stronger quality/value-based performance reflected in CMS Core Measures (e.g., readmissions), Joint Commission/Leapfrog perinatal measures (e.g., C-sections), and maternal safety/complication indicators (AHRQ/state registries).
Note on availability: Services vary by hospital based on size, local demand, licensure/NICU level, and state regulations/funding.
`,
}

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

    // Get user-specific prompt addition
    const userPromptAddition = userPromptAdditions[account] || ''

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
- Second company job title must be follow rules
  - Find Primary Stack and make title related that stack
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
- Every experience bullet must include metric
- Cross-functional collaboration is required in all roles
- Stakeholder interaction must be explicit
- CRITICAL: Do NOT duplicate experience entries. Each job (title + company + startDate) must appear only ONCE in the experience array

${userPromptAddition}

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
        const pdfBuf = await page.pdf({ format: 'Letter', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } })
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

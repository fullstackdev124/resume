"use client"

import React, { useState } from 'react'
import AccountSelector from '../components/AccountSelector'
import ResumeViewer from '../components/ResumeViewer'

const mockAccounts = ['kaylarelyease@gmail.com', 'adriannabarrientoscc@gmail.com']
const mockResumes: Record<string,string> = {
  'kaylarelyease@gmail.com': `Kayla Relyea
Senior Full Stack Engineer
Nassau, NY | (561) 264-2813 | kaylarelyease@gmail.com
SUMMARY
Senior Full Stack Engineer with 10 years of experience designing and scaling healthcare, teletherapy, and enterprise 
SaaS platforms. Specializes in .NET Core microservices, Angular/Vue UI engineering, event-driven architectures, and 
HIPAA-aligned systems supporting millions of users. Known for improving clinical workflows, optimizing high-volume 
payer operations, modernizing legacy systems, and strengthening platform reliability across cloud-native 
environments. Collaborates closely with clinicians, compliance teams, and product leaders to deliver resilient, secure, 
and measurable outcomes.
TECHNICAL SKILLS
 Backend 
C#, .NET Core, ASP.NET Core, CQRS, Microservices, REST, GraphQL, EF Core, LINQ, Async Processing, Distributed 
Services 
 Frontend 
Angular, Vue, TypeScript, Next.js (SSR), RxJS, Component Architecture, UX-driven UI Engineering 
 Cloud & DevOps 
Azure App Service, Azure Kubernetes Service (AKS), Azure Functions, Azure Service Bus, Docker, Kubernetes, 
Terraform, Jenkins, GitHub Actions, CI/CD automation, Blue/Green Deployments 
 Data & Storage 
SQL Server, PostgreSQL, Redis, Cosmos DB, Oracle, Polyglot Persistence, Query Optimization, Distributed Caching 
 Messaging & Eventing 
Kafka, Kafka Streams, Event-Driven Architecture, Asynchronous Workflows, Service Bus Queues/Topics 
 Testing & Quality 
NUnit, Moq, Jest, Selenium, TDD, BDD, Integration Testing, Automation Frameworks, Load/Performance Testing 
 Observability 
Grafana, Prometheus, Azure Monitor, Distributed Tracing, APM, Logging Pipelines 
 AI & Productivity 
Copilot, ChatGPT, Gemini for code scaffolding, test generation, risk-model validation, and engineering 
acceleration 
 Collaboration & Delivery 
Agile (Scrum/Kanban), Cross-functional Communication, Requirement Refinement, HIPAA & CMS Compliance 
Alignment
PROFESSIONAL EXPERIENCE
BetterHelp Jan 2022 – Present
Senior Full Stack Engineer | Remote(US)
 Redesigned BetterHelp’s n -intake pipeline by implementing .NET 7 microservices and CQRS, improving 
triage accuracy 33% for users seeking therapy. 
 Recalibrated therapist-assignment workflows by integrating SQL Server, Redis caching, and Kafka event flows, 
reducing matching delays 28% across global time zones. 
 Revitalized the PHI-secure messaging experience by rebuilding UI flows with Angular, Vue, and Next.js SSR, 
cutting message-load time 31% during peak usage. 
 Safeguarded privacy controls through encrypted GraphQL APIs and Cosmos DB persistence, protecting more than 
4M HIPAA-regulated therapy conversations monthly. 
 Augmented therapist-matching accuracy by integrating Python scoring signals, ML-driven clustering, and Redis 
backed lookups, increasing match satisfaction 24% and lowering reassignment rates 19%. 
 Fortified crisis-routing reliability by rebuilding .NET Core services and introducing Service Bus queueing and Kafka 
escalation workflows, reducing emergency response time 42% for high-risk users. 
 Refined session scheduling through a .NET 6 migration, EF Core optimizations, and resilient cache strategies, 
decreasing booking latency 34% and supporting higher peak traffic. 
 Reframed therapist dashboards using Angular, RxJS, and optimized ASP.NET Core APIs, reducing navigation 
friction 27% and increasing clinician engagement 22%. 
 Engineered HIPAA-compliant billing microservices with ASP.NET Core, SQL Server, Stripe integrations, and Kafka 
audit logs, improving payout accuracy 25% and eliminating 30% of reconciliation errors. 
 Elevated observability with Grafana, Prometheus, Azure Monitor, and distributed tracing, reducing incident 
resolution time 45%. 
 Stabilized deployment reliability by containerizing workloads with Docker and deploying via Azure App Service, 
AKS, Terraform, and GitHub Actions, reducing failed releases 37% and lowering infrastructure costs 23%. 
 Accelerated engineering velocity using AI-assisted tooling for API scaffolding and automated testing with NUnit, 
Moq, and Jest, reducing development cycle time 20%. 
 Aligned clinical workflow and compliance expectations by collaborating with clinical, risk, and privacy teams, 
improving audit readiness 40%. 
 Introduced RESTful API layers across therapy-matching, messaging, and billing workflows using ASP.NET Core and 
API versioning patterns, strengthening service interoperability for internal clinical tools. 
 Implemented scalable Entity Framework Core models and migrations to support evolving therapy-session, billing, 
and risk-classification data structures, improving schema consistency and reducing data-related defects 31%. 
 Extended MVC patterns within internal clinician-facing tools by integrating ASP.NET MVC views and controllers, 
improving maintainability and supporting rapid rollout of compliance-driven UI updates. 
 Incorporated ERP-style operational logic into billing and therapist-management systems, streamlining payout
authorization, caseload adjustments, and clinical-resource workflows across distributed teams. 
 Mentored engineers on .NET service patterns, API design, and data-flow integration, reducing backend-related 
rework 18% across feature teams.
Optum, UnitedHealth Group Aug 2018 – Dec 2021
Full Stack Developer | Minneapolis, MN
 Transformed claims-adjudication services by rebuilding core components with .NET 7 microservices and CQRS, 
improving adjudication latency 36% for national payer networks. 
 Maximized claims-processing throughput by tuning EF Core, SQL Server indexing, Redis caching, and Kafka 
pipelines, raising capacity 41% during peak enrollment. 
 Reorganized prior-authorization workflows by restructuring Angular UI flows, adding Vue micro-interactions, and 
adopting GraphQL for clinical criteria retrieval, reducing approval turnaround 28%.
 Diminished manual review burden by aligning service orchestration with FHIR-based rules and automated 
routing, decreasing clinician review load 19%. 
 Advanced risk-scoring accuracy by integrating Python predictive models with optimized PostgreSQL/Oracle 
processing and asynchronous .NET workflows, increasing precision 26%. 
 Reinforced member-access security through OAuth2/JWT rotation, PHI masking, encrypted communication, and 
Kafka/Service Bus verification layers, reducing CMS audit deviations 40%. 
 Optimized provider-search performance using Next.js SSR, Angular refactoring, and SQL Server + Redis indexing, 
lowering search latency 33% across 2.3M+ monthly queries. 
 Standardized interoperability by building FHIR R4 APIs, HL7 translation services, and Cosmos DB validation layers, 
improving clinic-to-payer data-exchange reliability 29%. 
 Clarified pharmacy-benefit transparency by exposing formulary and pricing data through .NET microservices, 
increasing cost-accuracy metrics 22%. 
 Bolstered platform resiliency by implementing Prometheus metrics, Grafana dashboards, Datadog APM, reducing 
MTTD/MTTR 43%. 
 Converted legacy systems by migrating .NET Framework applications to containerized .NET 6 services on AWS EKS 
using Docker, Kubernetes, Terraform, and Jenkins, reducing deployment time and compute spend 27%. 
 Streamlined development velocity with AI-assisted tooling and automated testing using NUnit, Moq, Jest, and 
Selenium, reducing feature cycle time 17%. 
 Coordinated CMS-driven platform releases with clinicians, pharmacy SMEs, actuarial analysts, and compliance 
teams to ensure regulatory alignment.
 Expanded .NET platform capabilities by architecting multi-layered services using domain-driven patterns, 
repository abstractions, and EF Core LINQ pipelines, reducing logic duplication and enhancing code clarity.
MojoTech May 2015 – Jul 2018
Software Engineer | Providence, RI
 Delivered a healthcare appointment-routing module by building .NET microservices with EF Core and integrating 
SQL Server, Redis, and Kafka workflows, improving triage accuracy 21% and reducing scheduling friction 26%. 
 Devised a fintech transaction-risk classifier using Python anomaly detection, Redis-backed scoring, and GraphQL 
APIs, reducing manual fraud-review volume 33% while meeting strict real-time SLAs. 
 Constructed an ecommerce inventory-visibility system with Next.js SSR, .NET aggregation services, and 
PostgreSQL/Cosmos DB projections, reducing stock-sync delays 38% and increasing conversion rates 15%. 
 Transitioned legacy client platforms to containerized .NET 6 services on AWS ECS using Docker, Terraform, and 
Jenkins, shortening deployment cycles 42% and lowering infrastructure costs 18%. 
 Enhanced analytics dashboards with Angular, RxJS, Vue overlays, and optimized ASP.NET Core endpoints, 
reducing render latency 29% and increasing reporting adoption among business teams. 
 Expedited delivery across multi-industry engagements through Copilot, ChatGPT, and Gemini for boilerplate code 
and test scaffolding, improving engineering throughput 17%. 
 Orchestrated client alignment via discovery workshops, backlog refinement, and sprint reviews, improving 
requirement clarity 32% and contributing to consistent on-time releases.
EDUCATION
New York University, New York
B.S. in Computer Engineering Aug 2011 – May 2015`,
  'adriannabarrientoscc@gmail.com': `Adrianna Barrientos
Address Corpus Christi, TX 78411
Phone (302) 364-0974
E-mail adriannabarrientoscc@gmail.com
SUMMARY
Senior Platform Engineer with 9+ years of experience designing cloud-native infrastructure and developer platforms 
for FinTech and large-scale eCommerce systems. Specializes in AWS, Kubernetes, Terraform, and CI/CD automation, 
with strong application development roots in Java and Python. Proven record of accelerating engineering velocity 
through AI-augmented development workflows, including reducing boilerplate generation time by 41% and cutting 
incident recovery time by approximately 45% while maintaining production-grade reliability and security standards.
SKILLS
Backend: Java, Python, Go, Spring Boot, REST APIs, Microservices, Distributed Systems
Frontend: JavaScript, TypeScript, Angular, HTML, CSS, Developer Tooling, Internal Platforms
Cloud: AWS, EKS, EC2, Lambda, RDS, S3, Kubernetes, Cloud-Native Architecture
Data: PostgreSQL, MySQL, DynamoDB, Redis, SQL, Metrics and Telemetry
Tools: Terraform, Docker, GitHub Actions, Jenkins, Prometheus, Grafana, ELK Stack, Chaos Engineering
Industry: Real-Time Transaction Systems, Platform Engineering, Developer Productivity, CI/CD Automation, 
Regulated Cloud Environments, Security and Compliance, High-Availability Systems
WORK HISTORY
Senior Platform Engineer
Luxoft 10/2022 – Present | New York, NY
Key Qualifications & Responsibilities
• Architected and operated highly available platform infrastructure on AWS to support distributed engineering 
teams delivering transaction-heavy systems.
• Designed Kubernetes-based runtime platforms enabling standardized service deployment, autoscaling, and 
environment isolation.
• Established infrastructure-as-code practices using Terraform to provision and govern cloud resources across 
multiple environments.
• Built and maintained CI/CD pipelines integrating automated testing, security scanning, and deployment 
orchestration.
• Championed AI-augmented development workflows using GitHub Copilot and Cursor, defining prompt 
standards, validation patterns, and review checklists.
• Implemented observability standards including metrics, logging, tracing, and alerting to strengthen platform 
reliability.
• Partnered with software engineers, product stakeholders, and client teams to deliver internal tools accelerating 
feature delivery.
• Led incident response and on-call operations, driving post-incident reviews and preventative remediation.
• Mentored engineers on DevOps culture, operational excellence, and platform-first design principles.
Key Achievements
• Reduced boilerplate infrastructure and service setup time by 41% through AI-assisted code generation and 
reusable Terraform modules.
• Lowered mean time to recovery by approximately 45% by standardizing dashboards, alerts, and runbooks.
• Improved deployment success rates by 33% after introducing progressive delivery and automated rollback 
strategies.
• Decreased configuration drift incidents by 58% through enforced infrastructure-as-code controls.
• Enabled teams to ship production changes nearly twice as fast by streamlining CI/CD pipelines and developer 
tooling.
• Strengthened platform security posture by embedding policy-as-code and automated compliance checks into 
pipelines.
Skills: AWS, Kubernetes, Terraform, CI/CD, Docker, Observability, GitHub Copilot, Cursor, DevOps, Platform 
Engineering
Full Stack Developer
IncWorx Consulting 08/2019 – 09/2022 | Schaumburg, IL
Key Qualifications & Responsibilities
• Delivered cloud-based applications and internal platforms with strong emphasis on reliability, automation, and 
secure deployments.
• Engineered backend services in Java and Python supporting transaction-heavy business workflows.
• Implemented CI/CD pipelines and automated environment provisioning for client systems on AWS.
• Introduced centralized logging and monitoring to improve operational visibility across services.
• Worked directly with client stakeholders and QA teams to align technical delivery with business outcomes.
• Applied Agile practices to manage delivery in consulting-driven engagements.
Key Achievements
• Cut manual deployment effort by about 60% by automating build and release pipelines.
• Improved incident detection time by 35% through structured logging and alerting adoption.
• Reduced recurring operational issues by 27% by standardizing environment configurations.
• Increased development throughput by roughly 25% through reusable service templates.
• Maintained consistent delivery timelines across concurrent client engagements.
Skills: Java, Python, AWS, CI/CD, Automation, Monitoring, Agile
Software Engineer
Amazon 05/2016 – 07/2019 | Seattle, WA
Key Qualifications & Responsibilities
• Developed backend services supporting high-traffic eCommerce platforms and internal tooling.
• Operated services in production environments with strict availability and latency requirements.
• Built deployment automation and monitoring solutions to support service ownership.
• Optimized databases and service interactions to handle peak load conditions.
• Participated in on-call rotations ensuring platform stability.
Key Achievements
• Supported systems handling over 10 million daily events with consistent availability.
• Reduced service alert noise by nearly half through alert tuning and SLO-based thresholds.
• Improved deployment reliability by 38% by introducing automated health checks.
• Enhanced operational readiness through detailed runbooks and dashboards.
• Strengthened engineering ownership culture through operational excellence practices.
Skills: Java, AWS, Monitoring, Automation, CI/CD, Distributed Systems
EDUCATION
Bachelor of Computer Science
University of North Texas 08/2012 – 05/2016 | Dallas`,
}

const mockTemplates: Record<string,string> = {
  'kaylarelyease@gmail.com': 'standard-b',
  'adriannabarrientoscc@gmail.com': 'standard-c',
}

export default function Page() {
  const [account, setAccount] = useState(mockAccounts[0])
  const [resumes, setResumes] = useState<Record<string,string>>(mockResumes)
  const templateMap: Record<string,string> = mockTemplates
  const [jobDesc, setJobDesc] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [generated, setGenerated] = useState<string | null>(null)
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setGenerated(null)
    setPdfBase64(null) // Hide download button immediately
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, jd: jobDesc, resumeContent: resumes[account], template: templateMap[account] }),
      })
      const data = await res.json()
      // route returns resume JSON and optional pdfBase64
      const resume = data.resume || data
      setGenerated(JSON.stringify(resume, null, 2) || 'No resume returned')
      setResumeData(resume)
      setPdfBase64(data.pdfBase64 || null)
    } catch (e) {
      setGenerated('Error generating resume')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    // keep for potential future use; no-op now
  }, [])

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resume Updater</h1>

      <div className="grid gap-6" style={{ gridTemplateColumns: '30% 70%' }}>
        <div>
          <AccountSelector accounts={mockAccounts} value={account} onChange={setAccount} />
          <div className="mt-6">
            <ResumeViewer resumeText={resumes[account]} />
          </div>
        </div>

        <div>
          <label className="block text-xl font-semibold">Identifier</label>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="file-name-or-id" className="mt-1 p-2 border rounded w-full text-base" />

          <label className="block text-xl font-semibold mt-4">Job description</label>
          <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={12} className="mt-1 p-2 border rounded w-full text-base" />

          <div className="mt-4 flex items-start justify-between">
            <div>
              <button onClick={handleGenerate} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Updated Resume'}
              </button>
            </div>

            <div>
              {pdfBase64 && (
                <button
                  className="ml-4 px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={downloading}
                  onClick={async () => {
                    setDownloading(true)
                    
                    // Save resume data to Supabase
                    if (resumeData) {
                      try {
                        await fetch('/api/save-resume', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ json: resumeData }),
                        })
                      } catch (error) {
                        console.error('Failed to save resume to Supabase:', error)
                        // Continue with download even if save fails
                      }
                    }

                    // Download the PDF
                    const link = document.createElement('a')
                    link.href = `data:application/pdf;base64,${pdfBase64}`
                    
                    // Extract first name from resume data
                    let firstName = ''
                    if (resumeData?.name) {
                      const nameParts = resumeData.name.trim().split(/\s+/)
                      firstName = nameParts[0] || ''
                    }
                    
                    // Use first name + identifier as filename
                    const identifierPart = identifier && identifier.trim() ? identifier.trim() : ''
                    const filename = identifierPart 
                      ? `${firstName}-${identifierPart}.pdf`
                      : firstName 
                        ? `${firstName}-resume.pdf`
                        : 'resume.pdf'
                    
                    link.download = filename
                    link.click()
                    // initialize identifier after download
                    setIdentifier('')
                    setDownloading(false)
                  }}
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Generated Resume</h3>
            <div className="mt-2 p-4 border rounded bg-white text-sm whitespace-pre-wrap">
              {generated ?? 'No generated resume yet.'}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
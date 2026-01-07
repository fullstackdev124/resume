"use client"

import React, { useState } from 'react'
import AccountSelector from '../components/AccountSelector'
import ResumeViewer from '../components/ResumeViewer'

const mockAccounts = ['kaylarelyease@gmail.com', 'adriannabarrientoscc@gmail.com', 'adonish495@gmail.com', 'hollandcody54@gmail.com']
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
  'adonish495@gmail.com': `Adonis Hill
Senior Full Stack Engineer
adonish495@gmail.com | Hutto, TX 78634 | (818) 351-9995

SUMMARY
Senior Full Stack Engineer with 8+ years of experience building scalable, cloud–native fintech platforms with a focus on backend development using .NET Framework, .NET Core, and ASP.NET MVC/Web API. Proven track record of modernizing legacy systems through .NET version migration and designing high–performance services integrated with RabbitMQ, Kafka, and distributed data stores. Skilled in deploying production–ready systems on Azure and AWS using Docker, Kubernetes, and CI/CD pipelines. Experienced in leading cross–functional teams, mentoring engineers, and driving delivery across complex product ecosystems.
TECHNICAL SKILLS
Programming Languages: C#, Python, JavaScript, TypeScript, SQL, Bash, HTML, CSS
Backend Frameworks: .NET Framework 4.x, .NET Core 3.1, .NET 5, .NET 6, .NET 7, ASP.NET MVC, ASP.NET Web API, gRPC, Node.js, Express.js, FastAPI, Django, Flask
Frontend Frameworks & Libraries: Angular, React, Vue.js, Next.js, TypeScript, jQuery, Material UI, Ant Design, Bootstrap, Tailwind CSS, Chakra UI
Databases: SQL Server, PostgreSQL, MySQL, MongoDB, DynamoDB, Redis, Cosmos DB
ORM & Data Access: Entity Framework Core, Dapper, ADO.NET, Sequelize, Prisma, TypeORM
Messaging & Event Streaming: RabbitMQ, Apache Kafka, Azure Service Bus, AWS SQS/SNS, NATS
DevOps & CI/CD Frameworks: Docker, Kubernetes, Helm, GitHub Actions, Azure DevOps, Jenkins, CircleCI, ArgoCD
Cloud Platforms: Azure, AWS, GCP, Firebase, Netlify, Vercel
Monitoring & Logging Frameworks: App Insights, Prometheus, Grafana, Serilog, OpenTelemetry, NLog, ELK Stack
Authentication & Security: OAuth2, JWT, ASP.NET Identity, Azure Active Directory, Keycloak, Auth0
Testing Frameworks: xUnit, NUnit, Jest, Mocha, Cypress, Selenium, Postman, Playwright
AI / ML Tools: TensorFlow, PyTorch, Scikit–learn, Hugging Face, OCR Tools
API Documentation: Swagger, OpenAPI, Postman, Redoc
Version Control & Collaboration: Git, GitHub, GitLab, Bitbucket, Jira, Confluence, Slack
Infrastructure as Code: Terraform, Bicep, Pulumi, AWS CloudFormation
PROFESSIONAL EXPERIENCE
Brex | San Francisco, CA
Senior Full Stack Engineer	Apr 2022 – Present
Architected scalable booking and spend–approval microservices using .NET 6, gRPC, and PostgreSQL, enabling real–time travel policy enforcement for 50K+ monthly users with 99.98% uptime.
Modernized legacy ASP.NET MVC modules by refactoring into containerized .NET Core APIs, reducing code complexity by 47% and improving CI/CD pipeline deployment times by 62%.
Engineered high–performance, event–driven booking flows using RabbitMQ and Redis caching, decreasing travel checkout latency by 40% during peak hours.
Integrated Angular and TypeScript frontends with dynamic policy logic and instant card payments, improving booking completion rates by 33% across desktop and mobile platforms.
Orchestrated infrastructure migrations to Kubernetes and Azure App Services with Prometheus and OpenTelemetry observability, increasing production incident visibility by 4x.
Implemented AI–powered flagging of out–of–policy bookings via Python and PyTorch classifiers, reducing manual expense review time by 70% for the finance team.
Consolidated disparate authentication layers into a centralized OAuth2 + JWT–based identity service, aligning security practices across 4 platform modules and ensuring SOC 2 compliance.
Led cross–functional initiatives with PMs, QA, and DevOps to create modular services for approvals, reconciliation, and accounting sync, accelerating feature release cadence by 45%.
Mentored 6+ junior engineers through onboarding, biweekly code review sessions, and authored 12+ internal design docs on architectural patterns and service ownership.
Reduced platform technical debt by replacing brittle monolith patterns with decoupled service contracts via Dapper and Entity Framework Core, improving long–term maintainability scores by 2.6x.
Spearheaded observability standardization using Serilog, Azure App Insights, and Grafana dashboards, cutting triage times by 58% during on–call rotations.
Trellis |	Los Angeles, CA
Full Stack Engineer	Feb 2018 – Mar 2022
Developed scalable loan account management features using ASP.NET Core (C#), Angular, and Azure SQL, enabling 24/7 access to real–time borrower data for 120K+ monthly active users.
Optimized critical API endpoints powering payment history and auto–pay setup with Dapper and PostgreSQL, reducing average response times by 48% and supporting 3x traffic spikes.
Implemented end–to–end CI/CD pipelines with Docker and GitHub Actions, cutting deployment cycle times by 60% and improving engineering velocity across 3 agile squads.
Integrated secure authentication via ASP.NET Identity, OAuth2, and JWT, hardening protection of sensitive loan data and achieving 100% compliance with updated federal audit requirements.
Partnered with QA, designers, and PMs to refactor front–end workflows in Angular and React, decreasing user–reported bugs by 35% and improving portal stability for mobile and desktop users.
Flourish | Dallas, TX
Software Engineer	Jun 2015 – Jan 2018
Engineered secure cash movement and investment tracking workflows using .NET (C#), SQL Server, and Redis, reducing transaction latency by 31% while ensuring SOC 2 and SEC–compliant data handling.
Architected backend services powering FDIC–sweep operations across partner banks via Azure App Services and App Insights, increasing high–yield account coverage automation by 4x.
Integrated Angular frontends with RESTful APIs and real–time Redis caching to support advisor and client dashboards, boosting session stability by 45% under high–load conditions.
Collaborated with QA engineers, PMs, and senior developers in agile sprints to refactor reporting pipelines, cutting monthly reconciliation errors by 70%.
EDUCATION
University of Texas, Austin
B.S. in Computer Science | May 2015 | Cumulative GPA: 3.7`,
  'hollandcody54@gmail.com': `Cody Holland
Senior Full Stack Engineer
Norco, CA 92860 | (650) 451–5345 | hollandcody54@gmail.com
SUMMARY
Senior Full Stack Engineer with 10+ years delivering healthcare platforms, focused on RCM, payer–provider interoperability, and PHI–safe workflows. Microservices and APIs across REST, GraphQL (Hot Chocolate), gRPC, and event streaming with Kafka, backed by SQL Server/PostgreSQL and MongoDB/Cosmos DB/Redis. Delivered measurable outcomes including p95 latency 28% reduction, eligibility denials 22% reduction, and 32% faster dashboard load through performance tuning and scalable architecture. Implemented HIPAA/PHI controls, HL7 v2/FHIR R4/X12 270/271 integrations, cloud delivery on AWS/Azure/GCP with Docker/Kubernetes, CI/CD, observability, and GenAI workflows using Azure OpenAI, Databricks, Python.
TECHNICAL SKILLS
Languages: C#, .NET, Python, SQL, LINQ
Backend: .NET 6/7/8, ASP.NET Core 6–8, Minimal APIs, MVC, Web API, EF Core 6–8, Dapper, MediatR (CQRS), AutoMapper, Polly, Hangfire, gRPC, SignalR, Swagger/Swashbuckle, OpenAPI, Hot Chocolate (GraphQL)
Frontend: Blazor WebAssembly (.NET 7/8), Blazor Server (.NET 6–8), Razor Pages, HTML5, CSS3/SCSS
Desktop: WPF (.NET Framework 4.7.2 / .NET 6+), .NET MAUI (.NET 7/8), WinForms, XAML, MVVM
Databases & Caching: SQL Server, PostgreSQL, MongoDB, Cosmos DB, Redis
Messaging & Streaming: Kafka, Azure Service Bus, AWS SNS/SQS, GCP Pub/Sub
Cloud & DevOps: AWS, Azure, GCP, Docker, Kubernetes (AKS/EKS/GKE), Helm, Terraform, Azure DevOps Pipelines, GitHub Actions, Bitbucket Pipelines
Observability: OpenTelemetry, Application Insights, Azure Monitor, AWS CloudWatch, Serilog
Testing: xUnit, NUnit, MSTest, Moq, FluentAssertions, Coverlet, Testcontainers, Postman, Newman, Playwright
Security: OAuth2/OIDC, JWT, TLS, AES–256, Azure Key Vault, AWS KMS, IAM
AI / Data Platforms: Azure OpenAI, Databricks, Amazon SageMaker, embeddings, RAG patterns
Developer Tools: Visual Studio, VS Code, Rider, Git, Bitbucket, GitHub, NuGet, MSBuild, dotnet CLI, SonarQube, Jira, Confluence
PROFESSIONAL EXPERIENCE
AKASA	| San Francisco, CA
Senior Full Stack Engineer	| Apr 2022 – Present
Engineered X12 270/271 eligibility–verification microservice in ASP.NET Core 8 and EF Core 8, parsing payer responses and updating EHR records, reducing verification from 7 minutes to 25 seconds.
Normalized HL7 v2 to FHIR R4 adapters for Epic and Cerner via .NET 7 integration services, cutting interface errors 18% and enabling near–real–time coverage updates.
Choreographed Kafka event streams for payer responses and workqueue updates using .NET 8 consumers with outbox and idempotency patterns, boosting claim–status throughput 3x during peaks.
Published Hot Chocolate GraphQL gateway on .NET 8 over REST microservices, standardizing schemas with OpenAPI, trimming client round–trips 35% and accelerating RCM workflow iteration 25%.
Crafted Blazor WebAssembly dashboard on .NET 8 with RBAC and audit trails, integrating SignalR and Redis, improving load time 32% for 2,000 front–desk users.
Fortified PHI services under HIPAA BAAs by enforcing TLS, AES–256, and Azure Key Vault, plus immutable audit logs in .NET 8, achieving zero high–severity findings.
Accelerated CI/CD via Azure DevOps and GitHub Actions, running container scans and SonarQube gates, releasing .NET 7 to AKS and .NET 8 to EKS, raising frequency 3x.
Instrumented .NET 8 microservices with OpenTelemetry, Application Insights, and Serilog, tuning dashboards and alerts to cut p95 latency 28% and reduce alert noise 30%.
Instituted automated testing for ASP.NET Core 8 using xUnit, Moq, FluentAssertions, Testcontainers, and Playwright E2E, lifting coverage to 85% and lowering escaped defects 37%.
Embedded patient cost–estimation and payment capture in Blazor .NET 8, integrating Stripe tokenization and PCI controls, increasing upfront collections 18% while sustaining sub–2s checkout.
Steered GenAI denial triage using Azure OpenAI embeddings and Databricks on AWS, exposing scores through Python and .NET 8 APIs, cutting manual touches 70% and improving accuracy 12%.
Guided cross–functional Jira and Kanban delivery with Bitbucket Git workflows and PR standards, mentoring engineers on .NET 7 migration, shortening onboarding 30% and boosting sprint predictability 20%.
Medely | Los Angeles, CA
Senior .NET Engineer	| Feb 2018 – Mar 2022
Devised shift–matching microservices on .NET Core 3.1 with Kafka and Redis, scoring availability and specialty, increasing fill–rate 26% and supporting 10k concurrent clinician sessions.
Produced clinician onboarding and credentialing service in ASP.NET Core 3.1 with SQL Server and MongoDB, validating BLS and ACLS plus licensure, reducing review turnaround 45%.
Shaped Blazor Server portal on .NET 5 with role–based access and audit logs, enabling SignalR notifications, improving shift posting speed 30% for 1,200 healthcare facilities.
Surfaced Hot Chocolate GraphQL endpoints on .NET 6 over REST APIs for mobile clients, optimizing payload composition, reducing over–fetching 40% and improving responsiveness 22%.
Incorporated Stripe Connect payouts and webhook reconciliation into ASP.NET Core 6 services, enforcing idempotency keys and retries, reducing payout failures 35% and accelerating payments to 48 hours.
Upgraded monolithic .NET Core 2.2 platform to .NET 6 with EF Core 6 migrations and feature flags, reducing cold starts 25% and eliminating 40% high–risk CVEs.
Encapsulated .NET 6 services with Docker and deployed to GKE and EKS using Helm, automating Bitbucket Pipelines and Azure DevOps releases to cut deployment time 40%.
Reinforced quality gates for ASP.NET Core 6 with xUnit, NUnit, Postman, Newman, and Playwright E2E flows, increasing coverage 80% and reducing regressions 33% per release.
Safeguarded PHI–adjacent data in multi–tenant SaaS by implementing OAuth2 and OIDC, least–privilege IAM, and audit logging, lowering access incidents 30% in production across AWS, Azure, and GCP.
Piloted matching signals using Python and SageMaker, publishing scores into .NET 6 APIs and SQL Server, increasing shift acceptance 14% and reducing manual sorting 55%.
Aligned Jira epics with product and clinical operations by running demos, stakeholder reviews, and postmortems, improving roadmap alignment 20% and reducing SLA breaches 15% quarterly.
Prime Health Care |	Chino, CA
Software Engineer	| Jun 2015 – Jan 2018
Authored OB intake and prenatal scheduling module in ASP.NET MVC 5 on .NET Framework 4.7.2 with SQL Server, reducing registration time 25% across five clinics.
Interfaced HL7 v2 ADT and ORU feeds into EMR via .NET Framework 4.7.2 parsers and Polly retries, improving order timeliness 30% and cutting interface errors 18%.
Programmed WPF charge–capture desktop tool on .NET Framework 4.7.2 with ICD and CPT validation plus billing rules, reducing claim rework 20% and accelerating submission by two days.
Composed SSRS dashboards for NICU and postpartum quality metrics by optimizing SQL indexes and ETL jobs on SQL Server, improving runtimes 35% and supporting monthly leadership reviews.
Enforced HIPAA safeguards for PHI by implementing RBAC, audit trails, and TLS across ASP.NET Web API 2 services on .NET Framework 4.7.2, achieving zero high–severity findings.
Operationalized patient statement payment posting through PCI–conscious tokenization and reconciliation exports in C# .NET Framework 4.7.2, improving payment accuracy 15% and reducing posting delays 2 days.
Systematized release packaging using MSBuild, NuGet, and smoke–test scripts for ASP.NET MVC 5, reducing deployment window 40% and minimizing rollback incidents 30% in production.
EDUCATION
University of California, San Diego
B.S. in Computer Science | May 2015 | Cumulative GPA: 3.7`,
}

const mockTemplates: Record<string,string> = {
  'kaylarelyease@gmail.com': 'standard-b',
  'adriannabarrientoscc@gmail.com': 'standard-c',
  'adonish495@gmail.com': `standard-a`,
  'hollandcody54@gmail.com': `standard-d`,
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
                          body: JSON.stringify({ 
                            json: resumeData,
                            identifier: identifier && identifier.trim() ? identifier.trim() : null
                          }),
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
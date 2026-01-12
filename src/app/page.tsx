"use client"

import React, { useState } from 'react'
import AccountSelector from '../components/AccountSelector'
import ResumeViewer from '../components/ResumeViewer'

const mockAccounts = ['kaylarelyease@gmail.com', 'adriannabarrientoscc@gmail.com - Healthcare', 'adriannabarrientoscc@gmail.com - FinTech', 'adonish495@gmail.com', 'hollandcody54@gmail.com']
const mockResumes: Record<string,string> = {
  'kaylarelyease@gmail.com': `Kayla Relyea
Senior Full Stack Engineer
Nassau, NY | (561) 264-2813 | kaylarelyease@gmail.com

PROFESSIONAL EXPERIENCE
BetterHelp | Jan 2022 – Dec 2025
Senior Full Stack Engineer | Remote(US)

Optum, UnitedHealth Group | Aug 2018 – Dec 2021
Minneapolis, MN

MojoTech May 2015 – Jul 2018
Software Engineer | Providence, RI

EDUCATION
New York University, New York
B.S. in Computer Engineering Aug 2011 – May 2015`,

  'adriannabarrientoscc@gmail.com - Healthcare': `Adrianna Barrientos
Address Corpus Christi, TX 78411
Phone (302) 364-0974
E-mail adriannabarrientoscc@gmail.com

WORK HISTORY

Senior Software Engineer
Luxoft | 10/2022 – 12/2025 | New York, NY

IncWorx Consulting | 08/2019 – 09/2022 | Schaumburg, IL

Software Engineer
Amazon | 05/2016 – 07/2019 | Seattle, WA

EDUCATION
Bachelor of Computer Science
University of North Texas | 08/2012 – 05/2016 | Dallas`,

'adriannabarrientoscc@gmail.com - FinTech': `Adrianna Barrientos
Address Corpus Christi, TX 78411
Phone (302) 364-0974
E-mail adriannabarrientoscc@gmail.com

WORK HISTORY

Senior Software Engineer
Luxoft | 10/2022 – 12/2025 | New York, NY

IncWorx Consulting | 08/2019 – 09/2022 | Schaumburg, IL

Software Engineer
Amazon | 05/2016 – 07/2019 | Seattle, WA

EDUCATION
Bachelor of Computer Science
University of North Texas | 08/2012 – 05/2016 | Dallas`,

'adonish495@gmail.com': `Adonis Hill
Senior Full Stack Engineer
adonish495@gmail.com | Hutto, TX 78634 | (650) 451–5345

PROFESSIONAL EXPERIENCE
Brex | San Francisco, CA
Senior Full Stack Engineer | Apr 2022 – Present

Trellis |	Los Angeles, CA
Feb 2018 – Mar 2022

Flourish | Dallas, TX
Software Engineer	| Jun 2015 – Jan 2018

EDUCATION
University of Texas, Austin
B.S. in Computer Science | May 2015 | Cumulative GPA: 3.7`,

  'hollandcody54@gmail.com': `Cody Holland
Senior Full Stack Engineer
Norco, CA 92860 | (650) 451–5345 | hollandcody54@gmail.com

PROFESSIONAL EXPERIENCE
AKASA	| San Francisco, CA
Senior Full Stack Engineer	| Apr 2022 – Present

Medely | Los Angeles, CA
Feb 2018 – Mar 2022

Prime Health Care |	Chino, CA
Software Engineer	| Jun 2015 – Jan 2018

EDUCATION
University of California, San Diego
B.S. in Computer Science | May 2015 | Cumulative GPA: 3.7`,
}

const mockTemplates: Record<string,string> = {
  'kaylarelyease@gmail.com': 'standard-c',
  'adriannabarrientoscc@gmail.com - Healthcare': 'standard-a',
  'adriannabarrientoscc@gmail.com - FinTech': 'standard-a',
  'adonish495@gmail.com': `standard-b`,
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
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [coverLetterCopied, setCoverLetterCopied] = useState(false)
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [identifierWarning, setIdentifierWarning] = useState<string | null>(null)
  const [showJsonInput, setShowJsonInput] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [jsonResumeData, setJsonResumeData] = useState<any>(null)
  const [generatingJsonPdf, setGeneratingJsonPdf] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setGenerated(null)
    setPdfBase64(null) // Hide download button immediately
    setCoverLetter(null) // Clear previous cover letter
    setCoverLetterCopied(false) // Reset copy state
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, jd: jobDesc, resumeContent: resumes[account], template: templateMap[account] }),
      })
      const data = await res.json()
      // route returns resume JSON, optional pdfBase64, and cover letter
      const resume = data.resume || data
      setGenerated(JSON.stringify(resume, null, 2) || 'No resume returned')
      setResumeData(resume)
      setPdfBase64(data.pdfBase64 || null)
      // Don't set cover letter here - it will be generated separately
    } catch (e) {
      setGenerated('Error generating resume')
    } finally {
      setLoading(false)
    }
  }

  const validateJson = (jsonString: string): { valid: boolean; data: any; error: string | null } => {
    if (!jsonString.trim()) {
      return { valid: false, data: null, error: 'JSON is required' }
    }
    try {
      const parsed = JSON.parse(jsonString)
      if (!parsed.name || !Array.isArray(parsed.experience)) {
        return { valid: false, data: null, error: 'Invalid resume JSON structure. Must have "name" and "experience" array.' }
      }
      return { valid: true, data: parsed, error: null }
    } catch (e) {
      return { valid: false, data: null, error: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}` }
    }
  }

  const handleJsonInputChange = (value: string) => {
    setJsonInput(value)
    setJsonError(null)
    setJsonResumeData(null)
    
    if (value.trim()) {
      const validation = validateJson(value)
      if (!validation.valid) {
        setJsonError(validation.error)
      } else {
        setJsonResumeData(validation.data)
      }
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!resumeData) {
      alert('Please generate a resume first.')
      return
    }
    if (!jobDesc) {
      alert('Please enter a job description first.')
      return
    }

    setGeneratingCoverLetter(true)
    setCoverLetter(null)
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeJson: resumeData,
          jobDescription: jobDesc
        }),
      })
      const data = await res.json()
      if (data.error) {
        alert(`Failed to generate cover letter: ${data.error}`)
      } else if (data.coverLetter) {
        setCoverLetter(data.coverLetter)
      }
    } catch (e) {
      alert('Failed to generate cover letter')
      console.error(e)
    } finally {
      setGeneratingCoverLetter(false)
    }
  }

  const handleDownloadJsonPdf = async () => {
    const validation = validateJson(jsonInput)
    if (!validation.valid) {
      setJsonError(validation.error)
      return
    }

    setGeneratingJsonPdf(true)
    setJsonError(null)
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          json: validation.data,
          template: templateMap[account] || 'standard-a'
        }),
      })
      const data = await res.json()
      if (data.error) {
        setJsonError(data.error)
      } else if (data.pdfBase64) {
        // Download the PDF immediately
        const link = document.createElement('a')
        link.href = `data:application/pdf;base64,${data.pdfBase64}`
        
        // Extract first name from resume data
        let firstName = ''
        if (validation.data?.name) {
          const nameParts = validation.data.name.trim().split(/\s+/)
          firstName = nameParts[0] || ''
        }
        
        const filename = firstName ? `${firstName}-resume.pdf` : 'resume.pdf'
        link.download = filename
        link.click()
      }
    } catch (e) {
      setJsonError('Failed to generate PDF')
    } finally {
      setGeneratingJsonPdf(false)
    }
  }

  React.useEffect(() => {
    // keep for potential future use; no-op now
  }, [])

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Resume Updater</h1>
        <button 
          onClick={() => setShowJsonInput(!showJsonInput)} 
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {showJsonInput ? 'Hide' : 'Generate from JSON'}
        </button>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '30% 70%' }}>
        <div>
          <AccountSelector accounts={mockAccounts} value={account} onChange={setAccount} />
          <div className="mt-6">
            <ResumeViewer resumeText={resumes[account]} />
          </div>
        </div>

        <div>
          {!showJsonInput && (
            <>
              <label className="block text-xl font-semibold">Identifier</label>
              <input value={identifier} onChange={(e) => {
                setIdentifier(e.target.value)
                setIdentifierWarning(null)
              }} placeholder="file-name-or-id" className="mt-1 p-2 border rounded w-full text-base" />
              {identifierWarning && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  {identifierWarning}
                </div>
              )}

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
                        // Check if identifier is empty
                        if (!identifier || !identifier.trim()) {
                          setIdentifierWarning('Please enter an identifier before downloading.')
                          return
                        }
                        
                        setIdentifierWarning(null)
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
                          ? `${firstName}-resume.pdf`
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
                <div className="mt-2 p-4 border rounded bg-white text-sm whitespace-pre-wrap overflow-y-auto" style={{ maxHeight: '200px' }}>
                  {generated ?? 'No generated resume yet.'}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Cover Letter</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateCoverLetter}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      disabled={generatingCoverLetter || !resumeData}
                    >
                      {generatingCoverLetter ? 'Generating...' : 'Generate Cover Letter'}
                    </button>
                    {coverLetter && (
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(coverLetter)
                            setCoverLetterCopied(true)
                            setTimeout(() => setCoverLetterCopied(false), 2000)
                          } catch (err) {
                            console.error('Failed to copy cover letter:', err)
                          }
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {coverLetterCopied ? 'Copied!' : 'Copy to Clipboard'}
                      </button>
                    )}
                  </div>
                </div>
                {coverLetter ? (
                  <div className="mt-2 p-4 border rounded bg-white text-sm whitespace-pre-wrap">
                    {coverLetter}
                  </div>
                ) : (
                  <div className="mt-2 p-4 border rounded bg-gray-50 text-sm text-gray-500">
                    Click "Generate Cover Letter" to create a cover letter based on your resume and job description.
                  </div>
                )}
              </div>
            </>
          )}

          {showJsonInput && (
            <div>
              <label className="block text-sm font-semibold mb-2">Paste Resume JSON</label>
              <textarea 
                value={jsonInput} 
                onChange={(e) => handleJsonInputChange(e.target.value)} 
                rows={12} 
                className="w-full p-2 border rounded text-sm font-mono"
                placeholder='{"name": "John Doe", "email": "john@example.com", "experience": [...], ...}'
              />
              {jsonError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {jsonError}
                </div>
              )}
              {jsonResumeData && !jsonError && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  ✓ Valid JSON structure
                </div>
              )}
              
              {jsonResumeData && !jsonError && (
                <div className="mt-4">
                  <button
                    onClick={handleDownloadJsonPdf}
                    className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={generatingJsonPdf}
                  >
                    {generatingJsonPdf ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
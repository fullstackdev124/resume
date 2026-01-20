"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AccountSelector from '../components/AccountSelector'

const allAccounts = ['kaylarelyease@gmail.com', 'adriannabarrientoscc@gmail.com - Healthcare', 'adriannabarrientoscc@gmail.com - FinTech', 'adonish495@gmail.com', 'hollandcody54@gmail.com']
const mockResumes: Record<string,string> = {
  'kaylarelyease@gmail.com': `Kayla Relyea
Senior Full Stack Engineer
Nassau, NY | (561) 264-2813 | kaylarelyease@gmail.com

PROFESSIONAL EXPERIENCE
BetterHelp | Jan 2022 – Dec 2025
Remote(US)

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

Luxoft | 10/2022 – 12/2025 | New York, NY

IncWorx Consulting | 08/2019 – 09/2022 | Schaumburg, IL

Software Engineer
Amazon | 05/2016 – 07/2019 | Seattle, WA

EDUCATION
Bachelor of Computer Science
University of North Texas | 08/2012 – 05/2016 | Dallas`,

'adonish495@gmail.com': `Adonis Hill
Senior Full Stack Engineer
adonish495@gmail.com | Hutto, TX 78634 | (512) 588-2215

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
  'kaylarelyease@gmail.com': 'standard-d',
  'adriannabarrientoscc@gmail.com - Healthcare': 'standard-a',
  'adriannabarrientoscc@gmail.com - FinTech': 'standard-a',
  'adonish495@gmail.com': `standard-b`,
  'hollandcody54@gmail.com': `standard-c`,
}

export default function Page() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAccounts, setUserAccounts] = useState<string[]>([])
  const [username, setUsername] = useState('')
  const [account, setAccount] = useState('')
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
  const [showInterview, setShowInterview] = useState(false)
  const [interviewTitle, setInterviewTitle] = useState('')
  const [interviewCompany, setInterviewCompany] = useState('')
  const [interviewRole, setInterviewRole] = useState('')
  const [savingSchedule, setSavingSchedule] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)
  const [missingInterviews, setMissingInterviews] = useState<any[]>([])
  const [loadingMissingInterviews, setLoadingMissingInterviews] = useState(false)
  const [missingInterviewsError, setMissingInterviewsError] = useState<string | null>(null)
  const [myInterviews, setMyInterviews] = useState<any[]>([])
  const [loadingMyInterviews, setLoadingMyInterviews] = useState(false)
  const [myInterviewsError, setMyInterviewsError] = useState<string | null>(null)
  const [lastViewedSection, setLastViewedSection] = useState<'my' | 'missing' | null>(null)
  const [editingInterviewId, setEditingInterviewId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingCompany, setEditingCompany] = useState('')
  const [editingRole, setEditingRole] = useState('')
  const [updatingSchedule, setUpdatingSchedule] = useState(false)
  const [deletingInterviewId, setDeletingInterviewId] = useState<number | null>(null)
  const [biddingScheduleId, setBiddingScheduleId] = useState<number | null>(null)
  const [bidError, setBidError] = useState<string | null>(null)
  const [bidSuccess, setBidSuccess] = useState(false)
  const [additionalQuestions, setAdditionalQuestions] = useState('')
  const [additionalAnswers, setAdditionalAnswers] = useState<Array<{ question: string; answer: string }>>([])
  const [generatingAnswers, setGeneratingAnswers] = useState(false)
  const [copiedAnswerIndex, setCopiedAnswerIndex] = useState<number | null>(null)

  // Helper function to fetch my interviews
  const fetchMyInterviews = async () => {
    // Extract email prefix
    let emailPrefix = account
    if (account.includes('@')) {
      const emailPart = account.split('@')[0]
      emailPrefix = emailPart.trim()
    } else if (account.includes(' ')) {
      const parts = account.split(' ')
      emailPrefix = parts[0].trim()
    }

    setLoadingMyInterviews(true)
    setMyInterviewsError(null)
    // Clear missing interviews list to show only my interviews
    setMissingInterviews([])
    setMissingInterviewsError(null)

    try {
      const res = await fetch('/api/get-my-interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailPrefix }),
      })

      const data = await res.json()
      if (data.error) {
        setMyInterviewsError(data.error)
      } else {
        setMyInterviews(data.schedules || [])
      }
    } catch (e) {
      setMyInterviewsError('Failed to fetch my interviews')
      console.error(e)
    } finally {
      setLoadingMyInterviews(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    setGenerated(null)
    setPdfBase64(null) // Hide download button immediately
    setResumeData(null) // Clear previous resume data
    setCoverLetter(null) // Clear previous cover letter
    setCoverLetterCopied(false) // Reset copy state
    setAdditionalQuestions('') // Clear previous additional questions
    setAdditionalAnswers([]) // Clear previous additional answers
    setCopiedAnswerIndex(null) // Reset copied answer index
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
    // Check authentication on mount
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username')
      const accountsJson = localStorage.getItem('accounts')
      
      if (username && accountsJson) {
        try {
          const accounts = JSON.parse(accountsJson)
          setUserAccounts(accounts)
          setUsername(username)
          setIsAuthenticated(true)
          if (accounts.length > 0) {
            setAccount(accounts[0])
          } else {
            router.push('/login')
          }
          if (username !== 'local') {
            setShowInterview(false)
            setShowJsonInput(false)
          }
        } catch (e) {
          console.error('Failed to parse accounts:', e)
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }
  }, [router])

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || userAccounts.length === 0) {
    return (
      <main className="p-8 max-w-6xl mx-auto">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('accounts')
    router.push('/login')
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-end mb-2">
        <a
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer hover:underline"
        >
          Logout
        </a>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {userAccounts.length > 1 ? (
            <AccountSelector accounts={userAccounts} value={account} onChange={setAccount} />
          ) : userAccounts.length === 1 ? (
            <div className="text-sm text-gray-600">{userAccounts[0]}</div>
          ) : null}
        </div>
        <div className="flex gap-2">
          {username === 'local' && (
            <>
              {showInterview ? (
                <button 
                  onClick={() => setShowInterview(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Back
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      // Initialize/reset form state
                      setInterviewTitle('')
                      setInterviewCompany('')
                      setInterviewRole('')
                      setScheduleError(null)
                      setScheduleSuccess(false)
                      setMissingInterviews([])
                      setMyInterviews([])
                      setLoadingMissingInterviews(false)
                      setLoadingMyInterviews(false)
                      setMissingInterviewsError(null)
                      setMyInterviewsError(null)
                      setLastViewedSection(null)
                      setEditingInterviewId(null)
                      setEditingTitle('')
                      setEditingCompany('')
                      setEditingRole('')
                      setDeletingInterviewId(null)
                      setBiddingScheduleId(null)
                      setBidError(null)
                      setBidSuccess(false)
                      setShowInterview(true)
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Interview
                  </button>
                  <button 
                    onClick={() => setShowJsonInput(!showJsonInput)} 
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    {showJsonInput ? 'Hide' : 'Generate from JSON'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div>
          {showInterview ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Interview Schedule</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={interviewTitle}
                    onChange={(e) => {
                      setInterviewTitle(e.target.value)
                      setScheduleError(null)
                      setScheduleSuccess(false)
                    }}
                    placeholder="Enter interview title"
                    className="w-full p-2 border rounded text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={interviewCompany}
                    onChange={(e) => {
                      setInterviewCompany(e.target.value)
                      setScheduleError(null)
                      setScheduleSuccess(false)
                    }}
                    placeholder="Enter company name"
                    className="w-full p-2 border rounded text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={interviewRole}
                    onChange={(e) => {
                      setInterviewRole(e.target.value)
                      setScheduleError(null)
                      setScheduleSuccess(false)
                    }}
                    placeholder="Enter role (optional)"
                    className="w-full p-2 border rounded text-base"
                  />
                </div>

                {scheduleError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {scheduleError}
                  </div>
                )}

                {scheduleSuccess && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                    Schedule added successfully!
                  </div>
                )}

                <button
                  onClick={async () => {
                    if (!interviewTitle.trim() || !interviewCompany.trim()) {
                      setScheduleError('Title and Company are required')
                      return
                    }

                    setSavingSchedule(true)
                    setScheduleError(null)
                    setScheduleSuccess(false)

                    try {
                      // Extract email prefix (text before @)
                      let emailPrefix = account
                      if (account.includes('@')) {
                        const emailPart = account.split('@')[0]
                        emailPrefix = emailPart.trim()
                      } else if (account.includes(' ')) {
                        // Handle cases like "email - Description"
                        const parts = account.split(' ')
                        emailPrefix = parts[0].trim()
                      }

                      const res = await fetch('/api/save-schedule', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: emailPrefix,
                          title: interviewTitle.trim(),
                          company: interviewCompany.trim(),
                          role: interviewRole.trim() || null,
                        }),
                      })

                      const data = await res.json()
                      if (data.error) {
                        setScheduleError(data.error)
                      } else {
                        setScheduleSuccess(true)
                        // Clear form
                        setInterviewTitle('')
                        setInterviewCompany('')
                        setInterviewRole('')
                        // Clear success message after 3 seconds
                        setTimeout(() => setScheduleSuccess(false), 3000)
                      }
                    } catch (e) {
                      setScheduleError('Failed to save schedule')
                      console.error(e)
                    } finally {
                      setSavingSchedule(false)
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={savingSchedule || !interviewTitle.trim() || !interviewCompany.trim()}
                >
                  {savingSchedule ? 'Adding...' : 'Add'}
                </button>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={async () => {
                        setLastViewedSection('my')
                        await fetchMyInterviews()
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loadingMyInterviews}
                    >
                      {loadingMyInterviews ? 'Loading...' : 'Show My Interview'}
                    </button>

                    <button
                      onClick={async () => {
                        setLastViewedSection('missing')
                        // Extract email prefix
                        let emailPrefix = account
                        if (account.includes('@')) {
                          const emailPart = account.split('@')[0]
                          emailPrefix = emailPart.trim()
                        } else if (account.includes(' ')) {
                          const parts = account.split(' ')
                          emailPrefix = parts[0].trim()
                        }

                        setLoadingMissingInterviews(true)
                        setMissingInterviewsError(null)
                        setMissingInterviews([])
                        // Clear my interviews list to show only missing interviews
                        setMyInterviews([])
                        setMyInterviewsError(null)

                        try {
                          const res = await fetch('/api/get-missing-interviews', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: emailPrefix }),
                          })

                          const data = await res.json()
                          if (data.error) {
                            setMissingInterviewsError(data.error)
                          } else {
                            setMissingInterviews(data.missingSchedules || [])
                          }
                        } catch (e) {
                          setMissingInterviewsError('Failed to fetch missing interviews')
                          console.error(e)
                        } finally {
                          setLoadingMissingInterviews(false)
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loadingMissingInterviews}
                    >
                      {loadingMissingInterviews ? 'Loading...' : 'Show Missing Interview'}
                    </button>
                  </div>

                  {myInterviewsError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      {myInterviewsError}
                    </div>
                  )}

                  {myInterviews.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">My Interviews</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {myInterviews.map((interview, index) => (
                          <div key={interview.id || index} className="p-3 border rounded bg-white">
                            {editingInterviewId === interview.id ? (
                              // Edit mode
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  placeholder="Title"
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                                <input
                                  type="text"
                                  value={editingCompany}
                                  onChange={(e) => setEditingCompany(e.target.value)}
                                  placeholder="Company *"
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                                <input
                                  type="text"
                                  value={editingRole}
                                  onChange={(e) => setEditingRole(e.target.value)}
                                  placeholder="Role (optional)"
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={async () => {
                                      if (!editingTitle.trim() || !editingCompany.trim()) {
                                        setMyInterviewsError('Title and Company are required')
                                        return
                                      }

                                      setUpdatingSchedule(true)
                                      setMyInterviewsError(null)

                                      try {
                                        const res = await fetch('/api/update-schedule', {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            id: interview.id,
                                            title: editingTitle.trim(),
                                            company: editingCompany.trim(),
                                            role: editingRole.trim() || null,
                                          }),
                                        })

                                        const data = await res.json()
                                        if (data.error) {
                                          setMyInterviewsError(data.error)
                                        } else {
                                          setEditingInterviewId(null)
                                          setEditingTitle('')
                                          setEditingCompany('')
                                          setEditingRole('')
                                          await fetchMyInterviews()
                                        }
                                      } catch (e) {
                                        setMyInterviewsError('Failed to update schedule')
                                        console.error(e)
                                      } finally {
                                        setUpdatingSchedule(false)
                                      }
                                    }}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={updatingSchedule || !editingTitle.trim() || !editingCompany.trim()}
                                  >
                                    {updatingSchedule ? 'Saving...' : 'Save'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingInterviewId(null)
                                      setEditingTitle('')
                                      setEditingCompany('')
                                      setEditingRole('')
                                      setMyInterviewsError(null)
                                    }}
                                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // View mode
                              <>
                                <div className="font-semibold">{interview.title}</div>
                                <div className="text-sm text-gray-600">{interview.company}</div>
                                {interview.role && (
                                  <div className="text-sm text-gray-500">Role: {interview.role}</div>
                                )}
                                {interview.created_at && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    Added: {new Date(interview.created_at).toLocaleDateString()}
                                  </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => {
                                      setEditingInterviewId(interview.id)
                                      setEditingTitle(interview.title || '')
                                      setEditingCompany(interview.company || '')
                                      setEditingRole(interview.role || '')
                                      setMyInterviewsError(null)
                                    }}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm('Are you sure you want to delete this interview?')) {
                                        setDeletingInterviewId(interview.id)
                                        setMyInterviewsError(null)

                                        try {
                                          const res = await fetch('/api/delete-schedule', {
                                            method: 'DELETE',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ id: interview.id }),
                                          })

                                          const data = await res.json()
                                          if (data.error) {
                                            setMyInterviewsError(data.error)
                                          } else {
                                            await fetchMyInterviews()
                                          }
                                        } catch (e) {
                                          setMyInterviewsError('Failed to delete schedule')
                                          console.error(e)
                                        } finally {
                                          setDeletingInterviewId(null)
                                        }
                                      }
                                    }}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={deletingInterviewId === interview.id}
                                  >
                                    {deletingInterviewId === interview.id ? 'Deleting...' : 'Delete'}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {myInterviews.length === 0 && !loadingMyInterviews && !myInterviewsError && lastViewedSection === 'my' && (
                    <div className="mt-4 p-3 border rounded bg-gray-50 text-sm text-gray-500">
                      No interviews found. Click "Show My Interview" to view your schedules.
                    </div>
                  )}

                  {missingInterviewsError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      {missingInterviewsError}
                    </div>
                  )}

                  {missingInterviews.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Missing Interviews</h3>
                      {bidError && (
                        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                          {bidError}
                        </div>
                      )}
                      {bidSuccess && (
                        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                          Bid placed successfully!
                        </div>
                      )}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {missingInterviews.map((interview, index) => (
                          <div key={interview.id || index} className="p-3 border rounded bg-white">
                            <div className="font-semibold">{interview.title}</div>
                            <div className="text-sm text-gray-600">{interview.company}</div>
                            {interview.role && (
                              <div className="text-sm text-gray-500">Role: {interview.role}</div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">From: {interview.email}</div>
                            <div className="mt-2">
                              <button
                                onClick={async () => {
                                  if (confirm('Are you sure you want to place a bid on this interview?')) {
                                    // Extract email prefix
                                    let emailPrefix = account
                                    if (account.includes('@')) {
                                      const emailPart = account.split('@')[0]
                                      emailPrefix = emailPart.trim()
                                    } else if (account.includes(' ')) {
                                      const parts = account.split(' ')
                                      emailPrefix = parts[0].trim()
                                    }

                                    setBiddingScheduleId(interview.id)
                                    setBidError(null)
                                    setBidSuccess(false)

                                    try {
                                      const res = await fetch('/api/save-bid', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          schedule_id: interview.id,
                                          email: emailPrefix,
                                        }),
                                      })

                                      const data = await res.json()
                                      if (data.error) {
                                        setBidError(data.error)
                                      } else {
                                        setBidSuccess(true)
                                        // Clear success message after 3 seconds
                                        setTimeout(() => setBidSuccess(false), 3000)
                                        
                                        // Refresh missing interviews list to remove the bid item
                                        if (lastViewedSection === 'missing') {
                                          setLoadingMissingInterviews(true)
                                          setMissingInterviewsError(null)
                                          
                                          try {
                                            const refreshRes = await fetch('/api/get-missing-interviews', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ email: emailPrefix }),
                                            })
                                            
                                            const refreshData = await refreshRes.json()
                                            if (refreshData.error) {
                                              setMissingInterviewsError(refreshData.error)
                                            } else {
                                              setMissingInterviews(refreshData.missingSchedules || [])
                                            }
                                          } catch (e) {
                                            setMissingInterviewsError('Failed to refresh missing interviews')
                                            console.error(e)
                                          } finally {
                                            setLoadingMissingInterviews(false)
                                          }
                                        }
                                      }
                                    } catch (e) {
                                      setBidError('Failed to place bid')
                                      console.error(e)
                                    } finally {
                                      setBiddingScheduleId(null)
                                    }
                                  }
                                }}
                                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={biddingScheduleId === interview.id}
                              >
                                {biddingScheduleId === interview.id ? 'Placing bid...' : 'Place a bid'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {missingInterviews.length === 0 && !loadingMissingInterviews && !missingInterviewsError && lastViewedSection === 'missing' && (
                    <div className="mt-4 p-3 border rounded bg-gray-50 text-sm text-gray-500">
                      No missing interviews found. Click "Show Missing Interview" to check.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
          <>
          {!showJsonInput && (
            <>
              <label className="block text-xl font-semibold">Identifier</label>
              <input value={identifier} onChange={(e) => {
                setIdentifier(e.target.value)
                setIdentifierWarning(null)
              }} placeholder="Job Title, Company, or Role" className="mt-1 p-2 border rounded w-full text-base" />
              {identifierWarning && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  {identifierWarning}
                </div>
              )}

              <label className="block text-xl font-semibold mt-4">Job description</label>
              <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={6} className="mt-1 p-2 border rounded w-full text-base" />

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
                                identifier: identifier && identifier.trim() ? identifier.trim() : null,
                                description: jobDesc && jobDesc.trim() ? jobDesc.trim() : null,
                                username
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
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:enabled:bg-green-700 disabled:opacity-50"
                      disabled={generatingCoverLetter || !resumeData || loading}
                    >
                      {generatingCoverLetter ? 'Generating...' : 'Generate Cover Letter'}
                    </button>
                    {coverLetter && (
                      <>
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
                        <button
                          onClick={() => {
                            // Extract first name from resume data
                            let firstName = ''
                            if (resumeData?.name) {
                              const nameParts = resumeData.name.trim().split(/\s+/)
                              firstName = nameParts[0] || ''
                            }
                            
                            // Create and download the text file
                            const blob = new Blob([coverLetter], { type: 'text/plain' })
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = firstName ? `${firstName}-cover-letter.txt` : 'cover-letter.txt'
                            link.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Download Cover Letter
                        </button>
                      </>
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

                {/* Additional Questions Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Additional Questions</h3>
                    <button
                      onClick={async () => {
                        if (!resumeData) {
                          alert('Please generate a resume first.')
                          return
                        }
                        if (!jobDesc) {
                          alert('Please enter a job description first.')
                          return
                        }
                        if (!additionalQuestions.trim()) {
                          alert('Please enter at least one question.')
                          return
                        }

                        setGeneratingAnswers(true)
                        setAdditionalAnswers([])
                        try {
                          const res = await fetch('/api/answer-additional-questions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              resumeJson: resumeData,
                              jobDescription: jobDesc,
                              questions: additionalQuestions
                            }),
                          })
                          const data = await res.json()
                          if (data.error) {
                            alert(`Failed to generate answers: ${data.error}`)
                          } else if (data.answers) {
                            setAdditionalAnswers(data.answers)
                          }
                        } catch (e) {
                          alert('Failed to generate answers')
                          console.error(e)
                        } finally {
                          setGeneratingAnswers(false)
                        }
                      }}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:enabled:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={generatingAnswers || !resumeData || loading || !additionalQuestions.trim()}
                    >
                      {generatingAnswers ? 'Generating...' : 'Answer Additional Questions'}
                    </button>
                  </div>
                  <textarea
                    value={additionalQuestions}
                    onChange={(e) => setAdditionalQuestions(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Enter your questions here, one per line..."
                  />

                  {/* Display Answers */}
                  {additionalAnswers.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {additionalAnswers.map((item, index) => (
                        <div key={index} className="p-4 border rounded bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-700">{item.question}</h4>
                            <button
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(item.answer)
                                  setCopiedAnswerIndex(index)
                                  setTimeout(() => setCopiedAnswerIndex(null), 2000)
                                } catch (err) {
                                  console.error('Failed to copy answer:', err)
                                }
                              }}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              {copiedAnswerIndex === index ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <div className="text-sm text-gray-800 whitespace-pre-wrap mt-2">
                            {item.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
          </>
          )}
      </div>
    </main>
  )
}
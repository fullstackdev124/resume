"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AccountSelector from '../components/AccountSelector'

// Helpers for file save: in Electron we write to Downloads and overwrite if exists (no "file (1).pdf")
function arrayBufferToBase64(ab: ArrayBuffer): string {
  const u8 = new Uint8Array(ab)
  let s = ''
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
  return btoa(s)
}

async function saveFile(
  filename: string,
  data: string,
  encoding: 'base64' | 'utf8',
  mime?: string
): Promise<void> {
  const api = typeof window !== 'undefined' ? (window as unknown as { electronAPI?: { saveFile: (o: { filename: string; data: string; encoding: string }) => Promise<{ ok?: boolean; error?: string }> } }).electronAPI : undefined
  if (api?.saveFile) {
    const res = await api.saveFile({ filename, data, encoding })
    if (!res?.ok) alert(res?.error || 'Failed to save file')
    return
  }
  const link = document.createElement('a')
  if (encoding === 'base64' && mime) {
    link.href = `data:${mime};base64,${data}`
  } else if (encoding === 'utf8') {
    link.href = URL.createObjectURL(new Blob([data], { type: 'text/plain' }))
  } else {
    return
  }
  link.download = filename
  link.click()
  if (encoding === 'utf8') URL.revokeObjectURL(link.href)
}

const allAccounts = [
  'kaylarelyease@gmail.com', 
  'jennabilgriencc@gmail.com',
  'adriannabarrientoscc@gmail.com - Healthcare', 
  'adriannabarrientoscc@gmail.com - FinTech', 
  'adonish495@gmail.com', 
  'hollandcody54@gmail.com'
]

const mockResumes: Record<string,string> = {
  'kaylarelyease@gmail.com': `Kayla Relyea
Senior Full Stack Engineer
Nassau, NY | (561) 264-2813 | kaylarelyease@gmail.com

PROFESSIONAL EXPERIENCE
BetterHelp | Jan 2022 – Dec 2025
Remote(US)

Optum, UnitedHealth Group | Aug 2018 – Dec 2021
Minneapolis, MN

MojoTech | May 2015 – Jul 2018
Software Engineer | Providence, RI

EDUCATION
New York University, New York
B.S. in Computer Engineering Aug 2011 – May 2015`,

  'jennabilgriencc@gmail.com': `Jenna Bilgrien
  Senior Software Engineer
  Chicago, IL | (805) 395-6650 | jennabilgriencc@gmail.com
  
  PROFESSIONAL EXPERIENCE
  The Zebra | Jul 2021 - Present 
  Senior Software Engineer | Austin, TX

  The Zebra | Jul 2019 - Jul 2021 
  Software Engineer | Austin, TX

  Intelligent Medical Objects | May 2018- Dec 2018
  Software Engineering Intern | Urbana-Champaign Area

  UIUC College of Engineering | Jul 2017 - Dec 2018
  Engineering Learning Assistant | Urbana-Champaign Area

  EDUCATION
  University of Illinois Urbana-Champaign
  B.S. in Computer Science | May 2019`,

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
  'jennabilgriencc@gmail.com': 'standard-c',
  'adriannabarrientoscc@gmail.com - Healthcare': 'standard-a',
  'adriannabarrientoscc@gmail.com - FinTech': 'standard-a',
  'adonish495@gmail.com': `standard-b`,
  'hollandcody54@gmail.com': `standard-c`,
}

type BulkItem = {
  id: string
  identifier: string
  jd: string
  status: 'generating' | 'done' | 'error'
  resumeData?: any
  pdfBase64?: string | null
  pdfError?: string | null
  coverLetter?: string | null
  additionalAnswers?: Array<{ question: string; answer: string }>
  additionalQuestionsText?: string
}

export default function Page() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userAccounts, setUserAccounts] = useState<string[]>([])
  const [username, setUsername] = useState('')
  const [account, setAccount] = useState('')
  const [resumes, setResumes] = useState<Record<string,string>>(mockResumes)
  const templateMap: Record<string,string> = mockTemplates
  const [bulkList, setBulkList] = useState<BulkItem[]>([])
  const [selectedBulkId, setSelectedBulkId] = useState<string | null>(null)
  const [bulkInputIdentifier, setBulkInputIdentifier] = useState('')
  const [bulkInputJd, setBulkInputJd] = useState('')
  const [coverLetterCopied, setCoverLetterCopied] = useState(false)
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const selected = selectedBulkId ? bulkList.find((b) => b.id === selectedBulkId) ?? null : null

  const updateBulkItem = (id: string, patch: Partial<BulkItem>) => {
    setBulkList((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  // Reset copy and generating state when selected bulk item changes so status reflects the current item
  useEffect(() => {
    setCopiedAnswerIndex(null)
    setCoverLetterCopied(false)
    setGeneratingCoverLetter(false)
    setGeneratingAnswers(false)
  }, [selectedBulkId])

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
  const [generatingAnswers, setGeneratingAnswers] = useState(false)
  const [copiedAnswerIndex, setCopiedAnswerIndex] = useState<number | null>(null)

  const questionsForSelected = selected ? (selected.additionalQuestionsText ?? '') : additionalQuestions

  const copyToClipboard = async (text: string) => {
    if (!text) return false

    try {
      if (navigator?.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      }
    } catch (err) {
      console.warn('Clipboard API failed, falling back.', err)
    }

    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '-9999px'
      textarea.setAttribute('readonly', 'true')
      document.body.appendChild(textarea)
      textarea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      return successful
    } catch (err) {
      console.error('Fallback copy failed:', err)
      return false
    }
  }

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

  const handleBulkGenerate = () => {
    const idVal = bulkInputIdentifier.trim()
    const jdVal = bulkInputJd.trim()
    if (!idVal) {
      alert('Please enter an identifier.')
      return
    }
    if (!jdVal) {
      alert('Please enter a job description.')
      return
    }
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `bulk-${Date.now()}`
    const item: BulkItem = {
      id,
      identifier: idVal,
      jd: jdVal,
      status: 'generating',
    }
    setBulkList((prev) => [...prev, item])
    setBulkInputIdentifier('')
    setBulkInputJd('')
    setSelectedBulkId(id)

    ;(async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            account,
            jd: jdVal,
            resumeContent: resumes[account],
            template: templateMap[account],
          }),
        })
        const data = await res.json()
        const resume = data.resume || data
        updateBulkItem(id, { status: 'done', resumeData: resume, pdfBase64: data.pdfBase64 ?? null, pdfError: data.pdfError ?? null })
      } catch (e) {
        updateBulkItem(id, { status: 'error' })
      }
    })()
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
    if (!selected?.resumeData) {
      alert('Please generate a resume first.')
      return
    }
    if (!selected?.jd) {
      alert('Please enter a job description first.')
      return
    }
    const id = selected.id

    setGeneratingCoverLetter(true)
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeJson: selected.resumeData,
          jobDescription: selected.jd,
        }),
      })
      const data = await res.json()
      if (data.error) {
        alert(`Failed to generate cover letter: ${data.error}`)
      } else if (data.coverLetter && id) {
        updateBulkItem(id, { coverLetter: data.coverLetter })
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
        const filename = 'resume.pdf'
        await saveFile(filename, data.pdfBase64, 'base64', 'application/pdf')
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
      const checkAuth = async () => {
        const username = localStorage.getItem('username')
        const accountsJson = localStorage.getItem('accounts')
        const expiresAtRaw = localStorage.getItem('authExpiresAt')
        const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : 0
        const isExpired = !expiresAt || Number.isNaN(expiresAt) || Date.now() > expiresAt

        if (isExpired) {
          localStorage.removeItem('username')
          localStorage.removeItem('password')
          localStorage.removeItem('accounts')
          localStorage.removeItem('authExpiresAt')
          router.push('/login')
          return
        }
        
        if (username && accountsJson) {
          try {
            // Get password from localStorage
            const password = localStorage.getItem('password')
            if (!password) {
              // No password stored, clear auth and redirect
              localStorage.removeItem('username')
              localStorage.removeItem('password')
              localStorage.removeItem('accounts')
              localStorage.removeItem('authExpiresAt')
              router.push('/login')
              return
            }
            
            // Verify user still exists in Supabase users table with matching password
            const verifyRes = await fetch('/api/verify-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
            })
            
            if (!verifyRes.ok) {
              // API error, assume user doesn't exist for safety
              console.error('Failed to verify user:', verifyRes.status)
              localStorage.removeItem('username')
              localStorage.removeItem('password')
              localStorage.removeItem('accounts')
              localStorage.removeItem('authExpiresAt')
              router.push('/login')
              return
            }
            
            const verifyData = await verifyRes.json()
            
            if (!verifyData.exists) {
              // User no longer exists in database or password doesn't match, clear auth and redirect
              localStorage.removeItem('username')
              localStorage.removeItem('password')
              localStorage.removeItem('accounts')
              localStorage.removeItem('authExpiresAt')
              router.push('/login')
              return
            }
            
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
            console.error('Failed to verify user or parse accounts:', e)
            router.push('/login')
          }
        } else {
          router.push('/login')
        }
      }
      
      checkAuth()
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
    localStorage.removeItem('password')
    localStorage.removeItem('accounts')
    localStorage.removeItem('authExpiresAt')
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
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        <strong>Note:</strong> You can generate multiple resumes simultaneously. However, if you're using the Windows executable version, downloaded files will be overwritten. Please complete each job one at a time to avoid file conflicts.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Bulk list</h3>
                    <button
                      onClick={() => { setBulkList([]); setSelectedBulkId(null) }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Clear list
                    </button>
                  </div>
                  <div className="border rounded h-[17rem] overflow-y-auto bg-gray-50">
                    {bulkList.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">Add identifier and JD, then click Generate Bulk.</div>
                    ) : (
                      bulkList.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBulkId(b.id)}
                          className={`p-3 border-b last:border-b-0 cursor-pointer flex justify-between items-center ${
                            selectedBulkId === b.id ? 'bg-blue-50 border-l-4 border-l-blue-400' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-sm font-medium truncate flex-1">{b.identifier || '(no identifier)'}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            b.status === 'generating' ? 'bg-amber-100 text-amber-800' :
                            b.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {b.status === 'generating' ? 'Generating' : b.status === 'done' ? 'Done' : 'Error'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="h-[17rem] flex flex-col">
                    <label className="block text-lg font-semibold">Identifier</label>
                    <input
                      value={bulkInputIdentifier}
                      onChange={(e) => setBulkInputIdentifier(e.target.value)}
                      placeholder="Job Title, Company, or Role"
                      className="mt-1 p-2 border rounded w-full text-base"
                    />
                    <label className="block text-lg font-semibold mt-3">Job description</label>
                    <textarea
                      value={bulkInputJd}
                      onChange={(e) => setBulkInputJd(e.target.value)}
                      rows={6}
                      className="mt-1 flex-1 min-h-0 p-2 border rounded w-full text-base resize-none"
                    />
                  </div>
                  <button
                    onClick={handleBulkGenerate}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!bulkInputIdentifier.trim() || !bulkInputJd.trim()}
                  >
                    Generate Bulk
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Generated Resume</h3>
                  {selected?.pdfBase64 && (
                    <button
                      className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={downloading}
                      onClick={async () => {
                        setDownloading(true)
                        if (selected?.resumeData) {
                          try {
                            await fetch('/api/save-resume', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                json: selected.resumeData,
                                identifier: selected.identifier?.trim() || null,
                                description: selected.jd?.trim() || null,
                                username,
                              }),
                            })
                          } catch (error) {
                            console.error('Failed to save resume to Supabase', error)
                          }
                        }
                        const filename = 'resume.pdf'
                        await saveFile(filename, selected!.pdfBase64!, 'base64', 'application/pdf')
                        setDownloading(false)
                      }}
                    >
                      {downloading ? 'Downloading...' : 'Download PDF'}
                    </button>
                  )}
                  {selected?.pdfError && (
                    <div className="text-sm text-red-600 max-w-md">
                      PDF generation failed: {selected.pdfError}
                    </div>
                  )}
                </div>
                <div className="mt-2 p-4 border rounded bg-white text-sm whitespace-pre-wrap overflow-y-auto" style={{ maxHeight: '200px' }}>
                  {selected ? (JSON.stringify(selected.resumeData, null, 2) || 'No resume returned') : 'Select an item from the list.'}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Cover Letter</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateCoverLetter}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:enabled:bg-green-700 disabled:opacity-50"
                      disabled={generatingCoverLetter || !selected?.resumeData}
                    >
                      {generatingCoverLetter ? 'Generating...' : 'Generate Cover Letter'}
                    </button>
                    {selected?.coverLetter && (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/generate-docx', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ coverLetter: selected!.coverLetter }),
                              })
                              if (!res.ok) throw new Error('Failed to generate .docx file')
                              const blob = await res.blob()
                              const ab = await blob.arrayBuffer()
                              const b64 = arrayBufferToBase64(ab)
                              const filename = 'cover-letter.docx'
                              await saveFile(filename, b64, 'base64', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                            } catch (err) {
                              console.error('Failed to download .docx:', err)
                              alert('Failed to download .docx file. Please try again.')
                            }
                          }}
                          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          download(.doc)
                        </button>
                        <button
                          onClick={async () => {
                            const filename = 'cover-letter.txt'
                            await saveFile(filename, selected!.coverLetter!, 'utf8')
                          }}
                          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          download(.txt)
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const copied = await copyToClipboard(selected?.coverLetter ?? '')
                              if (copied) {
                                setCoverLetterCopied(true)
                                setTimeout(() => setCoverLetterCopied(false), 2000)
                              } else {
                                alert('Copy failed. Please copy manually.')
                              }
                            } catch (err) {
                              console.error('Failed to copy cover letter:', err)
                            }
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {coverLetterCopied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {selected?.coverLetter ? (
                  <div className="mt-2 p-4 border rounded bg-white text-sm whitespace-pre-wrap">
                    {selected.coverLetter}
                  </div>
                ) : (
                  <div className="mt-2 p-4 border rounded bg-gray-50 text-sm text-gray-500">
                    {selected ? 'Click "Generate Cover Letter" to create a cover letter based on your resume and job description.' : 'Select an item from the list.'}
                  </div>
                )}

                {/* Additional Questions Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Additional Questions</h3>
                    <button
                      onClick={async () => {
                        if (!selected?.resumeData) {
                          alert('Please generate a resume first.')
                          return
                        }
                        if (!selected?.jd) {
                          alert('Please enter a job description first.')
                          return
                        }
                        const questionsToUse = selected ? (selected.additionalQuestionsText ?? '') : additionalQuestions
                        if (!questionsToUse.trim()) {
                          alert('Please enter at least one question.')
                          return
                        }
                        const id = selected.id

                        setGeneratingAnswers(true)
                        try {
                          const res = await fetch('/api/answer-additional-questions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              resumeJson: selected.resumeData,
                              jobDescription: selected.jd,
                              questions: questionsToUse
                            }),
                          })
                          const data = await res.json()
                          if (data.error) {
                            alert(`Failed to generate answers: ${data.error}`)
                          } else if (data.answers && id) {
                            updateBulkItem(id, { additionalAnswers: data.answers })
                          }
                        } catch (e) {
                          alert('Failed to generate answers')
                          console.error(e)
                        } finally {
                          setGeneratingAnswers(false)
                        }
                      }}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:enabled:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={generatingAnswers || !selected?.resumeData || !questionsForSelected.trim()}
                    >
                      {generatingAnswers ? 'Generating...' : 'Answer Additional Questions'}
                    </button>
                  </div>
                  <textarea
                    value={questionsForSelected}
                    onChange={(e) => {
                      const v = e.target.value
                      if (selected?.id) {
                        updateBulkItem(selected.id, { additionalQuestionsText: v })
                      } else {
                        setAdditionalQuestions(v)
                      }
                    }}
                    rows={4}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Enter your questions here, one per line..."
                  />

                  {/* Display Answers */}
                  {(selected?.additionalAnswers ?? []).length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {(selected?.additionalAnswers ?? []).map((item, index) => (
                        <div key={`${selectedBulkId ?? ''}-${index}`} className="p-4 border rounded bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-700">{item.question}</h4>
                            <button
                              onClick={async () => {
                                try {
                                  const copied = await copyToClipboard(item.answer)
                                  if (copied) {
                                    setCopiedAnswerIndex(index)
                                    setTimeout(() => setCopiedAnswerIndex(null), 2000)
                                  } else {
                                    alert('Copy failed. Please copy manually.')
                                  }
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
                  ) : selected ? (
                    <div className="mt-4 p-3 border rounded bg-gray-50 text-sm text-gray-500">
                      No answers yet. Enter questions above and click Answer Additional Questions.
                    </div>
                  ) : null}
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
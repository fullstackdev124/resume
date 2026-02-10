"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

type ResumeHistoryItem = {
  id: string | null
  login: string | null
  email: string | null
  data: string | null
  created_at: string | null
  identifier: string | null
  description: string | null
  scheduled?: boolean
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [submitSearch, setSubmitSearch] = useState('')
  const [items, setItems] = useState<ResumeHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [analyzeStartDate, setAnalyzeStartDate] = useState(() => getDefaultAnalyzeRange().start)
  const [analyzeEndDate, setAnalyzeEndDate] = useState(() => getDefaultAnalyzeRange().end)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [ratesData, setRatesData] = useState<{
    localByEmail: { name: string; value: number }[]
    otherByLogin: { name: string; value: number }[]
    localInterviewByEmail: { name: string; value: number }[]
    otherInterviewByLogin: { name: string; value: number }[]
  } | null>(null)
  const [ratesLoading, setRatesLoading] = useState(false)
  const [ratesError, setRatesError] = useState<string | null>(null)

  function formatDateOnly(createdAt: string | null): string {
    if (!createdAt) return '—'
    const s = String(createdAt)
    if (/^\d{4}-\d{2}-\d{2}$/.test(s.slice(0, 10))) return s.slice(0, 10)
    const d = new Date(createdAt)
    if (Number.isNaN(d.getTime())) return '—'
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  function toAtDate(createdAt: string | null): string | null {
    const s = formatDateOnly(createdAt)
    return s === '—' ? null : s
  }

  function getDefaultAnalyzeRange(): { start: string; end: string } {
    const end = new Date()
    const start = new Date(end)
    start.setMonth(start.getMonth() - 1)
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return { start: fmt(start), end: fmt(end) }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const u = localStorage.getItem('username')
    const accountsJson = localStorage.getItem('accounts')
    const expiresAt = localStorage.getItem('authExpiresAt')
    if (!u || !accountsJson || !expiresAt || Date.now() > parseInt(expiresAt, 10)) {
      router.push('/login')
      return
    }
    try {
      const accounts = JSON.parse(accountsJson)
      if (!Array.isArray(accounts) || accounts.length === 0) {
        router.push('/login')
        return
      }
      setIsAuthenticated(true)
    } catch {
      router.push('/login')
    }
  }, [router])

  const fetchItems = useCallback(async () => {
    const q = submitSearch.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ q })
      const res = await fetch(`/api/analytics/resume-history?${params}`)
      if (!res.ok) {
        if (res.status === 503) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || 'MySQL not configured')
        }
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setItems(data.items ?? [])
      setSelectedIndex(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [submitSearch])

  useEffect(() => {
    if (!isAuthenticated) return
    if (!submitSearch.trim()) {
      setItems([])
      setSelectedIndex(null)
      setError(null)
      return
    }
    fetchItems()
  }, [isAuthenticated, submitSearch, fetchItems])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitSearch(searchText.trim())
  }

  const handleAnalyze = async () => {
    setRatesLoading(true)
    setRatesError(null)
    try {
      const params = new URLSearchParams()
      params.set('startDate', analyzeStartDate)
      params.set('endDate', analyzeEndDate)
      const res = await fetch(`/api/analytics/rates?${params}`)
      if (!res.ok) {
        if (res.status === 503) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || 'MySQL not configured')
        }
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setRatesData({
        localByEmail: data.localByEmail ?? [],
        otherByLogin: data.otherByLogin ?? [],
        localInterviewByEmail: data.localInterviewByEmail ?? [],
        otherInterviewByLogin: data.otherInterviewByLogin ?? [],
      })
    } catch (e) {
      setRatesError(e instanceof Error ? e.message : 'Failed to load rates')
      setRatesData(null)
    } finally {
      setRatesLoading(false)
    }
  }

  const [gotInterviewSaving, setGotInterviewSaving] = useState(false)
  const [gotInterviewFeedback, setGotInterviewFeedback] = useState(false)
  const handleGotInterview = async () => {
    if (selectedIndex === null || !items[selectedIndex]) return
    const item = items[selectedIndex]
    const id = (item.id ?? '').trim()
    const login = (item.login ?? '').trim()
    const email = (item.email ?? '').trim()
    const at = toAtDate(item.created_at)
    if (!id || !login || !email || !at) return
    setGotInterviewSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/analytics/got-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, login, email, at, identifier: item.identifier ?? '' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 409 || data.error === 'Already scheduled') {
          setError('Already scheduled')
          return
        }
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      setGotInterviewFeedback(true)
      if (id) setItems((prev) => prev.map((it) => (it.id === id ? { ...it, scheduled: true } : it)))
      setTimeout(() => setGotInterviewFeedback(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add')
    } finally {
      setGotInterviewSaving(false)
    }
  }
  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null
  const canGotInterview = selectedItem && (selectedItem.id ?? '').trim() !== '' && (selectedItem.login ?? '').trim() !== '' && (selectedItem.email ?? '').trim() !== '' && toAtDate(selectedItem.created_at) !== null

  const handleRemoveScheduled = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!id) return
    setRemovingId(id)
    setError(null)
    try {
      const res = await fetch(`/api/analytics/scheduled?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, scheduled: false } : it)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove')
    } finally {
      setRemovingId(null)
    }
  }

  const [copyFeedback, setCopyFeedback] = useState<'description' | 'data' | null>(null)
  const copyToClipboard = async (text: string, kind: 'description' | 'data') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(kind)
      setTimeout(() => setCopyFeedback(null), 1500)
    } catch {
      setCopyFeedback(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="p-8 max-w-6xl mx-auto">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer hover:underline"
        >
          Back
        </Link>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Search local database (resume_history). Filter by identifier or description.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search identifier or description..."
          className="w-64 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-gray-500 py-4">Loading...</div>
      )}

      {!loading && (
        <div className="flex gap-4" style={{ height: '420px' }}>
          {/* Left: list — fixed height, same as right panel */}
          <div className="w-80 shrink-0 flex flex-col border border-gray-200 rounded overflow-hidden h-full">
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between gap-2 shrink-0">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Results</span>
              {gotInterviewFeedback ? (
                <span className="text-xs text-green-600 font-medium">Added</span>
              ) : (
                <button
                  type="button"
                  onClick={handleGotInterview}
                  disabled={!canGotInterview || gotInterviewSaving}
                  className="text-xs px-2 py-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {gotInterviewSaving ? '...' : 'Got Interview'}
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm text-center">
                  {submitSearch.trim() ? 'No records found.' : 'Enter search text and click Search.'}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-stretch">
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={`flex-1 min-w-0 text-left px-3 py-2.5 hover:bg-gray-50 text-sm ${
                          selectedIndex === index ? 'bg-indigo-50 border-l-2 border-indigo-600' : ''
                        }`}
                      >
                        <div className="font-medium text-gray-900 truncate" title={item.identifier ?? ''}>
                          {item.identifier ?? '—'}
                        </div>
                        <div className="text-gray-600 truncate" title={item.login ?? ''}>
                          {item.login ?? '—'}
                        </div>
                        <div className="text-gray-600 truncate" title={item.email ?? ''}>
                          {item.email ?? '—'}
                        </div>
                        <div className="text-gray-400 text-xs mt-0.5">
                          {formatDateOnly(item.created_at)}
                        </div>
                      </button>
                      {item.id && item.scheduled && (
                        <div className="flex items-center shrink-0 pr-2 border-l border-gray-100">
                          <button
                            type="button"
                            onClick={(e) => handleRemoveScheduled(e, item.id!)}
                            disabled={removingId === item.id}
                            className="text-xs px-2 py-1.5 rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 whitespace-nowrap"
                          >
                            {removingId === item.id ? '...' : 'Remove'}
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: description + data — same fixed height as list */}
          <div className="flex-1 min-w-0 flex flex-col border border-gray-200 rounded overflow-hidden h-full">
            {selectedIndex !== null && items[selectedIndex] ? (
              <>
                <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Description</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(items[selectedIndex].description ?? '—', 'description')}
                    className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-200"
                  >
                    {copyFeedback === 'description' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 border-b border-gray-200 text-sm text-gray-800 whitespace-pre-wrap">
                  {items[selectedIndex].description ?? '—'}
                </div>
                <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data (JSON)</span>
                  <button
                    type="button"
                    onClick={() => {
                      const raw = items[selectedIndex].data ?? '—'
                      const toCopy = raw === '—' ? raw : (() => {
                        try {
                          return JSON.stringify(JSON.parse(raw), null, 2)
                        } catch {
                          return raw
                        }
                      })()
                      copyToClipboard(toCopy, 'data')
                    }}
                    className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-200"
                  >
                    {copyFeedback === 'data' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-auto p-3 bg-white">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words font-mono">
                    {(() => {
                      const raw = items[selectedIndex].data ?? '—'
                      if (raw === '—') return raw
                      try {
                        const parsed = JSON.parse(raw)
                        return JSON.stringify(parsed, null, 2)
                      } catch {
                        return raw
                      }
                    })()}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Select an item from the list
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-6 mb-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">From</span>
          <input
            type="date"
            value={analyzeStartDate}
            onChange={(e) => setAnalyzeStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">To</span>
          <input
            type="date"
            value={analyzeEndDate}
            onChange={(e) => setAnalyzeEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={ratesLoading}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 text-sm"
        >
          {ratesLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {ratesError && (
        <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
          {ratesError}
        </div>
      )}

      {ratesData && (() => {
        const localRateByEmail = ratesData.localByEmail.map(({ name, value: record }) => {
          const interview = ratesData.localInterviewByEmail.find((x) => x.name === name)?.value ?? 0
          return { name, value: record ? interview / record : 0, interview, record }
        }).filter((d) => d.record > 0)
        const otherRateByLogin = ratesData.otherByLogin.map(({ name, value: record }) => {
          const interview = ratesData.otherInterviewByLogin.find((x) => x.name === name)?.value ?? 0
          return { name, value: record ? interview / record : 0, interview, record }
        }).filter((d) => d.record > 0)
        const localRateMax = localRateByEmail.length
          ? Math.max(...localRateByEmail.map((d) => d.value), 0.01) * 1.05
          : 0.1
        const otherRateMax = otherRateByLogin.length
          ? Math.max(...otherRateByLogin.map((d) => d.value), 0.01) * 1.05
          : 0.1
        return (
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded p-4 bg-white">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Local — records by email</h3>
            {(ratesData.localByEmail.length === 0) ? (
              <p className="text-gray-500 text-sm py-8 text-center">No local records</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratesData.localByEmail}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {ratesData.localByEmail.map((_, i) => (
                        <Cell key={i} fill={['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'][i % 6]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const p = payload[0]
                        return (
                          <div className="bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-sm">
                            {p.name}: {p.value}
                          </div>
                        )
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="border border-gray-200 rounded p-4 bg-white">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Other — records by login</h3>
            {(ratesData.otherByLogin.length === 0) ? (
              <p className="text-gray-500 text-sm py-8 text-center">No other records</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratesData.otherByLogin}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {ratesData.otherByLogin.map((_, i) => (
                        <Cell key={i} fill={['#ec4899', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#ffe4e6'][i % 6]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const p = payload[0]
                        return (
                          <div className="bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-sm">
                            {p.name}: {p.value}
                          </div>
                        )
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded p-4 bg-white">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Local — rate (interview/record) by email</h3>
            {localRateByEmail.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">No local records</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={localRateByEmail} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, localRateMax]} allowDecimals={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const p = payload[0].payload as { name: string; value: number; interview: number; record: number }
                        return (
                          <div className="bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-sm">
                            {p.name}: {(p.value * 100).toFixed(1)}% ({p.interview}/{p.record})
                          </div>
                        )
                      }}
                    />
                    <Bar dataKey="value" name="Rate" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="border border-gray-200 rounded p-4 bg-white">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Other — rate (interview/record) by login</h3>
            {otherRateByLogin.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">No other records</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={otherRateByLogin} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, otherRateMax]} allowDecimals={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const p = payload[0].payload as { name: string; value: number; interview: number; record: number }
                        return (
                          <div className="bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-sm">
                            {p.name}: {(p.value * 100).toFixed(1)}% ({p.interview}/{p.record})
                          </div>
                        )
                      }}
                    />
                    <Bar dataKey="value" name="Rate" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          </div>
        </div>
        )
      })()}
    </main>
  )
}

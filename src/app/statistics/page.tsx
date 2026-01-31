"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase-client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

type StatRow = { email: string; count: number }
type OutsideStatRow = { login: string; count: number }
type WeekByDay = { day: string; count: number }

export default function StatisticsPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [localData, setLocalData] = useState<StatRow[]>([])
  const [localLoading, setLocalLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const [outsideData, setOutsideData] = useState<StatRow[]>([])
  const [outsideLoading, setOutsideLoading] = useState(false)
  const [outsideError, setOutsideError] = useState<string | null>(null)

  const [weekByEmail, setWeekByEmail] = useState<StatRow[]>([])
  const [weekByDay, setWeekByDay] = useState<WeekByDay[]>([])
  const [weekOutsideByEmail, setWeekOutsideByEmail] = useState<OutsideStatRow[]>([])
  const [weekOutsideByDay, setWeekOutsideByDay] = useState<WeekByDay[]>([])
  const [weekLabel, setWeekLabel] = useState<string>('')
  const [weekLoading, setWeekLoading] = useState(false)
  const [weekError, setWeekError] = useState<string | null>(null)

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
      setUsername(u)
      setIsAuthenticated(true)
    } catch {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return

    // Local: resume_data (same logic as before – all records, group by email)
    setLocalLoading(true)
    setLocalError(null)
    supabase
      .from('resume_data')
      .select('email')
      .then(({ data, error }) => {
        setLocalLoading(false)
        if (error) {
          setLocalError(error.message)
          return
        }
        const grouped = (data || []).reduce((acc: Record<string, number>, item: { email?: string }) => {
          const email = item.email ?? '(no email)'
          acc[email] = (acc[email] || 0) + 1
          return acc
        }, {})
        const result = Object.entries(grouped)
          .map(([email, count]) => ({ email, count }))
          .sort((a, b) => b.count - a.count)
        setLocalData(result)
      })

    // Outside: resume_data_bidder (all records, group by login or email)
    setOutsideLoading(true)
    setOutsideError(null)
    supabase
      .from('resume_data_bidder')
      .select('email, login')
      .then(({ data, error }) => {
        setOutsideLoading(false)
        if (error) {
          setOutsideError(error.message)
          return
        }
        const grouped = (data || []).reduce((acc: Record<string, number>, item: { email?: string; login?: string | null }) => {
          const key = item.login ?? item.email ?? '(no login/email)'
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {})
        const result = Object.entries(grouped)
          .map(([email, count]) => ({ email, count }))
          .sort((a, b) => b.count - a.count)
        setOutsideData(result)
      })
  }, [isAuthenticated])

  // This week from MySQL
  useEffect(() => {
    if (!isAuthenticated) return
    setWeekLoading(true)
    setWeekError(null)
    fetch('/api/statistics/week')
      .then((res) => {
        if (!res.ok) {
          if (res.status === 503) return res.json().then((j) => Promise.reject(new Error(j.error || 'MySQL not configured')))
          return Promise.reject(new Error(`HTTP ${res.status}`))
        }
        return res.json()
      })
      .then((data) => {
        setWeekByEmail(data.local?.byEmail ?? [])
        setWeekByDay(data.local?.byDay ?? [])
        setWeekOutsideByEmail(data.outside?.byEmail ?? [])
        setWeekOutsideByDay(data.outside?.byDay ?? [])
        setWeekLabel(data.weekStart && data.weekEnd ? `${data.weekStart} – ${data.weekEnd}` : 'This week')
      })
      .catch((e) => setWeekError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setWeekLoading(false))
  }, [isAuthenticated])

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
        <h1 className="text-2xl font-semibold">Statistics</h1>
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer hover:underline"
        >
          Back
        </Link>
      </div>

      {/* Today – top section as charts */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Today</h2>
        <div className="space-y-8">
          {/* Local */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Local</h3>
            {localLoading && (
              <div className="text-gray-500 py-4">Loading...</div>
            )}
            {localError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {localError}
              </div>
            )}
            {!localLoading && !localError && localData.length > 0 && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={localData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="email" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" name="Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {!localLoading && !localError && localData.length === 0 && (
              <div className="py-4 text-gray-500">No records</div>
            )}
          </div>

          {/* Outside */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Outside</h3>
            {outsideLoading && (
              <div className="text-gray-500 py-4">Loading...</div>
            )}
            {outsideError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {outsideError}
              </div>
            )}
            {!outsideLoading && !outsideError && outsideData.length > 0 && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={outsideData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="email" tick={{ fontSize: 12 }} name="Login" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => [value, 'Count']} labelFormatter={(label) => `Login: ${label}`} />
                    <Bar dataKey="count" fill="#ec4899" name="Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {!outsideLoading && !outsideError && outsideData.length === 0 && (
              <div className="py-4 text-gray-500">No records</div>
            )}
          </div>
        </div>
      </section>

      {/* This week (MySQL) – Local & Outside */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">This week (MySQL) – {weekLabel || 'Mon–Sun'}</h2>
        {weekLoading && (
          <div className="text-gray-500 py-4">Loading...</div>
        )}
        {weekError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-800 mb-4">
            {weekError}
          </div>
        )}
        {!weekLoading && !weekError && (
          <div className="space-y-8">
            {/* Local */}
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-2">Local</h3>
              {(weekByEmail.length > 0 || weekByDay.some((d) => d.count > 0)) ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Record count by email</h4>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weekByEmail} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="email" tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" name="Count" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Record count by day</h4>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weekByDay} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10b981" name="Count" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-gray-500">No records this week</div>
              )}
            </div>

            {/* Outside */}
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-2">Outside</h3>
              {(weekOutsideByEmail.length > 0 || weekOutsideByDay.some((d) => d.count > 0)) ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Record count by login</h4>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weekOutsideByEmail} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="login" tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#ec4899" name="Count" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Record count by day</h4>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weekOutsideByDay} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#f59e0b" name="Count" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-gray-500">No records this week</div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

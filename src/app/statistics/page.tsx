"use client"

import React, { useState, useEffect, useMemo } from 'react'
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
  Legend,
} from 'recharts'

type StatRow = { email: string; count: number }
type OutsideStatRow = { login: string; count: number }
type WeekByDay = { day: string; count: number }
type WeekTotalByDay = { day: string; local: number; outside: number }
type WeekByDayStacked = { day: string; local: number; outside: number; total: number }
type WeekOutsideByLoginAndDayRow = { day: string; login: string; count: number }

function getDefaultWeekRange(): { first: string; last: string } {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = (dayOfWeek + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - mondayOffset)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return { first: fmt(monday), last: fmt(sunday) }
}

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

  const defaultWeek = getDefaultWeekRange()
  const [weekFirstDay, setWeekFirstDay] = useState<string>(defaultWeek.first)
  const [weekLastDay, setWeekLastDay] = useState<string>(defaultWeek.last)
  const [weekByEmail, setWeekByEmail] = useState<StatRow[]>([])
  const [weekByDay, setWeekByDay] = useState<WeekByDay[]>([])
  const [weekOutsideByEmail, setWeekOutsideByEmail] = useState<OutsideStatRow[]>([])
  const [weekOutsideByDay, setWeekOutsideByDay] = useState<WeekByDay[]>([])
  const [weekOutsideByLoginAndDay, setWeekOutsideByLoginAndDay] = useState<WeekOutsideByLoginAndDayRow[]>([])
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

  // Week range from MySQL (refetch when first/last day change)
  useEffect(() => {
    if (!isAuthenticated) return
    if (!weekFirstDay || !weekLastDay || weekFirstDay > weekLastDay) return
    setWeekLoading(true)
    setWeekError(null)
    const params = new URLSearchParams({ startDate: weekFirstDay, endDate: weekLastDay })
    fetch(`/api/statistics/week?${params}`)
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
        setWeekOutsideByLoginAndDay(data.outside?.byLoginAndDay ?? [])
        setWeekLabel(data.weekStart && data.weekEnd ? `${data.weekStart} – ${data.weekEnd}` : '')
      })
      .catch((e) => setWeekError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setWeekLoading(false))
  }, [isAuthenticated, weekFirstDay, weekLastDay])

  // Total by day = local + outside (for stacked bar chart)
  const weekTotalByDay = useMemo<WeekTotalByDay[]>(() => {
    const outsideMap = new Map(weekOutsideByDay.map((d) => [d.day, d.count]))
    return weekByDay.map((d) => ({
      day: d.day,
      local: d.count,
      outside: outsideMap.get(d.day) ?? 0,
    }))
  }, [weekByDay, weekOutsideByDay])

  // Outside by login and day: pivot to { day, [login]: count } for stacked bar chart
  const OUTSIDE_LOGIN_COLORS = ['#ec4899', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#06b6d4', '#84cc16', '#f43f5e']
  const weekOutsideByLoginAndDayChart = useMemo(() => {
    const days = weekByDay.map((d) => d.day)
    const logins = [...new Set(weekOutsideByLoginAndDay.map((r) => r.login))]
    return days.map((day) => {
      const row: Record<string, string | number> = { day }
      for (const login of logins) {
        row[login] = weekOutsideByLoginAndDay.find((r) => r.day === day && r.login === login)?.count ?? 0
      }
      return row
    })
  }, [weekByDay, weekOutsideByLoginAndDay])
  const weekOutsideLogins = useMemo(
    () => [...new Set(weekOutsideByLoginAndDay.map((r) => r.login))],
    [weekOutsideByLoginAndDay]
  )

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
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h2 className="text-lg font-medium">Week range (MySQL)</h2>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">First day</span>
            <input
              type="date"
              value={weekFirstDay}
              onChange={(e) => setWeekFirstDay(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Last day</span>
            <input
              type="date"
              value={weekLastDay}
              onChange={(e) => setWeekLastDay(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              const { first, last } = getDefaultWeekRange()
              setWeekFirstDay(first)
              setWeekLastDay(last)
            }}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            This week
          </button>
        </div>
        {weekFirstDay && weekLastDay && weekFirstDay > weekLastDay && (
          <p className="text-sm text-amber-600 mb-2">First day must be before or equal to last day.</p>
        )}
        {weekLabel && (
          <p className="text-sm text-gray-500 mb-2">{weekLabel}</p>
        )}
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
            {/* Total (by day) – stacked bar: local + outside */}
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-2">Total (by day)</h3>
              <p className="text-sm text-gray-500 mb-2">Local + Outside per day (stacked)</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekTotalByDay} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="local" name="Local" stackId="total" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="outside" name="Outside" stackId="total" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

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
              {(weekOutsideByEmail.length > 0 || weekOutsideByDay.some((d) => d.count > 0) || weekOutsideByLoginAndDay.length > 0) ? (
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
                  {weekOutsideLogins.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-600 mb-1">Record count by login and day</h4>
                      <p className="text-xs text-gray-500 mb-1">Stacked bar: each segment is one login per day</p>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weekOutsideByLoginAndDayChart} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null
                                const total = payload.reduce((sum, p) => sum + (Number(p.value) || 0), 0)
                                return (
                                  <div className="bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-sm">
                                    <div className="font-medium text-gray-700 mb-1">{label}</div>
                                    {payload.map((p) => (
                                      <div key={p.name} className="flex gap-2" style={{ color: p.color }}>
                                        <span>{p.name}:</span>
                                        <span>{p.value}</span>
                                      </div>
                                    ))}
                                    <div className="flex gap-2 font-medium mt-1 pt-1 border-t border-gray-100">
                                      <span>Total count:</span>
                                      <span>{total}</span>
                                    </div>
                                  </div>
                                )
                              }}
                            />
                            <Legend />
                            {weekOutsideLogins.map((login, i) => (
                              <Bar
                                key={login}
                                dataKey={login}
                                name={login}
                                stackId="byLogin"
                                fill={OUTSIDE_LOGIN_COLORS[i % OUTSIDE_LOGIN_COLORS.length]}
                                radius={i === weekOutsideLogins.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
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

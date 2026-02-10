import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { getMysqlPool, isMysqlConfigured } from '@/lib/mysql'

type Row = RowDataPacket & { email?: string | null; day?: string | null; count?: number }
type RowBidder = RowDataPacket & { login?: string | null; email?: string | null; day?: string | null; count?: number }

function getThisWeekRange(): { start: Date; end: Date; days: string[] } {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 Sun, 1 Mon, ... 6 Sat
  const mondayOffset = (dayOfWeek + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - mondayOffset)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  const days: string[] = []
  const d = new Date(monday)
  for (let i = 0; i < 7; i++) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    days.push(`${y}-${m}-${day}`)
    d.setDate(d.getDate() + 1)
  }

  return { start: monday, end: sunday, days }
}

function formatForMysqlLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}:${s}`
}

/** Normalize MySQL DATE to YYYY-MM-DD so it matches our days array (mysql2 may return Date object). */
function toDayKey(day: unknown): string {
  if (day instanceof Date) {
    const y = day.getFullYear()
    const m = String(day.getMonth() + 1).padStart(2, '0')
    const d = String(day.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const s = day != null ? String(day) : ''
  return s.slice(0, 10)
}

function parseDateRange(startDate: string | null, endDate: string | null): { start: Date; end: Date; days: string[] } | null {
  if (!startDate || !endDate) return null
  const re = /^\d{4}-\d{2}-\d{2}$/
  if (!re.test(startDate) || !re.test(endDate)) return null
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T23:59:59')
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return null
  const days: string[] = []
  const d = new Date(start)
  while (d <= end) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    days.push(`${y}-${m}-${day}`)
    d.setDate(d.getDate() + 1)
  }
  return { start, end, days }
}

export async function GET(request: Request) {
  if (!isMysqlConfigured()) {
    return NextResponse.json(
      { error: 'MySQL is not configured (MYSQL_USER, MYSQL_PASSWORD)' },
      { status: 503 }
    )
  }

  const pool = getMysqlPool()
  if (!pool) {
    return NextResponse.json({ error: 'MySQL pool unavailable' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const range = parseDateRange(startDate, endDate) ?? getThisWeekRange()
  const { start, end, days } = range
  const startStr = formatForMysqlLocal(start)
  const endStr = formatForMysqlLocal(end)

  try {
    // Local: resume_data – count by email (this week)
    const [byEmailRows] = await pool.execute(
      `SELECT email, COUNT(*) as count FROM resume_data 
       WHERE created_at >= ? AND created_at <= ? 
       GROUP BY email ORDER BY count DESC`,
      [startStr, endStr]
    )

    // Local: resume_data – count by day (this week)
    const [byDayRows] = await pool.execute(
      `SELECT DATE(created_at) as day, COUNT(*) as count FROM resume_data 
       WHERE created_at >= ? AND created_at <= ? 
       GROUP BY DATE(created_at) ORDER BY day`,
      [startStr, endStr]
    )

    const byEmail = ((byEmailRows as Row[]) || []).map((row: Row) => ({
      email: row.email ?? '(no email)',
      count: Number(row.count),
    }))

    const dayMap = new Map<string, number>(days.map((d) => [d, 0]))
    for (const row of (byDayRows as Row[]) || []) {
      const key = toDayKey(row.day)
      if (key) dayMap.set(key, Number(row.count))
    }
    const byDay = days.map((day) => ({ day, count: dayMap.get(day) ?? 0 }))

    // Outside: resume_data_bidder – count by login/email (this week)
    const [byEmailOutsideRows] = await pool.execute(
      `SELECT COALESCE(login, email) as email, COUNT(*) as count FROM resume_data_bidder 
       WHERE created_at >= ? AND created_at <= ? 
       GROUP BY COALESCE(login, email) ORDER BY count DESC`,
      [startStr, endStr]
    )

    // Outside: resume_data_bidder – count by day (this week)
    const [byDayOutsideRows] = await pool.execute(
      `SELECT DATE(created_at) as day, COUNT(*) as count FROM resume_data_bidder 
       WHERE created_at >= ? AND created_at <= ? 
       GROUP BY DATE(created_at) ORDER BY day`,
      [startStr, endStr]
    )

    // Outside: resume_data_bidder – count by login AND day (this week)
    const [byLoginAndDayOutsideRows] = await pool.execute(
      `SELECT DATE(created_at) as day, COALESCE(login, email) as login, COUNT(*) as count 
       FROM resume_data_bidder 
       WHERE created_at >= ? AND created_at <= ? 
       GROUP BY DATE(created_at), COALESCE(login, email) ORDER BY day, count DESC`,
      [startStr, endStr]
    )

    const byEmailOutside = ((byEmailOutsideRows as RowBidder[]) || []).map((row: RowBidder) => ({
      login: row.email ?? '(no login)',
      count: Number(row.count),
    }))

    const dayMapOutside = new Map<string, number>(days.map((d) => [d, 0]))
    for (const row of (byDayOutsideRows as RowBidder[]) || []) {
      const key = toDayKey(row.day)
      if (key) dayMapOutside.set(key, Number(row.count))
    }
    const byDayOutside = days.map((day) => ({ day, count: dayMapOutside.get(day) ?? 0 }))

    type RowLoginDay = RowDataPacket & { day?: string | null; login?: string | null; count?: number }
    const byLoginAndDayOutside = ((byLoginAndDayOutsideRows as RowLoginDay[]) || []).map((row: RowLoginDay) => ({
      day: toDayKey(row.day),
      login: row.login ?? '(no login)',
      count: Number(row.count),
    }))

    return NextResponse.json({
      weekStart: days[0],
      weekEnd: days[days.length - 1],
      local: { byEmail, byDay },
      outside: { byEmail: byEmailOutside, byDay: byDayOutside, byLoginAndDay: byLoginAndDayOutside },
    })
  } catch (e) {
    console.error('MySQL statistics/week error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch week statistics' },
      { status: 500 }
    )
  }
}

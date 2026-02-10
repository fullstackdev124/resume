import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { getMysqlPool, isMysqlConfigured } from '@/lib/mysql'

type Row = RowDataPacket & { login?: string | null; email?: string | null; count?: number }

function parseDate(s: string | null): string | null {
  if (!s || typeof s !== 'string') return null
  const trimmed = s.trim().slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null
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
  const startDate = parseDate(searchParams.get('startDate'))
  const endDate = parseDate(searchParams.get('endDate'))

  try {
    let sql = `SELECT COALESCE(login, '') as login, COALESCE(email, '') as email, COUNT(*) as count 
       FROM resume_history`
    const params: (string | number)[] = []
    if (startDate && endDate) {
      sql += ` WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?`
      params.push(startDate, endDate)
    }
    sql += ` GROUP BY COALESCE(login, ''), COALESCE(email, '')`

    const [rows] = params.length
      ? await pool.execute<Row[]>(sql, params as string[])
      : await pool.execute<Row[]>(sql)

    const localByEmail: { name: string; value: number }[] = []
    const otherByLogin: { name: string; value: number }[] = []
    const localMap = new Map<string, number>()
    const otherMap = new Map<string, number>()

    for (const row of rows || []) {
      const login = String(row.login ?? '')
      const email = String(row.email ?? '')
      const count = Number(row.count) || 0
      if (login === 'local') {
        const key = email || '(no email)'
        localMap.set(key, (localMap.get(key) ?? 0) + count)
      } else {
        const key = login || '(no login)'
        otherMap.set(key, (otherMap.get(key) ?? 0) + count)
      }
    }

    localMap.forEach((value, name) => localByEmail.push({ name, value }))
    otherMap.forEach((value, name) => otherByLogin.push({ name, value }))

    localByEmail.sort((a, b) => b.value - a.value)
    otherByLogin.sort((a, b) => b.value - a.value)

    const localInterviewByEmail: { name: string; value: number }[] = []
    const otherInterviewByLogin: { name: string; value: number }[] = []
    const localInterviewMap = new Map<string, number>()
    const otherInterviewMap = new Map<string, number>()

    let interviewSql = `SELECT COALESCE(login, '') as login, COALESCE(email, '') as email, COUNT(*) as count FROM interview_scheduled`
    const interviewParams: (string | number)[] = []
    if (startDate && endDate) {
      interviewSql += ` WHERE DATE(at) >= ? AND DATE(at) <= ?`
      interviewParams.push(startDate, endDate)
    }
    interviewSql += ` GROUP BY COALESCE(login, ''), COALESCE(email, '')`
    const [interviewRows] = interviewParams.length
      ? await pool.execute<Row[]>(interviewSql, interviewParams as string[])
      : await pool.execute<Row[]>(interviewSql)

    for (const row of (interviewRows as Row[]) || []) {
      const login = String(row.login ?? '')
      const email = String(row.email ?? '')
      const count = Number(row.count) || 0
      if (login === 'local') {
        const key = email || '(no email)'
        localInterviewMap.set(key, (localInterviewMap.get(key) ?? 0) + count)
      } else {
        const key = login || '(no login)'
        otherInterviewMap.set(key, (otherInterviewMap.get(key) ?? 0) + count)
      }
    }
    localInterviewMap.forEach((value, name) => localInterviewByEmail.push({ name, value }))
    otherInterviewMap.forEach((value, name) => otherInterviewByLogin.push({ name, value }))
    localInterviewByEmail.sort((a, b) => b.value - a.value)
    otherInterviewByLogin.sort((a, b) => b.value - a.value)

    return NextResponse.json({
      localByEmail,
      otherByLogin,
      localInterviewByEmail,
      otherInterviewByLogin,
    })
  } catch (e) {
    console.error('MySQL analytics/rates error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}

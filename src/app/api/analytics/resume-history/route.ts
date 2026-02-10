import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { getMysqlPool, isMysqlConfigured } from '@/lib/mysql'

type ResumeHistoryRow = RowDataPacket & {
  id?: string | number | null
  login?: string | null
  email?: string | null
  data?: string | null
  created_at?: string | Date | null
  identifier?: string | null
  description?: string | null
  scheduled_id?: string | number | null
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
  const q = searchParams.get('q')?.trim() ?? ''

  try {
    let rows: ResumeHistoryRow[]
    if (q === '') {
      const [result] = await pool.execute(
        `SELECT rh.id, rh.login, rh.email, rh.data, rh.created_at, rh.identifier, rh.description,
                sch.id AS scheduled_id
         FROM resume_history rh
         LEFT JOIN interview_scheduled sch ON sch.id = rh.id
         ORDER BY rh.created_at DESC
         LIMIT 10`
      )
      rows = result as ResumeHistoryRow[]
    } else {
      const likeArg = `%${q}%`
      const [result] = await pool.execute(
        `SELECT rh.id, rh.login, rh.email, rh.data, rh.created_at, rh.identifier, rh.description,
                sch.id AS scheduled_id
         FROM resume_history rh
         LEFT JOIN interview_scheduled sch ON sch.id = rh.id
         WHERE rh.identifier LIKE ? OR rh.description LIKE ?
         ORDER BY rh.created_at DESC
         LIMIT 10`,
        [likeArg, likeArg]
      )
      rows = result as ResumeHistoryRow[]
    }

    function toDateString(d: unknown): string | null {
      if (d == null) return null
      const date = d instanceof Date ? d : new Date(String(d))
      if (Number.isNaN(date.getTime())) return null
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }
    const list = rows.map((row) => ({
      id: row.id != null ? String(row.id) : null,
      login: row.login ?? null,
      email: row.email ?? null,
      data: row.data ?? null,
      created_at: toDateString(row.created_at),
      identifier: row.identifier ?? null,
      description: row.description ?? null,
      scheduled: row.scheduled_id != null,
    }))

    return NextResponse.json({ items: list })
  } catch (e) {
    console.error('MySQL resume_history error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch resume history' },
      { status: 500 }
    )
  }
}

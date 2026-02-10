import { NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2'
import { getMysqlPool, isMysqlConfigured } from '@/lib/mysql'

type Row = RowDataPacket & { id?: string | null }

export async function GET() {
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

  try {
    const [rows] = await pool.execute<Row[]>(`SELECT id FROM interview_scheduled`)
    const ids = ((rows as Row[]) || []).map((r) => String(r.id ?? '')).filter(Boolean)
    return NextResponse.json({ ids })
  } catch (e) {
    console.error('MySQL scheduled-ids error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch scheduled ids' },
      { status: 500 }
    )
  }
}

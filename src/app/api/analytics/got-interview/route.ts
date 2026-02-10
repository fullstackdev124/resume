import { NextResponse } from 'next/server'
import { getMysqlPool, isMysqlConfigured } from '@/lib/mysql'

export async function POST(request: Request) {
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

  let body: { id?: string; login?: string; email?: string; at?: string; identifier?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const id = typeof body.id === 'string' ? body.id.trim() : ''
  const login = typeof body.login === 'string' ? body.login.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : ''
  let at = typeof body.at === 'string' ? body.at.trim() : ''
  if (at && !/^\d{4}-\d{2}-\d{2}$/.test(at)) {
    const d = new Date(at)
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      at = `${y}-${m}-${day}`
    }
  }

  if (!id || !login || !email || !at || !/^\d{4}-\d{2}-\d{2}$/.test(at)) {
    return NextResponse.json(
      { error: 'id, login, email, and at (YYYY-MM-DD) are required' },
      { status: 400 }
    )
  }

  try {
    const [existing] = await pool.execute(
      `SELECT 1 FROM interview_scheduled WHERE id = ? LIMIT 1`,
      [id]
    )
    const rows = existing as unknown[]
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(
        { error: 'Already scheduled' },
        { status: 409 }
      )
    }
    await pool.execute(
      `INSERT INTO interview_scheduled (id, login, email, at, identifier) VALUES (?, ?, ?, ?, ?)`,
      [id, login, email, at, identifier]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('MySQL interview_scheduled insert error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to save' },
      { status: 500 }
    )
  }
}

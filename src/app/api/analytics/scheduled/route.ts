import { NextResponse } from 'next/server'
import { getMysqlPool, isMysqlConfigured } from '@/lib/mysql'

export async function DELETE(request: Request) {
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
  const id = searchParams.get('id')?.trim()
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  try {
    const [result] = await pool.execute('DELETE FROM interview_scheduled WHERE id = ?', [id])
    const affected = (result as { affectedRows?: number }).affectedRows ?? 0
    if (affected === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('MySQL interview_scheduled delete error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to remove' },
      { status: 500 }
    )
  }
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for Supabase operations (client-side)

export async function getMyInterviews(email: string) {
  const { data, error } = await supabase
    .from('schedule')
    .select('id, title, company, role, created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch interviews: ${error.message}`)
  }

  return { schedules: data || [] }
}

export async function getMissingInterviews(email: string) {
  // Get user's schedules
  const { data: mySchedules, error: myError } = await supabase
    .from('schedule')
    .select('title, company')
    .eq('email', email)

  if (myError) {
    throw new Error(`Failed to fetch user schedules: ${myError.message}`)
  }

  // Get user's bids
  const { data: myBids, error: bidError } = await supabase
    .from('schedule_bid')
    .select('schedule_id')
    .eq('email', email)

  if (bidError) {
    throw new Error(`Failed to fetch user bids: ${bidError.message}`)
  }

  // Get all schedules from other users
  const { data: allSchedules, error: allError } = await supabase
    .from('schedule')
    .select('id, email, title, company, role, created_at')
    .neq('email', email)
    .order('created_at', { ascending: false })

  if (allError) {
    throw new Error(`Failed to fetch all schedules: ${allError.message}`)
  }

  // Create sets for filtering
  const bidScheduleIds = new Set((myBids || []).map(bid => bid.schedule_id))
  const myScheduleKeys = new Set(
    (mySchedules || []).map(s => 
      `${(s.title || '').toLowerCase().trim()}|${(s.company || '').toLowerCase().trim()}`
    )
  )

  // Filter missing schedules
  const missingSchedules = (allSchedules || []).filter(schedule => {
    const normalizedKey = `${(schedule.title || '').toLowerCase().trim()}|${(schedule.company || '').toLowerCase().trim()}`
    if (myScheduleKeys.has(normalizedKey)) return false
    if (bidScheduleIds.has(schedule.id)) return false
    return true
  })

  return { missingSchedules }
}

export async function saveSchedule(email: string, title: string, company: string, role?: string) {
  const { data, error } = await supabase
    .from('schedule')
    .insert([{ email, title, company, role: role || null }])
    .select()

  if (error) {
    throw new Error(`Failed to save schedule: ${error.message}`)
  }

  return { success: true, data }
}

export async function updateSchedule(id: number, title: string, company: string, role?: string) {
  const { data, error } = await supabase
    .from('schedule')
    .update({ title, company, role: role || null })
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(`Failed to update schedule: ${error.message}`)
  }

  return { success: true, data }
}

export async function deleteSchedule(id: number) {
  const { error } = await supabase
    .from('schedule')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete schedule: ${error.message}`)
  }

  return { success: true }
}

export async function saveBid(scheduleId: number, email: string) {
  const { data, error } = await supabase
    .from('schedule_bid')
    .insert([{ schedule_id: scheduleId, email }])
    .select()

  if (error) {
    throw new Error(`Failed to save bid: ${error.message}`)
  }

  return { success: true, data }
}

export async function saveResume(
  json: any,
  identifier: string | null,
  description: string | null,
  username: string
) {
  // Extract email prefix
  let emailPrefix = ''
  if (json?.email) {
    const emailParts = json.email.split('@')
    emailPrefix = emailParts[0] || ''
  }

  const tableName = username && username !== 'local' ? 'resume_data_bidder' : 'resume_data'
  const insertData: any = {
    data: json,
    email: emailPrefix,
    identifier: identifier || null,
    description: description || null
  }

  if (tableName === 'resume_data_bidder') {
    insertData.login = username === 'local' ? null : username
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert([insertData])
    .select()

  if (error) {
    throw new Error(`Failed to save resume: ${error.message}`)
  }

  return { success: true, data }
}

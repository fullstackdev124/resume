import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    SERVER: process.env.SERVER ?? '',
  })
}

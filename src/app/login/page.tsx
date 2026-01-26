"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!username || !password) {
        setError('Username and password are required')
        setLoading(false)
        return
      }

      if (!supabaseUrl || !supabaseAnonKey) {
        setError('Database configuration is missing. Please contact support.')
        setLoading(false)
        return
      }

      // Query Supabase directly (works with static export)
      const { data: user, error } = await supabase
        .from("users")
        .select("password, mapping")
        .eq("user_id", username)
        .maybeSingle()

      if (error) {
        console.error("Supabase error during login:", error)
        setError("Database error during login")
        setLoading(false)
        return
      }

      if (!user || user.password !== password) {
        setError("Invalid username or password")
        setLoading(false)
        return
      }

      // Parse mapping: comma-separated account strings
      const accounts = (user.mapping || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)

      if (accounts.length === 0) {
        setError("No accounts mapped for this user")
        setLoading(false)
        return
      }

      // Store login info in localStorage
      localStorage.setItem('username', username)
      localStorage.setItem('password', password)
      localStorage.setItem('accounts', JSON.stringify(accounts))
      // Expire credentials after 24 hours
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000
      localStorage.setItem('authExpiresAt', String(expiresAt))
      // Redirect to main page
      router.push('/')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        setError('Failed to connect to database. Please check your internet connection.')
      } else if (!supabaseUrl || !supabaseAnonKey) {
        setError('Database configuration is missing. Please contact support.')
      } else {
        setError(`Login failed: ${errorMessage}`)
      }
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Bidding system</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border rounded text-base"
                  placeholder="Enter username"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded text-base"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !username || !password}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-gray-600">
        <p>Copyright © {new Date().getFullYear()} AI.Tech Labs. All rights reserved.</p>
      </footer>
    </main>
  )
}

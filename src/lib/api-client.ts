/**
 * Get the base URL for API calls
 * In Tauri, use localhost:3333 where the Next.js server runs
 * In web, use relative paths
 */
export function getApiBaseUrl(): string {
  // Check if running in Tauri
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    return 'http://localhost:3333'
  }
  // For web, use relative paths
  return ''
}

/**
 * Make an API call with proper base URL handling
 */
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`
  return fetch(url, options)
}

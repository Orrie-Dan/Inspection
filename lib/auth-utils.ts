/**
 * Utility functions for handling ArcGIS Portal authentication
 */

import { getCurrentUserDistrict } from "@/components/user-config"
import { applyDistrictFiltersToUrl } from "@/components/district-config"

export function getPortalToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('portalToken')
}

export function getPortalUrl(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('portalUrl')
}

export function isTokenValid(): boolean {
  if (typeof window === 'undefined') return false
  
  const token = getPortalToken()
  const expires = localStorage.getItem('tokenExpires')
  
  if (!token) return false
  
  // Check if token has expired
  if (expires) {
    const expirationTime = parseInt(expires, 10)
    const currentTime = Date.now()
    // Add 5 minute buffer before expiration
    return currentTime < (expirationTime - 5 * 60 * 1000)
  }
  
  return true
}

export function clearAuthData(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('portalToken')
  localStorage.removeItem('portalUrl')
  localStorage.removeItem('username')
  localStorage.removeItem('tokenExpires')
  localStorage.removeItem('portalUser')
  localStorage.removeItem('authToken') // Legacy cleanup
}

/**
 * Appends authentication token to ArcGIS dashboard/app URLs
 * For ArcGIS Enterprise Portal, the token can be passed as:
 * 1. URL query parameter: ?token=...
 * 2. Hash fragment: #token=... (for some apps)
 * 3. Both query and hash for maximum compatibility
 */
export function appendTokenToUrl(url: string): string {
  const token = getPortalToken()
  const portalUrl = getPortalUrl()
  const userDistrict = getCurrentUserDistrict()
  
  if (!token) {
    console.warn('No token available for URL:', url)
    return url
  }
  
  try {
    // First apply district filters
    let filteredUrl = applyDistrictFiltersToUrl(url, userDistrict)
    
    const urlObj = new URL(filteredUrl)
    
    // Remove existing token parameters to avoid duplicates
    urlObj.searchParams.delete('token')
    
    // Add token as query parameter (primary method)
    urlObj.searchParams.set('token', token)
    
    // Add portalUrl if it's an ArcGIS app/dashboard
    if (portalUrl) {
      if (url.includes('/apps/') || url.includes('arcgis.com') || url.includes('survey123')) {
        urlObj.searchParams.set('portalUrl', portalUrl)
      }
    }
    
    // Get the base URL without hash (query params only)
    const baseUrl = urlObj.origin + urlObj.pathname + (urlObj.search || '')
    const existingHash = urlObj.hash ? urlObj.hash.substring(1) : '' // Remove # from hash
    
    // Build hash fragment preserving District filter and adding token
    const hashParams: string[] = []
    
    // Preserve existing hash parameters (like District=...)
    if (existingHash) {
      // Split existing hash and add non-token params
      existingHash.split('&').forEach(param => {
        if (!param.startsWith('token=') && !param.startsWith('portalUrl=')) {
          hashParams.push(param)
        }
      })
    }
    
    // Add token to hash
    hashParams.push(`token=${token}`)
    
    // Add portalUrl to hash if needed
    if (portalUrl) {
      hashParams.push(`portalUrl=${encodeURIComponent(portalUrl)}`)
    }
    
    const hashFragment = hashParams.join('&')
    const finalUrl = `${baseUrl}#${hashFragment}`
    // Log the full URL for debugging (token will be visible in console)
    console.log('Authenticated URL created with district filters:', finalUrl)
    console.log('User district:', userDistrict)
    console.log('Token parameter present:', urlObj.searchParams.has('token'))
    console.log('Portal URL parameter present:', urlObj.searchParams.has('portalUrl'))
    return finalUrl
  } catch (error) {
    console.error('Error appending token to URL:', error)
    // If URL parsing fails, append token manually
    const separator = url.includes('?') ? '&' : '?'
    const portalParam = portalUrl ? `&portalUrl=${encodeURIComponent(portalUrl)}` : ''
    return `${url}${separator}token=${token}${portalParam}`
  }
}

/**
 * Checks if user is authenticated and redirects to login if not
 */
export function requireAuth(): boolean {
  if (typeof window === 'undefined') return false
  
  if (!isTokenValid()) {
    clearAuthData()
    window.location.href = '/login'
    return false
  }
  
  return true
}


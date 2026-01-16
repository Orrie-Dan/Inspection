"use client"

import { getUserByUsername } from "@/components/users"

/**
 * Extract district from username (format: username_districtname)
 * Examples: claudine_bugesera -> bugesera, narcisse_rwamagana -> rwamagana
 */
export function getDistrictFromUsername(username: string): string | null {
  if (!username) return null
  
  // First check if user exists in our users list
  const user = getUserByUsername(username)
  if (user) {
    return user.district
  }
  
  // Fallback: try to extract district from username format
  const parts = username.split('_')
  if (parts.length >= 2) {
    return parts[parts.length - 1].toLowerCase()
  }
  
  return null
}

/**
 * Get current logged-in user's username
 */
export function getCurrentUsername(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('username')
}

/**
 * Get current user's district (extracted from username)
 */
export function getCurrentUserDistrict(): string | null {
  const username = getCurrentUsername()
  if (!username) return null
  return getDistrictFromUsername(username)
}

/**
 * Get current user's full information
 */
export function getCurrentUserInfo() {
  const username = getCurrentUsername()
  if (!username) return null
  return getUserByUsername(username)
}



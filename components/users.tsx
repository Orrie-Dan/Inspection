"use client"

/**
 * User information structure
 */
export interface User {
  username: string
  district: string
  fullName?: string
  email?: string
  role?: string
}

/**
 * All users in the system
 * Format: username_districtname
 */
export const allUsers: User[] = [
  {
    username: "jeannette_bugesera",
    district: "bugesera",
    fullName: "Jeannette",
  },
  {
    username: "claudine_bugesera",
    district: "bugesera",
    fullName: "Claudine",
  },
  {
    username: "ambaza_bugesera",
    district: "bugesera",
    fullName: "Ambaza",
  },
  {
    username: "imanizabayoj_bugesera",
    district: "bugesera",
    fullName: "Imanizabayoj",
  },
  {
    username: "twizeyimana_bugesera",
    district: "bugesera",
    fullName: "Twizeyimana",
  },
  {
    username: "ntawuhiga_bugesera",
    district: "bugesera",
    fullName: "Ntawuhiga",
  },
  {
    username: "jeanpierre_bugesera",
    district: "bugesera",
    fullName: "Jean Pierre",
  },
  {
    username: "munyangoga_bugesera",
    district: "bugesera",
    fullName: "Munyangoga",
  },
  {
    username: "theobard_bugesera",
    district: "bugesera",
    fullName: "Theobard",
  },
  {
    username: "yannick_bugesera",
    district: "bugesera",
    fullName: "Yannick",
  },
  {
    username: "rhoda_bugesera",
    district: "bugesera",
    fullName: "Rhoda",
  },
  {
    username: "jonas_bugesera",
    district: "bugesera",
    fullName: "Jonas",
  },
  {
    username: "christine_bugesera",
    district: "bugesera",
    fullName: "Christine",
  },
  {
    username: "kabano_bugesera",
    district: "bugesera",
    fullName: "Kabano",
  },
  // Rwamagana District Users
  {
    username: "wenceslas_rwamagana",
    district: "rwamagana",
    fullName: "Wenceslas",
  },
  {
    username: "narcisse_rwamagana",
    district: "rwamagana",
    fullName: "Narcisse",
  },
  {
    username: "bestsion_rwamagana",
    district: "rwamagana",
    fullName: "Bestsion",
  },
  {
    username: "gdathos_rwamagana",
    district: "rwamagana",
    fullName: "Gdathos",
  },
  {
    username: "baptist_rwamagana",
    district: "rwamagana",
    fullName: "Baptist",
  },
  {
    username: "mukeshimana_rwamagana",
    district: "rwamagana",
    fullName: "Mukeshimana",
  },
  {
    username: "jeanclaude_rwamagana",
    district: "rwamagana",
    fullName: "Jean Claude",
  },
  {
    username: "uwaconsobi_rwamagana",
    district: "rwamagana",
    fullName: "Uwaconsobi",
  },
  {
    username: "habahayo_rwamagana",
    district: "rwamagana",
    fullName: "Habahayo",
  },
  {
    username: "nsabimana_rwamagana",
    district: "rwamagana",
    fullName: "Nsabimana",
  },
  {
    username: "livingstone_rwamagana",
    district: "rwamagana",
    fullName: "Livingstone",
  },
  {
    username: "fmugira_rwamagana",
    district: "rwamagana",
    fullName: "Fmugira",
  },
  {
    username: "bizimana_rwamagana",
    district: "rwamagana",
    fullName: "Bizimana",
  },
  {
    username: "speratus_rwamagana",
    district: "rwamagana",
    fullName: "Speratus",
  },
  {
    username: "gahunzire_rwamagana",
    district: "rwamagana",
    fullName: "Gahunzire",
  },
]

/**
 * Get user by username
 */
export function getUserByUsername(username: string): User | null {
  return allUsers.find(user => user.username === username) || null
}

/**
 * Get all users for a specific district
 */
export function getUsersByDistrict(district: string): User[] {
  return allUsers.filter(user => user.district.toLowerCase() === district.toLowerCase())
}

/**
 * Get all unique districts
 */
export function getAllDistricts(): string[] {
  const districts = new Set(allUsers.map(user => user.district.toLowerCase()))
  return Array.from(districts).sort()
}

/**
 * Check if a username exists in the system
 */
export function userExists(username: string): boolean {
  return allUsers.some(user => user.username === username)
}

/**
 * Get user count by district
 */
export function getUserCountByDistrict(): { district: string; count: number }[] {
  const districtCounts: { [key: string]: number } = {}
  
  allUsers.forEach(user => {
    const district = user.district.toLowerCase()
    districtCounts[district] = (districtCounts[district] || 0) + 1
  })
  
  return Object.entries(districtCounts)
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => a.district.localeCompare(b.district))
}

/**
 * Get total user count
 */
export function getTotalUserCount(): number {
  return allUsers.length
}


"use client"

/**
 * Dashboard URLs and filters for each district
 */
export interface DistrictDashboards {
  district: string
  allowedUrls: string[]
  urlFilters?: {
    [key: string]: string // URL parameter filters
  }
}

export const districtDashboards: DistrictDashboards[] = [
  {
    district: "bugesera",
    allowedUrls: [
      "https://gh.space.gov.rw/portal/apps/dashboards/b3e95d36ef1d4b618974da7ee0a2b6df", // Detected Constructions
      "https://gh.space.gov.rw/portal/apps/dashboards/cec79918f7e4435a82f203acb25af4ca", // Inspection Performance
      "https://gh.space.gov.rw/portal/apps/dashboards/2fbe0208d1e4410da15ff26609b53e6f", // Revenue Compliance
      "https://gh.space.gov.rw/portal/apps/dashboards/3baea36026ac432f854c0e28b65884b4", // Permit Compliance
      "https://survey123.arcgis.com/share/994ae914aafb40008f3f48cf8e10c722?portalUrl=https://gh.space.gov.rw/portal", // Inspection Field Checklist
    ],
    urlFilters: {
      "District": "Bugesera",
      // Add more filter parameters as needed
      // "region": "Eastern",
    }
  },
  {
    district: "rwamagana",
    allowedUrls: [
      "https://gh.space.gov.rw/portal/apps/dashboards/b3e95d36ef1d4b618974da7ee0a2b6df", // Detected Constructions
      "https://gh.space.gov.rw/portal/apps/dashboards/cec79918f7e4435a82f203acb25af4ca", // Inspection Performance
      "https://gh.space.gov.rw/portal/apps/dashboards/2fbe0208d1e4410da15ff26609b53e6f", // Revenue Compliance
      "https://gh.space.gov.rw/portal/apps/dashboards/3baea36026ac432f854c0e28b65884b4", // Permit Compliance
      "https://survey123.arcgis.com/share/994ae914aafb40008f3f48cf8e10c722?portalUrl=https://gh.space.gov.rw/portal", // Inspection Field Checklist
    ],
    urlFilters: {
      "District": "Rwamagana",
    }
  },
]

/**
 * Get allowed dashboard URLs for a district
 */
export function getAllowedUrlsForDistrict(district: string | null): string[] {
  if (!district) return []
  
  const districtConfig = districtDashboards.find(d => d.district.toLowerCase() === district.toLowerCase())
  return districtConfig?.allowedUrls || []
}

/**
 * Get URL filters for a district
 */
export function getUrlFiltersForDistrict(district: string | null): { [key: string]: string } {
  if (!district) return {}
  
  const districtConfig = districtDashboards.find(d => d.district.toLowerCase() === district.toLowerCase())
  return districtConfig?.urlFilters || {}
}

/**
 * Apply district filters to a URL as both query parameter and hash fragment
 * Query parameter for immediate processing, hash fragment for ArcGIS dashboard processing
 * Format: ?District=districtname#District=districtname
 */
export function applyDistrictFiltersToUrl(url: string, district: string | null): string {
  if (!district) return url
  
  const filters = getUrlFiltersForDistrict(district)
  if (Object.keys(filters).length === 0) return url
  
  try {
    const urlObj = new URL(url)
    
    // Apply filters as query parameters (for immediate processing)
    Object.entries(filters).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value)
    })
    
    const baseUrl = urlObj.origin + urlObj.pathname + (urlObj.search || '')
    
    // Also add to hash fragment (for ArcGIS dashboard processing)
    const filterParams = Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    
    // Get existing hash if present
    const existingHash = urlObj.hash ? urlObj.hash.substring(1) : '' // Remove # from hash
    
    // Combine existing hash with new filters
    let hashFragment = filterParams
    if (existingHash) {
      // Check if District already exists in hash, replace it
      if (existingHash.includes('District=')) {
        hashFragment = existingHash.replace(/District=[^&]*/, filterParams)
      } else {
        // Append to existing hash
        hashFragment = `${existingHash}&${filterParams}`
      }
    }
    
    return `${baseUrl}#${hashFragment}`
  } catch (error) {
    console.error('Error applying filters to URL:', error)
    // If URL parsing fails, append filters manually
    const separator = url.includes('?') ? '&' : '?'
    const baseUrl = url.split('#')[0]
    const existingHash = url.includes('#') ? url.split('#')[1] : ''
    
    const filterParams = Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    
    let hashFragment = filterParams
    if (existingHash) {
      if (existingHash.includes('District=')) {
        hashFragment = existingHash.replace(/District=[^&]*/, filterParams)
      } else {
        hashFragment = `${existingHash}&${filterParams}`
      }
    }
    
    return `${baseUrl}${separator}${filterParams}#${hashFragment}`
  }
}

/**
 * Check if a URL is allowed for a district
 */
export function isUrlAllowedForDistrict(url: string, district: string | null): boolean {
  if (!district) return false
  const allowedUrls = getAllowedUrlsForDistrict(district)
  // Check base URL without query parameters
  const baseUrl = url.split('?')[0].split('#')[0]
  return allowedUrls.some(allowedUrl => {
    const allowedBaseUrl = allowedUrl.split('?')[0].split('#')[0]
    return baseUrl === allowedBaseUrl
  })
}


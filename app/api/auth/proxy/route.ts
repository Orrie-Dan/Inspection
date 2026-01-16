import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy route to inject authentication token into dashboard URLs
 * This helps bypass CORS and ensures tokens are properly passed
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const targetUrl = searchParams.get('url')
    const token = searchParams.get('token')
    const portalUrl = searchParams.get('portalUrl')

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Missing target URL' },
        { status: 400 }
      )
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Missing authentication token' },
        { status: 401 }
      )
    }

    // Construct the authenticated URL
    try {
      const urlObj = new URL(targetUrl)
      urlObj.searchParams.set('token', token)
      if (portalUrl) {
        urlObj.searchParams.set('portalUrl', portalUrl)
      }
      
      // Return a redirect to the authenticated URL
      return NextResponse.redirect(urlObj.toString())
    } catch (error) {
      // If URL parsing fails, append manually
      const separator = targetUrl.includes('?') ? '&' : '?'
      const portalParam = portalUrl ? `&portalUrl=${encodeURIComponent(portalUrl)}` : ''
      const authenticatedUrl = `${targetUrl}${separator}token=${token}${portalParam}`
      return NextResponse.redirect(authenticatedUrl)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: { message: "Username and password are required" } },
        { status: 400 }
      )
    }

    // ArcGIS Enterprise Portal authentication endpoint
    const portalUrl = "https://gh.space.gov.rw/portal"
    const tokenUrl = `${portalUrl}/sharing/rest/generateToken`

    // Create form data for token request
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)
    // Use the request origin as referer for proper token generation
    const referer = request.headers.get('origin') || request.headers.get('referer') || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    formData.append("referer", referer)
    formData.append("f", "json")
    formData.append("expiration", "1440") // Token expires in 24 hours (1440 minutes) for better UX

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const data = await response.json()

    if (data.error) {
      return NextResponse.json(
        { error: data.error },
        { status: 401 }
      )
    }

    if (data.token) {
      // Return token and user info to client
      return NextResponse.json({
        token: data.token,
        expires: data.expires,
        user: data.user || null,
        portalUrl: portalUrl,
      })
    }

    return NextResponse.json(
      { error: { message: "Authentication failed" } },
      { status: 401 }
    )
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json(
      { error: { message: "Network error. Please try again." } },
      { status: 500 }
    )
  }
}


"use client"

import { useState, useEffect, useRef } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { appendTokenToUrl, requireAuth } from "@/lib/auth-utils"
import { ArcGISAuthProvider } from "@/components/arcgis-auth-provider"
import { getCurrentUserDistrict } from "@/components/user-config"
import { getAllowedUrlsForDistrict } from "@/components/district-config"

// Default dashboard URL (Detected Constructions)
const DEFAULT_DASHBOARD_URL = "https://gh.space.gov.rw/portal/apps/dashboards/b3e95d36ef1d4b618974da7ee0a2b6df"

export default function Home() {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)
  const [iframeError, setIframeError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Check authentication and load default dashboard on mount
  useEffect(() => {
    if (requireAuth()) {
      const userDistrict = getCurrentUserDistrict()
      const allowedUrls = getAllowedUrlsForDistrict(userDistrict)
      
      // Use first allowed URL for user's district, or fallback to default
      const defaultUrl = allowedUrls.length > 0 
        ? allowedUrls[0] 
        : DEFAULT_DASHBOARD_URL
      
      const authenticatedUrl = appendTokenToUrl(defaultUrl)
      setIframeSrc(authenticatedUrl)
    }
  }, [])

  const handleNavClick = (url: string) => {
    setIframeError(false)
    // Append authentication token to the URL
    const authenticatedUrl = appendTokenToUrl(url)
    console.log('Loading dashboard with URL:', authenticatedUrl)
    console.log('Token present:', !!localStorage.getItem('portalToken'))
    setIframeSrc(authenticatedUrl)
  }

  const handleIframeError = () => {
    setIframeError(true)
  }

  const handleOpenInSameWindow = () => {
    if (iframeSrc) {
      // Ensure token is included when opening in same window
      const authenticatedUrl = appendTokenToUrl(iframeSrc)
      window.location.href = authenticatedUrl
    }
  }


  // Handle clicks inside the IFrame and inject token if needed
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !iframeSrc) return

    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the same origin or trusted sources
      if (event.data && typeof event.data === 'object') {
        if (event.data.type === 'link-click' && event.data.url) {
          // Open link in new tab
          window.open(event.data.url, '_blank', 'noopener,noreferrer')
        } else if (event.data.type === 'navigation' && event.data.url) {
          // Handle navigation requests
          window.open(event.data.url, '_blank', 'noopener,noreferrer')
        }
      }
    }

    // Inject token into iframe after it loads using multiple methods
    const injectToken = () => {
      try {
        const token = localStorage.getItem('portalToken')
        const portalUrl = localStorage.getItem('portalUrl')
        
        if (token && iframe.contentWindow) {
          // Method 1: Try to inject token via postMessage for ArcGIS apps
          iframe.contentWindow.postMessage({
            type: 'arcgis-auth',
            token: token,
            portalUrl: portalUrl || 'https://gh.space.gov.rw/portal'
          }, '*')
          
          // Method 2: Try to set token in iframe's localStorage (if same origin)
          try {
            if (iframe.contentWindow && iframe.contentWindow.localStorage) {
              iframe.contentWindow.localStorage.setItem('portalToken', token)
              if (portalUrl) {
                iframe.contentWindow.localStorage.setItem('portalUrl', portalUrl)
              }
            }
          } catch (e) {
            // Cross-origin, expected to fail
          }
          
          // Method 3: Try to inject via window.arcgisIdentityManager if available
          try {
            if (iframe.contentWindow && (iframe.contentWindow as any).arcgisIdentityManager) {
              const identityManager = (iframe.contentWindow as any).arcgisIdentityManager
              identityManager.registerToken({
                server: portalUrl || 'https://gh.space.gov.rw/portal',
                token: token
              })
            }
          } catch (e) {
            // Not available, expected
          }
        }
      } catch (error) {
        // Cross-origin restrictions may prevent this, which is expected
        console.debug('Token injection attempted (may be blocked by CORS):', error)
      }
    }

    // Listen for postMessage from the IFrame
    window.addEventListener('message', handleMessage)
    
    // Try to inject token after iframe loads (with delay to ensure it's ready)
    const timeoutId = setTimeout(() => {
      iframe.addEventListener('load', injectToken)
      injectToken() // Also try immediately
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('message', handleMessage)
      iframe.removeEventListener('load', injectToken)
    }
  }, [iframeSrc])

  // Always show dashboard (default dashboard loads on mount)
  if (!iframeSrc) {
    return null // Loading state
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <TopNavigation onNavClick={handleNavClick} />
      <div className="flex-1 relative min-h-0">
        <div className="relative w-full h-full">
          {iframeError ? (
            <div className="flex flex-col items-center justify-center h-full bg-muted/30">
              <div className="text-center p-8 max-w-md">
                <div className="mb-4 p-4 bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <X className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Unable to Load Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  This dashboard cannot be embedded due to security restrictions. 
                  Click below to open it directly.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleOpenInSameWindow} className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open Dashboard
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <ArcGISAuthProvider iframeRef={iframeRef} />
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                className="w-full h-full border-0 absolute inset-0"
                title="Dashboard Content"
                allow="fullscreen; allow-same-origin; allow-scripts; allow-forms; allow-popups; allow-popups-to-escape-sandbox; allow-top-navigation-by-user-activation; allow-presentation; allow-modals"
                referrerPolicy="no-referrer-when-downgrade"
                onError={handleIframeError}
                onLoad={(e) => {
                  // Reset error state on successful load
                  setIframeError(false)
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

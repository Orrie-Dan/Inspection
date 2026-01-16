"use client"

import React, { useEffect } from "react"
import { getPortalToken, getPortalUrl } from "@/lib/auth-utils"

/**
 * Component that injects ArcGIS authentication token into iframes
 * This ensures dashboards can access the token without login prompts
 */
export function ArcGISAuthProvider({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const registerToken = () => {
      const token = getPortalToken()
      const portalUrl = getPortalUrl()

      if (!token || !portalUrl) return

      try {
        // Try to access iframe's window (will fail if cross-origin, which is expected)
        const iframeWindow = iframe.contentWindow
        if (!iframeWindow) return

        // Method 1: Inject script to register token with ArcGIS Identity Manager
        const script = iframeWindow.document.createElement('script')
        script.textContent = `
          (function() {
            try {
              // Check if ArcGIS JS API is loaded
              if (window.require) {
                require(['esri/identity/IdentityManager'], function(IdentityManager) {
                  IdentityManager.registerToken({
                    server: '${portalUrl}',
                    token: '${token}'
                  });
                });
              } else {
                // Fallback: Try to set token in global scope
                window.arcgisToken = '${token}';
                window.arcgisPortalUrl = '${portalUrl}';
                
                // Also try to set it when ArcGIS loads
                var checkArcGIS = setInterval(function() {
                  if (window.require) {
                    clearInterval(checkArcGIS);
                    require(['esri/identity/IdentityManager'], function(IdentityManager) {
                      IdentityManager.registerToken({
                        server: '${portalUrl}',
                        token: '${token}'
                      });
                    });
                  }
                }, 100);
                
                // Clear after 10 seconds
                setTimeout(function() {
                  clearInterval(checkArcGIS);
                }, 10000);
              }
            } catch (e) {
              console.debug('ArcGIS token injection:', e);
            }
          })();
        `
        
        // Try to inject into iframe (will fail if cross-origin)
        if (iframeWindow.document && iframeWindow.document.body) {
          iframeWindow.document.body.appendChild(script)
        }
      } catch (error) {
        // Cross-origin restrictions - expected
        console.debug('Cannot inject script into iframe (cross-origin):', error)
      }

      // Method 2: Use postMessage to send token
      try {
        iframeWindow.postMessage({
          type: 'arcgis-set-token',
          token: token,
          portalUrl: portalUrl
        }, '*')
      } catch (error) {
        console.debug('PostMessage token send failed:', error)
      }
    }

    // Register token when iframe loads
    const handleLoad = () => {
      // Wait a bit for the iframe content to initialize
      setTimeout(registerToken, 500)
      setTimeout(registerToken, 1500) // Try again after more time
    }

    iframe.addEventListener('load', handleLoad)

    return () => {
      iframe.removeEventListener('load', handleLoad)
    }
  }, [iframeRef])

  return null
}


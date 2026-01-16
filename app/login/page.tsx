"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, User, Lock, Shield } from "lucide-react"
import { isTokenValid } from "@/lib/auth-utils"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already authenticated
  useEffect(() => {
    if (isTokenValid()) {
      router.push("/")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!username || !password) {
        setError("Please enter both username and password")
        setIsLoading(false)
        return
      }

      // Authenticate with ArcGIS Enterprise Portal via API route
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        // Handle authentication errors
        const errorMessage = data.error?.message || data.error?.code || "Invalid credentials. Please try again."
        setError(errorMessage)
        return
      }

      if (data.token) {
        // Store authentication token and user info
        localStorage.setItem("portalToken", data.token)
        localStorage.setItem("portalUrl", data.portalUrl || "https://gh.space.gov.rw/portal")
        localStorage.setItem("username", username)
        
        // Store token expiration time
        if (data.expires) {
          localStorage.setItem("tokenExpires", data.expires.toString())
        }

        // Store user information if available
        if (data.user) {
          localStorage.setItem("portalUser", JSON.stringify(data.user))
        }

        // Redirect to dashboard
        router.push("/")
      } else {
        setError("Authentication failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 overflow-hidden" style={{ backgroundColor: '#110A44' }}>
      {/* Enhanced Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title with enhanced styling */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative w-20 h-20 mb-5 group">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
            <div className="relative w-20 h-20">
              <Image
                src="/Coat_of_Arms_Rwanda-01.png"
                alt="Rwanda Coat of Arms"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>
          <h1 
            className="text-3xl font-bold mb-4 tracking-tight text-center whitespace-nowrap"
            style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', color: 'white' }}
          >
            Rwanda Construction Inspection Platform
          </h1>
          <p className="text-sm text-center max-w-md leading-relaxed" style={{ color: 'white' }}>
          Revolutionizing construction oversight with AI-driven satellite detection and ArcGIS technology
          </p>
        </div>

        {/* Enhanced Login Card */}
        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle 
              className="text-2xl font-bold text-center"
              style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
            >
              Sign In
            
            </CardTitle>
            <CardDescription className="text-center text-base">
            To access your dashboards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <div className="space-y-2.5">
                <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 pl-4 text-base transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 pl-4 text-base transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold mt-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Shield className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


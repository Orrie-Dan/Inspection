"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  Construction, 
  TrendingUp, 
  DollarSign, 
  FileCheck, 
  ClipboardCheck,
  LogOut
} from "lucide-react"
import { clearAuthData } from "@/lib/auth-utils"
import { getCurrentUserDistrict } from "@/components/user-config"
import { isUrlAllowedForDistrict } from "@/components/district-config"

interface TopNavigationProps {
  onNavClick?: (url: string) => void
}

const navItems = [
  { 
    label: "Detected Constructions", 
    icon: Construction,
    href: "https://gh.space.gov.rw/portal/apps/dashboards/b3e95d36ef1d4b618974da7ee0a2b6df" 
  },
  { 
    label: "Inspection Performance", 
    icon: TrendingUp,
    href: "https://gh.space.gov.rw/portal/apps/dashboards/cec79918f7e4435a82f203acb25af4ca" 
  },
  { 
    label: "Revenue Compliance", 
    icon: DollarSign,
    href: "https://gh.space.gov.rw/portal/apps/dashboards/2fbe0208d1e4410da15ff26609b53e6f" 
  },
  { 
    label: "Permit Compliance", 
    icon: FileCheck,
    href: "https://gh.space.gov.rw/portal/apps/dashboards/3baea36026ac432f854c0e28b65884b4" 
  },
  { 
    label: "Inspection Field Checklist", 
    icon: ClipboardCheck,
    href: "https://survey123.arcgis.com/share/994ae914aafb40008f3f48cf8e10c722?portalUrl=https://gh.space.gov.rw/portal" 
  },
]

export function TopNavigation({ onNavClick }: TopNavigationProps) {
  const router = useRouter()
  const userDistrict = getCurrentUserDistrict()

  const handleLogout = () => {
    // Clear all stored authentication data
    clearAuthData()
    sessionStorage.clear()
    
    // Redirect to login page
    router.push('/login')
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (onNavClick) {
      onNavClick(href)
    }
  }

  // Filter nav items based on user's district
  const filteredNavItems = navItems.filter(item => {
    // If no district, show all (or you can choose to show none)
    if (!userDistrict) return true
    return isUrlAllowedForDistrict(item.href, userDistrict)
  })

  return (
    <nav className="border-b border-border/50 bg-background/98 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 shadow-sm">
      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5">
        {/* Logo and main navigation */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 mb-2 sm:mb-2.5">
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
              <Image
                src="/Coat_of_Arms_Rwanda-01.png"
                alt="Rwanda Coat of Arms"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <span 
              className="text-base sm:text-lg lg:text-xl font-bold text-foreground tracking-tight group-hover:opacity-80 transition-opacity hidden sm:inline-block"
              style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
            >
              Rwanda Construction Inspection Apps
            </span>
            <span 
              className="text-sm font-bold text-foreground tracking-tight group-hover:opacity-80 transition-opacity sm:hidden"
              style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
            >
              Inspection Apps
            </span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            <button
              onClick={handleLogout}
              className="relative flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-destructive transition-all duration-300 tracking-wide px-2 sm:px-2.5 py-1.5 rounded-lg group/logout overflow-hidden"
              style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent opacity-0 group-hover/logout:opacity-100 transition-opacity duration-300 rounded-lg"></span>
              <span className="absolute inset-0 bg-destructive/5 scale-0 group-hover/logout:scale-100 transition-transform duration-300 rounded-lg"></span>
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 group-hover/logout:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline relative z-10">Logout</span>
            </button>
          </div>
        </div>

        {/* Secondary navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 overflow-x-auto scrollbar-hide pb-0.5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 tracking-wide whitespace-nowrap flex-shrink-0 group/nav overflow-hidden cursor-pointer"
                style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
              >
                {/* Animated background */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></span>
                
                {/* Icon with enhanced hover effect */}
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 opacity-70 group-hover/nav:opacity-100 group-hover/nav:scale-110 group-hover/nav:rotate-3 transition-all duration-300" />
                
                {/* Text with slide effect */}
                <span className="relative z-10">
                  <span className="hidden lg:inline group-hover/nav:translate-x-0.5 transition-transform duration-300">
                    {item.label}
                  </span>
                  <span className="lg:hidden group-hover/nav:translate-x-0.5 transition-transform duration-300">
                    {item.label.split(' ').slice(0, 2).join(' ')}
                  </span>
                </span>
                
                {/* Bottom accent line */}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from './dialog'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface NavigationItem {
  name: string
  href: string
}

interface AnnouncementBanner {
  text: string
  linkText: string
  linkHref: string
}

interface CallToAction {
  text: string
  href: string
  variant: 'primary' | 'secondary'
}

interface HeroLandingProps {
  // Logo and branding
  logo?: {
    src: string
    alt: string
    companyName: string
  }
  
  // Navigation
  navigation?: NavigationItem[]
  loginText?: string
  loginHref?: string
  
  // Hero content
  title: string
  description: string
  announcementBanner?: AnnouncementBanner
  callToActions?: CallToAction[]
  
  // Styling options
  titleSize?: 'small' | 'medium' | 'large'
  gradientColors?: {
    from: string
    to: string
  }
  
  // Additional customization
  className?: string
}

const defaultProps: Partial<HeroLandingProps> = {
  logo: undefined,
  navigation: undefined,
  loginText: undefined,
  loginHref: undefined,
  titleSize: "large",
  gradientColors: {
    from: "oklch(0.646 0.222 41.116)",
    to: "oklch(0.488 0.243 264.376)"
  },
  callToActions: [
    { text: "Get started", href: "#how-it-works", variant: "primary" }
  ]
}

export function HeroLanding(props: HeroLandingProps) {
  const {
    logo,
    navigation,
    loginText,
    loginHref,
    title,
    description,
    announcementBanner,
    callToActions,
    titleSize,
    gradientColors,
    className
  } = { ...defaultProps, ...props }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getTitleSizeClasses = () => {
    switch (titleSize) {
      case 'small':
        return 'text-2xl sm:text-3xl md:text-5xl'
      case 'medium':
        return 'text-2xl sm:text-4xl md:text-6xl'
      case 'large':
      default:
        return 'text-3xl sm:text-5xl md:text-7xl'
    }
  }

  const renderCallToAction = (cta: CallToAction, index: number) => {
    const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (cta.href && cta.href.startsWith('#')) {
        e.preventDefault();
        const element = document.getElementById(cta.href.substring(1));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    if (cta.variant === 'primary') {
      return (
        <a
          key={index}
          href={cta.href}
          onClick={handleCtaClick}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white text-black px-10 py-4.5 text-lg font-bold shadow-xl hover:bg-white/95 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 gap-2"
        >
          <span>{cta.text}</span>
          <ChevronRight size={22} className="stroke-[2.5]" />
        </a>
      )
    } else {
      return (
        <a
          key={index}
          href={cta.href}
          onClick={handleCtaClick}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white/10 border border-white/10 hover:bg-white/15 hover:border-white/20 px-10 py-4.5 text-lg font-bold text-white shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
        >
          {cta.text}
        </a>
      )
    }
  }

  return (
    <div className={`min-h-screen w-full overflow-x-hidden relative ${className || ''}`}>
      {/* Header navbar */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 py-6 max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>InsightFlow AI</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/chat" className="bg-[#0f131a] hover:bg-[#151c27] border border-white/10 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md">
            Login
          </a>
          <a href="/chat" className="bg-white text-black hover:bg-white/90 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]">
            Sign Up
          </a>
        </div>
      </header>

      {/* Top gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 min-h-screen"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: `linear-gradient(to top right, ${gradientColors?.from}, ${gradientColors?.to})`
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] min-h-screen"
        />
      </div>
      
      {/* Bottom gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] min-h-screen"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: `linear-gradient(to top right, ${gradientColors?.from}, ${gradientColors?.to})`
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] min-h-screen"
        />
      </div>

      <div className="relative isolate px-6 overflow-hidden min-h-screen flex flex-col justify-center items-center">        
        <div className="hero-glow" />
        <div className="mx-auto max-w-4xl w-full">
          {/* Announcement banner */}
          {announcementBanner && (
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm/6 text-muted-foreground ring-1 ring-border hover:ring-ring transition-all">
                {announcementBanner.text}{' '}
                <a href={announcementBanner.linkHref} className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {announcementBanner.linkText} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <h1 className="saas-heading text-balance text-foreground">
              {title}
            </h1>
            <p className="saas-subtitle text-muted-foreground mt-8 text-pretty">
              {description}
            </p>
            
            {/* Call to action buttons with increased spacing */}
            {callToActions && callToActions.length > 0 && (
              <div className="mt-14 flex items-center justify-center gap-x-6">
                {callToActions.map((cta, index) => renderCallToAction(cta, index))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

// Export types for consumers
export type { HeroLandingProps, NavigationItem, AnnouncementBanner, CallToAction }


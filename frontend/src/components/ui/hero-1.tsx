'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from './dialog'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = 80;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 2.2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Faint animated grid with slow coordinate movement
      const gridOffset = (Date.now() / 120) % 64;
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.055)';
      ctx.lineWidth = 1;
      const gridSize = 64;
      
      for (let x = gridOffset; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = gridOffset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw particles & network connections
      ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-20"
      style={{ opacity: 0.95 }}
    />
  );
}

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
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[#cbd5e1] hover:bg-white text-[#0d0f17] text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] duration-200"
          style={{ paddingLeft: '48px', paddingRight: '48px', paddingTop: '14px', paddingBottom: '14px', boxShadow: '0 0 30px rgba(99, 102, 241, 0.65)' }}
        >
          <span>{cta.text}</span>
        </a>
      )
    } else {
      return (
        <a
          key={index}
          href={cta.href}
          onClick={handleCtaClick}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 hover:border-white/20 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          {cta.text}
        </a>
      )
    }
  }

  return (
    <div className={`min-h-screen w-full overflow-x-hidden relative ${className || ''}`}>
      {/* Header navbar - full width and responsive padding to prevent mobile overflow */}
      <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8 md:px-16 py-6 md:py-8 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 select-none">
          <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8">
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#logo-grad-1)" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#logo-grad-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logo-grad-1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4f46e5" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="logo-grad-2" x1="2" y1="12" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span 
            className="text-lg md:text-2xl font-bold tracking-tight text-[#b4bccc]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            InsightFlow <span className="text-[#4054b2] font-extrabold">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <a href="/chat" className="text-[#9ea2a6] hover:text-white px-3 md:px-5 py-2 text-sm md:text-base font-semibold transition-all duration-200">
            Login
          </a>
          <a href="/chat" className="bg-[#0d0f17] hover:bg-[#151824] border border-white/10 text-white rounded-full text-sm md:text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] duration-200" style={{ paddingLeft: '18px', paddingRight: '18px', paddingTop: '8px', paddingBottom: '8px' }}>
            Sign Up
          </a>
        </div>
      </header>

      {/* Premium Navy-to-Black base gradient wrapper matching the reference image */}
      <div className="absolute inset-0 bg-[#06070b] z-0 overflow-hidden pointer-events-none">
        {/* Soft glowing ambient light sweeps (Left purple, right blue) */}
        <div className="absolute top-[20%] left-[-25%] w-[1000px] h-[800px] rounded-full blur-[80px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[5%] right-[-25%] w-[1100px] h-[900px] rounded-full blur-[90px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 px-6 overflow-hidden min-h-screen flex flex-col justify-center items-center">
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
              <div className="mt-20 flex items-center justify-center gap-x-6">
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


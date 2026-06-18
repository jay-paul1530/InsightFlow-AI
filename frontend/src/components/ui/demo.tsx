'use client';

import React from 'react';
import { HeroLanding } from './hero-1';
import { ScrollProgressBar } from './scroll-progress-bar';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Brain, 
  Database, 
  BarChart3, 
  Sparkles, 
  BookOpen, 
  MessageCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import type { HeroLandingProps } from './hero-1';

export default function Demo() {
  const heroProps: HeroLandingProps = {
    // Centered Hero content
    title: "Transform Your Business with AI-Powered Solutions",
    description: "Revolutionize your workflow with our cutting-edge artificial intelligence platform",
    
    // Styling options
    titleSize: "large",
    gradientColors: {
      from: "oklch(0.7 0.15 280)", // Purple
      to: "oklch(0.6 0.2 320)"    // Magenta
    },
    
    // Additional customization
    className: "min-h-screen",
    callToActions: [
      { text: "Get started", href: "/chat", variant: "primary" }
    ]
  };

  const steps = [
    {
      number: '1',
      title: 'Ask a Question',
      icon: <MessageSquare size={28} />,
      description: 'Type a question about your database using natural language.',
      examples: [
        'Show the top 5 products by revenue',
        'List active customers',
        'Analyze monthly sales trends'
      ]
    },
    {
      number: '2',
      title: 'AI Intent Parsing',
      icon: <Brain size={28} />,
      description: 'SQL Copilot analyzes the request, understands context, and determines target tables.'
    },
    {
      number: '3',
      title: 'SQL Execution',
      icon: <Database size={28} />,
      description: 'The system generates optimized SQL queries and runs them securely against your database.'
    },
    {
      number: '4',
      title: 'Business Insights',
      icon: <BarChart3 size={28} />,
      description: 'Receive structured results, explanations, and visual charts in seconds.'
    }
  ];

  const features = [
    {
      title: 'Natural Language Queries',
      description: 'Interact with your database queries completely in plain English without writing a single line of SQL.',
      icon: <MessageSquare size={24} />
    },
    {
      title: 'Instant Analytics',
      description: 'Generate high-quality business reports, database queries, and metric charts in seconds.',
      icon: <Sparkles size={24} />
    },
    {
      title: 'Schema Understanding',
      description: 'AI automatically interprets columns, complex table schemas, constraints, and relational mappings.',
      icon: <Database size={24} />
    },
    {
      title: 'SQL Explanation',
      description: 'Demystify complex SQL statements and queries with clear, step-by-step plain English explanations.',
      icon: <BookOpen size={24} />
    }
  ];

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // Custom premium ease-out cubic bezier
      },
    },
  };

  return (
    <div className="relative bg-[#080b11] text-[#f9fafb] selection:bg-primary/30 min-h-screen">
      {/* Top scroll progress bar */}
      <ScrollProgressBar type="bar" color="hsl(var(--primary))" strokeSize={3} />

      {/* Hero Section */}
      <HeroLanding {...heroProps} />

      {/* Soft gradient divider */}
      <div className="max-w-[1200px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-[100px] overflow-hidden">
        {/* Soft decorative blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/2 opacity-[0.02] blur-3xl pointer-events-none -z-10" />

        <div className="landing-container relative z-10">
          
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="section-header-centered max-w-3xl mb-16"
          >
            <h2 className="saas-heading bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="saas-subtitle text-muted-foreground mt-6">
              Ask questions in plain English and get database insights in seconds.
            </p>
          </motion.div>

          {/* Workflow Cards Row */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="workflow-grid relative"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="workflow-card group"
              >
                {/* Step badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-sm font-bold flex items-center justify-center text-primary-foreground shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Step Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/5 border border-primary/15 text-primary mb-8 group-hover:bg-primary/10 group-hover:border-primary/25 transition-all duration-300">
                  {step.icon}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-5 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Examples container for step 1 */}
                {step.examples && (
                  <div className="mt-6 w-full bg-black/45 border border-white/[0.02] p-4 rounded-xl text-xs text-muted-foreground font-mono space-y-2.5 shadow-inner">
                    {step.examples.map((ex, eIdx) => (
                      <div key={eIdx} className="flex items-start gap-2">
                        <span className="text-primary font-sans mt-0.5">&bull;</span>
                        <span className="leading-normal">"{ex}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Soft gradient divider */}
      <div className="max-w-[1200px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* Feature Showcase Section */}
      <section className="relative py-[100px] bg-gradient-to-b from-transparent to-[#0a0d16]/30 overflow-hidden">
        <div className="hero-glow" />
        <div className="landing-container relative z-10">

          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="section-header-centered max-w-3xl mb-16"
          >
            <h2 className="saas-heading bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              What Can SQL Copilot Do?
            </h2>
            <p className="saas-subtitle text-muted-foreground mt-6">
               Powerful database analytics and schema-understanding features driven by AI.
            </p>
          </motion.div>

          {/* Responsive Feature Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="feature-grid-2x2"
          >
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="feature-card group"
              >
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-primary mb-8 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-5 group-hover:text-primary transition-colors duration-300">
                  {feat.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Soft gradient divider */}
      <div className="max-w-[1200px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* Dedicated CTA Section */}
      <section className="relative py-[100px] overflow-hidden">
        <div className="landing-container relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto py-24 px-8 sm:px-16 rounded-[2.5rem] border border-white/[0.04] bg-gradient-to-b from-[#0f131a]/50 via-[#0f131a]/25 to-transparent backdrop-blur-md relative overflow-hidden text-center shadow-2xl group"
          >
            {/* Glowing backdrop decorative bubble */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10 group-hover:bg-primary/10 transition-all duration-500" />

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              Ready to Start Querying Smarter?
            </h3>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Use natural language to unlock insights from your database instantly.
            </p>
            
            <a
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-4.5 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
            >
              Launch SQL Copilot <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    setStarted(true);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, started]);

  return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

const features = [
  {
    icon: 'psychology',
    title: 'AI-Powered Segmentation',
    description: 'Auto-segment customers using machine learning. Describe your audience in plain English and let AI build the rules.',
    gradient: 'from-primary to-primary-container',
    iconBg: 'bg-primary',
  },
  {
    icon: 'campaign',
    title: 'Omnichannel Campaigns',
    description: 'WhatsApp, SMS, Email, and RCS — launch personalized campaigns across every channel with a single click.',
    gradient: 'from-secondary to-secondary-container',
    iconBg: 'bg-secondary',
  },
  {
    icon: 'analytics',
    title: 'Real-Time Analytics',
    description: 'Live dashboards with delivery funnels, click-through rates, and revenue attribution. Know what works instantly.',
    gradient: 'from-tertiary to-tertiary-container',
    iconBg: 'bg-tertiary',
  },
  {
    icon: 'auto_awesome',
    title: 'AI Copilot',
    description: 'A natural language assistant that queries your CRM data, drafts messages, and suggests campaign strategies.',
    gradient: 'from-primary-fixed-dim to-tertiary-fixed-dim',
    iconBg: 'bg-primary',
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Campaigns Launched' },
  { value: 2000000, suffix: '+', label: 'Messages Delivered' },
  { value: 98, suffix: '%', label: 'Delivery Rate' },
  { value: 24, suffix: '%', label: 'Revenue Uplift' },
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-y-auto">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-primary">XenoReach</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#stats" className="hover:text-primary transition-colors">Results</a>
            <a href="#cta" className="hover:text-primary transition-colors">Get Started</a>
          </div>
          <Link href="/dashboard">
            <button className="px-6 py-2.5 bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary rounded-full text-sm font-bold shadow-md shadow-primary/20 transition-all hover:scale-105 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              Let's Dive In
            </button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary-fixed/40 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-secondary-fixed/30 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-tertiary-fixed/20 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(var(--grid-color, rgba(21,21,125,0.15)) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color, rgba(21,21,125,0.15)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-success-container/60 border border-success-on-container/20 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-success-on-container animate-pulse" />
            <span className="text-sm font-semibold text-success-on-container">Trusted by 500+ brands across India</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6"
          >
            <span className="text-on-surface">Turn Customer Data</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">Into Revenue</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            AI-powered customer segmentation, campaign automation, and marketing intelligence — all in one platform built for modern brands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <button className="group px-8 py-4 bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary rounded-full text-base font-bold shadow-xl shadow-primary/25 transition-all hover:scale-105 flex items-center gap-3">
                Let's Go
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              </button>
            </Link>
            <button className="px-8 py-4 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-full text-base font-semibold text-on-surface transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">play_circle</span>
              Watch Demo
            </button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 mx-auto max-w-5xl"
          >
            <div className="relative ai-gradient-border rounded-2xl p-1 shadow-2xl shadow-primary/10">
              <div className="rounded-xl bg-surface overflow-hidden border border-outline-variant">
                {/* Mock browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant bg-surface-container-low">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error/60" />
                    <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim/60" />
                    <div className="w-3 h-3 rounded-full bg-success-on-container/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-surface-container rounded-md text-xs text-on-surface-variant font-mono">app.xenoreach.io/dashboard</div>
                  </div>
                </div>
                {/* Mock dashboard */}
                <div className="p-6 space-y-4 bg-background">
                  <div className="grid grid-cols-4 gap-3">
                    {['Total Customers', 'Active Campaigns', 'Messages Sent', 'Avg. CTR'].map((label, i) => (
                      <div key={i} className="bg-surface rounded-xl p-3 border border-outline-variant shadow-sm">
                        <p className="text-label-md text-on-surface-variant uppercase tracking-wider">{label}</p>
                        <p className="text-headline-md font-bold text-on-surface mt-1">{['12,847', '8', '1.2M', '14.2%'][i]}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 bg-surface rounded-xl p-4 border border-outline-variant h-32 shadow-sm">
                      <p className="text-label-md text-on-surface-variant mb-3 uppercase tracking-wider">Campaign Performance</p>
                      <div className="flex items-end gap-1.5 h-16">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-primary/60 to-primary-fixed-dim/60 rounded-sm" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-surface rounded-xl p-4 border border-outline-variant h-32 shadow-sm">
                      <p className="text-label-md text-on-surface-variant mb-3 uppercase tracking-wider">Channels</p>
                      <div className="space-y-2.5">
                        {[{ label: 'WhatsApp', w: '78%', color: 'bg-success-on-container' }, { label: 'SMS', w: '45%', color: 'bg-primary' }, { label: 'Email', w: '62%', color: 'bg-tertiary' }].map((ch, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-label-md text-on-surface-variant mb-0.5">
                              <span>{ch.label}</span>
                              <span className="font-bold">{ch.w}</span>
                            </div>
                            <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${ch.color}`} style={{ width: ch.w }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-tertiary/10 to-secondary/10 rounded-2xl blur-2xl -z-10" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-20"
          >
            <motion.p variants={itemVariants} className="text-label-md font-bold tracking-widest uppercase text-primary mb-4">Features</motion.p>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
              Why XenoReach?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-on-surface-variant max-w-xl mx-auto">
              Everything you need to understand, engage, and retain your customers at scale.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative bg-surface hover:bg-surface-container-low border border-outline-variant hover:border-primary/30 rounded-2xl p-8 transition-all duration-500 shadow-sm hover:shadow-lg hover:shadow-primary/5"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-on-primary text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed text-[15px]">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed/30 via-surface to-surface" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm">
                <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-20"
          >
            <motion.p variants={itemVariants} className="text-label-md font-bold tracking-widest uppercase text-secondary mb-4">How It Works</motion.p>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">
              Three Steps to Growth
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-0"
          >
            {[
              { step: '01', title: 'Import Your Customers', desc: 'Connect your data sources or import customer profiles. XenoReach ingests everything — purchase history, visit frequency, spending patterns.', icon: 'cloud_upload', color: 'bg-primary' },
              { step: '02', title: 'Build Smart Audiences', desc: 'Use AI or rule-based builders to segment customers. "High-value users who haven\'t visited in 30 days" — just type it.', icon: 'target', color: 'bg-secondary' },
              { step: '03', title: 'Launch & Measure', desc: 'Send personalized campaigns across channels and track real-time performance with AI-powered insights.', icon: 'rocket_launch', color: 'bg-tertiary' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex items-start gap-8 py-10 border-b border-outline-variant last:border-0"
              >
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center shadow-md`}>
                  <span className="material-symbols-outlined text-on-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-label-md font-bold text-primary uppercase tracking-widest mb-1">Step {item.step}</p>
                  <h3 className="text-xl font-bold text-on-surface mb-2">{item.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed max-w-lg">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-fixed/40 rounded-full blur-[128px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">Your Marketing?</span>
          </h2>
          <p className="text-lg text-on-surface-variant mb-10 max-w-lg mx-auto">
            Join hundreds of brands already using XenoReach to drive revenue with intelligent customer engagement.
          </p>
          <Link href="/dashboard">
            <button className="group px-10 py-4 bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary rounded-full text-lg font-bold shadow-xl shadow-primary/25 transition-all hover:scale-105 flex items-center gap-3 mx-auto">
              Explore the Platform
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
            </button>
          </Link>
          <p className="text-body-sm text-on-surface-variant mt-4">No credit card required · Free forever for small teams</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant py-12 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <span className="text-lg font-bold text-on-surface">XenoReach</span>
          </div>
          <div className="flex items-center gap-8 text-body-sm text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-body-sm text-on-surface-variant">© 2026 XenoReach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

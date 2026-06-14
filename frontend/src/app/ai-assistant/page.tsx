'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { aiChat } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CHAT_STORAGE_KEY = 'xeno-crm-ai-chat-history';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // store as ISO string for serialization
}

function loadMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch { /* ignore parse errors */ }
  return [];
}

function saveMessages(messages: Message[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch { /* ignore quota errors */ }
}

export default function AICopilotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
    setHydrated(true);
  }, []);

  // Save to localStorage whenever messages change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveMessages(messages);
    }
  }, [messages, hydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  const cleanAIText = (text: string): string => {
    return text
      // Remove <toolcall>...</toolcall> and similar XML blocks
      .replace(/<\/?tool_?call[^>]*>[\s\S]*?<\/tool_?call>/gi, '')
      .replace(/<\/?tool_?call[^>]*>/gi, '')
      .replace(/<\/?function[^>]*>[\s\S]*?<\/function>/gi, '')
      .replace(/<\/?function[^>]*>/gi, '')
      .replace(/<[a-z_]+>[^<]*<\/[a-z_]+>/gi, '')
      // Remove standalone JSON objects
      .replace(/\{"\w+":\s*"[^"]*"\}\s*/g, '')
      // Remove markdown
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^[-•]\s+/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Clean "I'll search the database" preambles
      .replace(/I'?ll\s+(search|look\s+up|query|fetch|find|check)\s+.*?(database|CRM|DB|system).*?\.\s*/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const maxRetries = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const response = await aiChat(userMessage, history);

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cleanAIText(response.data?.reply || response.reply || 'I could not process your request.'),
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        const isRateLimit = status === 429 || error?.message?.includes('429');

        if (isRateLimit && attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, (attempt + 1) * 2000));
          continue;
        }
        break;
      }
    }

    // Build a helpful error message
    let errorText = 'Something went wrong. Please try again in a moment.';
    const status = lastError?.response?.status;
    if (status === 429) {
      errorText = 'The service is temporarily busy. Please wait a few seconds and try again.';
    } else if (status === 500 || status === 502 || status === 503) {
      errorText = 'The AI service is temporarily unavailable. Please try again shortly.';
    } else if (lastError?.code === 'ECONNABORTED' || lastError?.message?.includes('timeout')) {
      errorText = 'The request took too long. Please try a shorter question.';
    }

    const errorMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: errorText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, errorMsg]);
    setIsTyping(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-[calc(100vh-64px)] overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-lg border-b border-outline-variant bg-surface flex items-center justify-between"
      >
        <div>
          <h1 className="text-headline-md font-bold text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Xena
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-xs">Your AI-powered marketing intelligence assistant.</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-xs px-md py-sm text-label-md font-bold text-on-surface-variant hover:text-error bg-surface-container hover:bg-error-container border border-outline-variant rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            Clear Chat
          </button>
        )}
      </motion.div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat / Interaction Area */}
        <div className="flex-1 flex flex-col border-r border-outline-variant bg-background relative">
          <div className="flex-1 overflow-y-auto p-lg space-y-lg custom-scrollbar">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center h-full text-on-surface-variant space-y-md"
                >
                  <span className="material-symbols-outlined text-6xl text-outline mb-sm opacity-50">smart_toy</span>
                  <p className="text-center max-w-md text-on-surface-variant text-body-md">
                    Hi, I'm Xena — your CRM intelligence assistant. How can I help you drive revenue today?
                  </p>
                  <div className="flex gap-sm flex-wrap justify-center mt-md">
                    <button onClick={() => setInput("Who are my top spending customers this month?")} className="px-md py-sm bg-surface hover:bg-surface-container-high border border-outline-variant text-on-surface rounded-lg text-label-md font-bold transition-colors shadow-sm">
                      Find High-Value Customers
                    </button>
                    <button onClick={() => setInput("Draft a WhatsApp re-engagement message for churn risks")} className="px-md py-sm bg-surface hover:bg-surface-container-high border border-outline-variant text-on-surface rounded-lg text-label-md font-bold transition-colors shadow-sm">
                      Draft Re-engagement Campaign
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-md ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container border border-outline-variant text-primary shadow-sm'}`}>
                  {msg.role === 'user' ? <span className="material-symbols-outlined text-sm">person</span> : <span className="material-symbols-outlined text-sm">auto_awesome</span>}
                </div>
                <div className={`px-lg py-md rounded-xl text-body-sm leading-relaxed max-w-2xl shadow-sm ${
                  msg.role === 'user' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-white border border-outline-variant text-on-surface'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-md"
              >
                <div className="w-10 h-10 rounded-lg border bg-surface-container border-outline-variant flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                </div>
                <div className="px-lg py-md text-on-surface-variant text-body-sm flex items-center gap-sm">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Analyzing CRM data...
                  </motion.span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-md border-t border-outline-variant bg-surface">
            <div className="flex gap-sm">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask Xena anything..."
                className="flex-1 px-lg py-md bg-surface-container-low border border-outline-variant rounded-full text-body-md text-on-surface focus:ring-2 focus:ring-secondary-fixed outline-none placeholder:text-on-surface-variant/50"
                disabled={isTyping}
              />
              <button onClick={handleSend} disabled={!input.trim() || isTyping} className="bg-primary text-white w-12 rounded-full flex items-center justify-center disabled:opacity-50 transition-colors shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-96 bg-surface overflow-y-auto hidden lg:block p-lg space-y-lg border-l border-outline-variant custom-scrollbar"
        >
          <motion.h3 variants={itemVariants} className="text-label-md font-bold uppercase tracking-widest text-on-surface-variant mb-md">Intelligence Feed</motion.h3>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary text-sm">analytics</span>
              <h4 className="font-bold text-on-surface text-body-sm">AI Recommendation</h4>
            </div>
            <div className="space-y-sm">
              <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
                <span className="text-label-md text-on-surface-variant">Audience Size</span>
                <span className="text-body-sm font-bold text-on-surface">2,134 customers</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
                <span className="text-label-md text-on-surface-variant">Expected CTR</span>
                <span className="text-body-sm font-bold text-success-on-container">12.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-label-md text-on-surface-variant">Best Channel</span>
                <span className="text-body-sm font-bold text-primary flex items-center gap-xs">
                  WhatsApp
                </span>
              </div>
            </div>
            <Button size="sm" className="w-full mt-md text-label-md" onClick={() => router.push('/campaigns/new')}>Execute Recommendation</Button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-md">
            <div className="bg-white rounded-xl border border-outline-variant p-md text-center cursor-pointer hover:border-primary transition-colors shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-lg mx-auto mb-xs">target</span>
              <h4 className="font-bold text-on-surface text-label-md">Segment Insights</h4>
              <p className="text-[10px] text-on-surface-variant mt-0.5">View audience overlaps</p>
            </div>
            <Link href="/campaigns/new">
              <div className="bg-white rounded-xl border border-outline-variant p-md text-center cursor-pointer hover:border-primary transition-colors shadow-sm">
                <span className="material-symbols-outlined text-secondary text-lg mx-auto mb-xs">campaign</span>
                <h4 className="font-bold text-on-surface text-label-md">Campaign Setup</h4>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Launch suggested</p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-secondary-fixed text-sm">lightbulb</span>
              <h4 className="font-bold text-on-surface text-body-sm">Strategic Insight</h4>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Your "Inactive High Spenders" segment has grown by 15% this week. We recommend sending a personalized retention offer via SMS to prevent churn.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
}


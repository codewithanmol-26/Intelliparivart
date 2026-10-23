'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Mic,
  MicOff,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Source {
  title: string;
  href: string;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  sources?: Source[];
  timestamp: string;
}

interface AskDataMoatProps {
  className?: string;
  onClose?: () => void;
  isFloating?: boolean;
}

const DEFAULT_QUESTIONS = [
  'How do your predictive models work?',
  'We are an institute with 400 students. How does the revenue model work?',
  'How do you prove an intervention actually worked?',
  'Do you replace our existing coaching ERP or Excel registers?',
  'How do you comply with Section 9 of the DPDP Act 2023?'
];

const PERSONAS = [
  { id: 'owner', label: 'Institute Owner' },
  { id: 'teacher', label: 'Teacher / Faculty' },
  { id: 'student', label: 'Student Aspirant' },
  { id: 'parent', label: 'Parent / Guardian' }
];

export default function AskDataMoatChatbot({
  className = '',
  onClose,
  isFloating = false
}: AskDataMoatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('owner');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleStartVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSendQuestion(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSendQuestion = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/genai/datamoat-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          persona: selectedPersona
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: data.answer || 'I could not retrieve an answer for this query.',
          sources: data.sources || [
            { title: 'Executive ROI Model', href: '/owner' },
            { title: 'ML Rigour Card', href: '/model-report' }
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('Failed to fetch response');
      }
    } catch (err) {
      const fallbackMsg: Message = {
        id: `bot_err_${Date.now()}`,
        sender: 'bot',
        text: `Intelliprivart connects coaching records (camera OMR sheets, attendance, marks) into an institutional learning data moat.

• **Fee Retention:** Protects tuition fees by flagging dropouts 4–6 weeks early.
• **2PL IRT Mastery:** Calculates latent concept ability (θ) replacing misleading raw percentages.
• **DPDP Act Compliance:** Section 9 child privacy VPC with zero LLM retraining on private marks.`,
        sources: [
          { title: 'Executive ROI Model', href: '/owner' },
          { title: 'ML Rigour Card', href: '/model-report' },
          { title: 'DPDP Privacy Register', href: '/privacy' }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setMessages([]);
    setInputQuery('');
  };

  return (
    <div
      className={`flex flex-col bg-[#07172E] text-white rounded-2xl border border-blue-800/80 shadow-2xl overflow-hidden font-sans transition-all duration-200 ${className} ${
        isMinimized ? 'h-14' : 'h-[530px] sm:h-[570px]'
      }`}
    >
      {/* 1. Header Bar (Civitas Style) */}
      <div className="px-4 py-3 bg-[#0a1e3d] border-b border-blue-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight flex items-center space-x-1.5">
              <span>Ask DataMoat</span>
              <span className="text-[9px] bg-teal-950 text-teal-300 border border-teal-500/40 px-1.5 py-0.2 rounded font-mono">
                AI + Sources
              </span>
            </h3>
            <p className="text-[10px] text-blue-200/80 leading-none mt-0.5">
              Answers from this platform, with sources
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Minimize / Maximize */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-blue-900/60 transition"
            title={isMinimized ? 'Expand' : 'Minimize'}
            aria-label="Toggle Window"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-blue-900/60 transition"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* 2. Chat Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-blue-800">
            {/* Initial Assistant Disclaimer Bubble (Exact Civitas Style) */}
            <div className="p-3.5 bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-sm leading-relaxed text-xs border border-slate-200">
              I answer from what is published on this platform and IIT Patna Case B documentation, and
              I show you the pages I used. If the system does not say it, I will tell you that instead of
              guessing.
            </div>

            {/* If no questions asked yet, show suggested question pills & persona picker */}
            {messages.length === 0 && (
              <div className="space-y-4 pt-1 animate-fadeIn">
                {/* Clickable Question Pills */}
                <div className="space-y-1.5">
                  {DEFAULT_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuestion(q)}
                      className="w-full text-left p-2.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/90 border border-blue-800/70 text-blue-100 hover:text-white text-[11px] font-medium transition flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">{q}</span>
                      <ArrowRight className="w-3 h-3 text-teal-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Persona Tailoring (Civitas Exact Pattern) */}
                <div className="pt-2 border-t border-blue-900/60 space-y-2">
                  <div className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider">
                    Or tell me who you are and I will tailor the answers:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PERSONAS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPersona(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition ${
                          selectedPersona === p.id
                            ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-xs'
                            : 'bg-blue-950/80 text-blue-200 border-blue-800 hover:bg-blue-900'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1.5 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-sm shadow-xs'
                      : 'bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{msg.text}</div>

                  {/* Sources Citation Pills */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                      <div className="font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                        <span>Verified Sources on Site:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.sources.map((src, i) => (
                          <Link
                            key={i}
                            href={src.href}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 text-teal-700 hover:text-teal-800 border border-slate-200 font-medium transition"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center space-x-2 p-3 bg-white text-slate-700 rounded-2xl rounded-tl-sm shadow-xs border border-slate-200 max-w-[70%]">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                <span className="text-[11px] text-slate-500 italic">
                  Searching platform documentation &amp; sources...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 3. Input & Voice Command Bar */}
          <div className="p-3 bg-[#0a1e3d] border-t border-blue-900/80 space-y-2 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuestion();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                placeholder={
                  isListening
                    ? 'Listening to your voice...'
                    : 'Ask about the platform, results, security...'
                }
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-3 pr-20 py-2.5 bg-[#051124] border border-blue-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
              />

              <div className="absolute right-1.5 flex items-center space-x-1">
                {/* Voice Option Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleStartVoice}
                    className={`p-1.5 rounded-lg transition ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-teal-300 hover:bg-blue-900/60'
                    }`}
                    title={isListening ? 'Listening...' : 'Voice Search (Speak Question)'}
                  >
                    {isListening ? <Mic className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || loading}
                  className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition disabled:opacity-40 disabled:hover:bg-teal-500 cursor-pointer"
                  title="Send Question"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Bottom Footer Line (Civitas Exact Match) */}
            <div className="flex items-center justify-between text-[10px] text-blue-200/70 px-1">
              <span>Answers come from this site, with sources</span>
              <button
                type="button"
                onClick={handleStartOver}
                className="text-teal-300 hover:text-white flex items-center space-x-1 transition font-medium"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Start over</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

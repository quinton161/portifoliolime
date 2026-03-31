import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaTimes, FaVolumeMute, FaVolumeUp, FaCog, FaMicrophone, FaChevronUp } from 'react-icons/fa';
import OpenAI from 'openai';

/**
 * Optional local/cloud assistant API. Set REACT_APP_ASSISTANT_API_URL in production if you host the FastAPI app.
 * On localhost only, defaults to 127.0.0.1:8000 so deployed sites do not spam failed requests to :8000.
 */
function getAssistantApiBase(): string {
  const raw = (process.env.REACT_APP_ASSISTANT_API_URL || process.env.REACT_APP_JARVIS_API_URL || '').trim();
  if (raw) return raw.replace(/\/$/, '');
  if (typeof window === 'undefined') return '';
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return 'http://127.0.0.1:8000';
  return '';
}

// OpenAI Configuration
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "";
const OPENAI_CHAT_MODEL = process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o-mini';
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side integration
});

// ============================================
// COMPREHENSIVE KNOWLEDGE BASE ABOUT QUINTON
// ============================================

const KNOWLEDGE_BASE = {
  personal: {
    name: "Quinton Ndlovu",
    title: "Full Stack Web Developer & Digital Creator",
    location: "Victoria Falls, Zimbabwe",
    email: "quintonndlovu161@gmail.com",
    phone: "+263 785385293",
    whatsapp: "+263 785385293",
    linkedin: "https://www.linkedin.com/in/quinton-ndlovu-40b559341/",
    github: "https://github.com/quinton-dev",
    portfolio: "https://portifoliolime-dz.vercel.app/",
    organization: "Uncommon.org",
    bio: "Full Stack Web Developer based in Victoria Falls, Zimbabwe. Lead Developer at Uncommon.org, shipping high-performance, clean-coded products that move education, commerce, and operations forward.",
    tagline: "I build modern web apps, learning platforms, and automation — from prototype to production.",
    education:
      "Software development and digital strategy through Uncommon.org and continuous hands-on work on real client and internal products.",
    focusAreas: [
      "React / TypeScript product engineering",
      "Education and org tooling at Uncommon",
      "E‑commerce, dashboards, and integrations",
      "Workflow automation (e.g. n8n)",
    ],
    values:
      "Readable architecture, accessible UI, honest timelines, and measurable outcomes for users and stakeholders.",
  },
  
  skills: {
    frontend: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Vue.js", "Framer Motion"],
    backend: ["Node.js", "Python", "PHP", "Express.js", "Firebase", "MongoDB", "MySQL", "PostgreSQL"],
    tools: ["Git", "GitHub", "VS Code", "Figma", "Docker", "AWS", "n8n (Automation)"]
  },
  
  projects: [
    { name: "Uncommon Attendance", description: "Advanced attendance management system for Uncommon.org staff and students.", tech: ["React", "Node.js", "MongoDB", "Express"] },
    { name: "Academy Learning Platform", description: "Comprehensive online education platform with interactive courses.", tech: ["React", "Firebase", "Tailwind"] },
    { name: "Trailer Box", description: "Mobile-first movie trailer discovery application.", tech: ["React Native", "TMDB API"] },
    { name: "Bakers Inn", description: "Full-scale E-commerce solution for a major bakery chain.", tech: ["React", "Node.js", "Stripe"] },
    { name: "Simba Dashboard", description: "Sophisticated business analytics and data visualization dashboard.", tech: ["React", "D3.js", "Recharts"] },
    { name: "TechConnect", description: "Modern technology blog platform with markdown support.", tech: ["Next.js", "Markdown", "Vercel"] },
    { name: "ShopTacle", description: "High-performance e-commerce platform with intuitive UX.", tech: ["React", "Node.js", "Redux"] }
  ],
  
  services: [
    { title: "Full Stack Web Development", description: "End-to-end development of scalable web applications using the latest tech stacks." },
    { title: "UI/UX Design & Implementation", description: "Creating beautiful, user-centric interfaces that provide exceptional digital experiences." },
    { title: "Task Automation & Workflows", description: "Integrating systems like n8n to automate complex business processes and increase efficiency." },
    { title: "Technical Consulting", description: "Helping organizations choose the right technology and architectural path for their digital products." }
  ],
  
  achievements: [
    "Lead Developer at Uncommon.org, driving technological education and employment initiatives.",
    "Built and deployed multiple production-grade applications for regional businesses.",
    "Expertise in bridging the gap between design and high-performance engineering.",
    "Based in the world-renowned Victoria Falls, contributing to the growing tech hub in Zimbabwe."
  ],
  
  interests: ["Photography", "Exploring nature in Victoria Falls", "Traveling", "Learning new tech", "AI/ML", "Music production", "Gaming"],

  personality: [
    "Clear and encouraging (Copilot-style)",
    "Grounded in Quinton's real projects and skills",
    "Suggests sensible next steps",
    "Professional but approachable",
  ],
};

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// ============================================
// CONVERSATION MEMORY & STATE
// ============================================

const loadConversation = (): Message[] => {
  try {
    const saved = localStorage.getItem('jarvis_conversation');
    if (!saved) return [];
    const parsed = JSON.parse(saved) as Array<Omit<Message, 'timestamp'> & { timestamp: string }>;
    return parsed.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return [];
  }
};

function formatMessageTime(ts: Date | string): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d);
}

const saveConversation = (messages: Message[]) => {
  try {
    localStorage.setItem('jarvis_conversation', JSON.stringify(messages.slice(-50)));
  } catch {
    // Ignore storage errors
  }
};

/** Plain text for TTS — avoids robotic reading of markdown/code */
const textForSpeech = (raw: string) =>
  raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Prefer modern en-US neural / natural voices (closer to Copilot cadence) */
function pickNaturalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;
  const rank = (v: SpeechSynthesisVoice) => {
    const n = `${v.name} ${v.lang}`.toLowerCase();
    let s = 0;
    if (/en-us|en_us/.test(n)) s += 38;
    if (/en-gb|en_gb|uk/.test(n)) s += 18;
    if (/neural|natural|premium|online|waveNet/.test(n)) s += 28;
    if (/michelle|jenny|aria|guy|ashley|davis|christopher|steffi|sonia|natasha|andrew|clara|linda|emma|ana|zoe|nancy/.test(n)) s += 18;
    if (/google/.test(n) && !/translate/.test(n)) s += 10;
    if (/microsoft/.test(n) && !/david|mark|zira|irina/.test(n)) s += 10;
    if (/samantha|allison|susan|hazel|uk english female/.test(n)) s += 8;
    return s;
  };
  const sorted = [...voices].filter((v) => v.lang.toLowerCase().startsWith('en')).sort((a, b) => rank(b) - rank(a));
  return sorted[0] || voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0];
}

/** Constructor for browser speech-to-text (Chrome, Edge, Safari). Firefox and many embedded browsers omit it. */
function getSpeechRecognitionCtor(): { new (): any } | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: { new (): any }; webkitSpeechRecognition?: { new (): any } };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/**
 * WebKit (Safari + all iOS browsers) is picky: continuous recognition + interim results often fail or hang.
 * Use short sessions and final-only results.
 */
function preferSpeechFinalOnly(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  if (/safari/i.test(ua) && !/chrome|chromium|crios|fxios|edg|opr|android/i.test(ua)) return true;
  return false;
}

async function getMicStreamWithFallbacks(): Promise<MediaStream> {
  const candidates: MediaStreamConstraints[] = [
    {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    },
    { audio: { echoCancellation: true } },
    { audio: true },
  ];
  let lastErr: unknown;
  for (const constraints of candidates) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function isSecureMicContext(): boolean {
  if (typeof window === 'undefined') return true;
  const h = window.location.hostname;
  return window.isSecureContext || h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
}

// ============================================
// RESPONSE GENERATOR (OPENAI + LOCAL SYNC)
// ============================================

const generateJarvisResponse = async (input: string, history: Message[]): Promise<string> => {
  const lowerInput = input.toLowerCase();
  
  // Master Mode
  if (lowerInput === 'identify as master' || lowerInput === 'i am the owner' || lowerInput === 'master') {
    localStorage.setItem('jarvis_owner', 'true');
    return "Got it — I’ll treat you as Quinton. I’m tuned to your portfolio data and ready when you are. What should we tackle?";
  }

  if (lowerInput === 'logout' || lowerInput === 'clear identity' || lowerInput === 'goodbye master') {
    localStorage.removeItem('jarvis_owner');
    return "Okay — I’ll switch back to guest mode for everyone else. Thanks for stopping by.";
  }

  const isOwner = localStorage.getItem('jarvis_owner') === 'true';
  const dossier = `
WHO YOU REPRESENT (only use when relevant — do not dump this whole list unprompted):
- Name: ${KNOWLEDGE_BASE.personal.name} · ${KNOWLEDGE_BASE.personal.title} · ${KNOWLEDGE_BASE.personal.location}
- Tagline: ${KNOWLEDGE_BASE.personal.tagline}
- Bio: ${KNOWLEDGE_BASE.personal.bio}
- Org: ${KNOWLEDGE_BASE.personal.organization}
- Education / path: ${KNOWLEDGE_BASE.personal.education}
- Focus: ${KNOWLEDGE_BASE.personal.focusAreas.join('; ')}
- Values: ${KNOWLEDGE_BASE.personal.values}
- Contact: ${KNOWLEDGE_BASE.personal.email} · ${KNOWLEDGE_BASE.personal.phone} · WhatsApp ${KNOWLEDGE_BASE.personal.whatsapp}
- Links: Portfolio ${KNOWLEDGE_BASE.personal.portfolio} · LinkedIn ${KNOWLEDGE_BASE.personal.linkedin} · GitHub ${KNOWLEDGE_BASE.personal.github}
- Frontend: ${KNOWLEDGE_BASE.skills.frontend.join(', ')}
- Backend: ${KNOWLEDGE_BASE.skills.backend.join(', ')}
- Tools: ${KNOWLEDGE_BASE.skills.tools.join(', ')}
- Projects: ${KNOWLEDGE_BASE.projects.map((p) => `${p.name}: ${p.description}`).join(' | ')}
- Services: ${KNOWLEDGE_BASE.services.map((s) => s.title).join(', ')}
- Achievements: ${KNOWLEDGE_BASE.achievements.join(' ')}
- Interests: ${KNOWLEDGE_BASE.interests.join(', ')}
`.trim();

  try {
    const systemPrompt = `Your name is Quinton — the on-site AI assistant on this portfolio. Your human creator is Quinton Ndlovu (the developer in the dossier). When greeting or when it fits naturally, you may invite visitors with something like “Want to know about my creator?” and then help them explore his work, story, and contact.

Style: warm, clear, concise, supportive. Short paragraphs. Offer 1–2 sensible next steps when helpful.

You know the creator from the dossier below — ground answers about him ONLY there; if something isn’t listed, say you don’t have that detail. For general-world questions unrelated to him, answer helpfully like a good assistant.

Rules:
- Never open with “As an AI language model.” Don’t over-apologize.
- ${isOwner ? 'The user has signed in as your creator (owner mode). Use a friendly “you” and partner tone.' : 'The user is a guest. Be welcoming and professional.'}
- Prefer plain sentences for voice: no markdown headings, bullets only if short, no code blocks unless they explicitly ask for code.

DOSSIER (about Quinton Ndlovu — your creator):
${dossier}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-12).map(m => ({
        role: m.isUser ? "user" : "assistant",
        content: m.text
      })),
      { role: "user", content: input }
    ];

    const response = await openai.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      max_tokens: 900,
      temperature: 0.8
    });

    return (
      response.choices[0].message.content ||
      "Something glitched on my side — try that again in a second, or ask about Quinton’s projects or contact info."
    );
  } catch (error) {
    console.error("OpenAI Error:", error);
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return `Hi — I’m Quinton, the assistant on this site. Want to know about my creator, Quinton Ndlovu? I can walk you through his projects, skills, and how to reach him — what would you like?`;
    }
    if (lowerInput.includes('quinton') || lowerInput.includes('who are you') || lowerInput.includes('who is he')) {
      return `${KNOWLEDGE_BASE.personal.name} is a ${KNOWLEDGE_BASE.personal.title} in ${KNOWLEDGE_BASE.personal.location}. ${KNOWLEDGE_BASE.personal.bio} ${KNOWLEDGE_BASE.personal.tagline}`;
    }
    if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
      return `Quinton ships with ${KNOWLEDGE_BASE.skills.frontend.slice(0, 4).join(', ')}, and more — plus backend like ${KNOWLEDGE_BASE.skills.backend.slice(0, 4).join(', ')}. Want the full list or project examples?`;
    }

    return "I’m offline from the cloud model right now, but I still know Quinton’s story from local data — try “projects”, “contact”, or “skills”.";
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

type VoiceAssistantProps = { siteReady?: boolean };

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ siteReady = true }) => {
  const assistantApiBase = useMemo(() => getAssistantApiBase(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isJarvisOnline, setIsJarvisOnline] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadConversation);
  /** Off by default — only listens for “Jarvis” when you turn on hands-free in settings (saved in localStorage). */
  const [wakeWordEnabled, setWakeWordEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('quinton_wake_word') === 'true';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [statusText, setStatusText] = useState('Initializing...');
  /** False in Firefox and other browsers without SpeechRecognition; mic/TTS may still work elsewhere. */
  const [voiceToTextSupported, setVoiceToTextSupported] = useState(() =>
    typeof window !== 'undefined' ? !!getSpeechRecognitionCtor() : true
  );
  const [micContextOk] = useState(() =>
    typeof window !== 'undefined' ? isSecureMicContext() : true
  );
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [micReady, setMicReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const isOpenRef = useRef(isOpen);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeWordRecognitionRef = useRef<any>(null);
  /** True while the main (conversation) SpeechRecognition session is active — blocks wake from grabbing the mic. */
  const mainRecActiveRef = useRef(false);
  /** True while push-to-talk / wake flow is starting main recognition — wake's onend must not restart in this gap (Chrome: one session at a time). */
  const mainRecPendingRef = useRef(false);
  const lastWakeTriggerAtRef = useRef(0);
  /** True while handling a user message (commands, API, fallbacks) so wake word does not steal the mic mid-flight. */
  const processingMessageRef = useRef(false);
  const micReadyRef = useRef(false);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    micReadyRef.current = micReady;
  }, [micReady]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    setVoiceToTextSupported(!!getSpeechRecognitionCtor());
  }, []);

  const showToast = useCallback((text: string) => {
    const short = text.length > 160 ? `${text.slice(0, 157)}…` : text;
    setToast(short);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 6500);
  }, []);

  const stopWakeWordListening = useCallback(() => {
    if (wakeWordRecognitionRef.current) {
      try {
        wakeWordRecognitionRef.current.stop();
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!voiceToTextSupported) {
      setWakeWordEnabled(false);
      try {
        localStorage.setItem('quinton_wake_word', 'false');
      } catch {
        /* ignore */
      }
      stopWakeWordListening();
    }
  }, [voiceToTextSupported, stopWakeWordListening]);

  const startWakeWordListening = useCallback(() => {
    if (isOpenRef.current) return;
    if (mainRecPendingRef.current) return;
    if (
      !micReadyRef.current ||
      mainRecActiveRef.current ||
      isSpeakingRef.current ||
      processingMessageRef.current
    ) {
      return;
    }
    if (wakeWordRecognitionRef.current && wakeWordEnabled && voiceToTextSupported) {
      try {
        wakeWordRecognitionRef.current.start();
      } catch {
        // Already started
      }
    }
  }, [wakeWordEnabled, voiceToTextSupported]);

  /** Resume wake word after the conversation recognizer has fully released (Chrome: only one SpeechRecognition at a time). */
  const scheduleWakeResume = useCallback(
    (delayMs: number) => {
      window.setTimeout(() => {
        if (isOpenRef.current || mainRecPendingRef.current) return;
        if (
          wakeWordEnabled &&
          voiceToTextSupported &&
          micReadyRef.current &&
          !mainRecActiveRef.current &&
          !isSpeakingRef.current &&
          !processingMessageRef.current
        ) {
          startWakeWordListening();
        }
      }, delayMs);
    },
    [wakeWordEnabled, voiceToTextSupported, startWakeWordListening]
  );

  // Toggle listening — always stop wake first + delay so wake's onend cannot restart before main .start() (single SR slot in Chrome)
  const startListening = useCallback(() => {
    if (!recognitionRef.current || mainRecActiveRef.current) return;
    if (!getSpeechRecognitionCtor()) {
      showToast('Voice typing needs Chrome, Microsoft Edge, or Safari. Firefox does not support it yet — type your message below.');
      return;
    }
    mainRecPendingRef.current = true;
    stopWakeWordListening();

    const run = (attempt: number) => {
      if (!recognitionRef.current) return;
      try {
        recognitionRef.current.start();
        mainRecActiveRef.current = true;
        setIsListening(true);
        setStatusText('Listening...');
      } catch (e) {
        if (attempt < 6) {
          window.setTimeout(() => run(attempt + 1), 100 + attempt * 100);
        } else {
          console.error('Speech recognition start failed after retries:', e);
          mainRecPendingRef.current = false;
          mainRecActiveRef.current = false;
          setIsListening(false);
          setStatusText('System Ready');
          scheduleWakeResume(300);
        }
      }
    };
    window.setTimeout(() => run(0), 420);
  }, [stopWakeWordListening, scheduleWakeResume, showToast]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      /* not running */
    }
    mainRecActiveRef.current = false;
    setIsListening(false);
  }, []);

  const toggleListening = () => {
    if (isListening || mainRecActiveRef.current) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (isOpen) {
      stopWakeWordListening();
    }
  }, [isOpen, stopWakeWordListening]);

  /** Hands-free wake runs only while chat is closed — when the panel is open, only the mic button controls listening (like typical voice UIs). */
  useEffect(() => {
    if (!micReady || !wakeWordEnabled || isOpen) return;
    const id = window.setTimeout(() => {
      startWakeWordListening();
    }, 400);
    return () => clearTimeout(id);
  }, [micReady, wakeWordEnabled, isOpen, startWakeWordListening]);

  // Text-to-speech: Copilot-like cadence (en-US–biased voice, slightly quicker rate, chunked for long replies)
  const speak = useCallback((text: string) => {
    if (!synthRef.current || isMuted) return;
    try {
      const spoken = textForSpeech(text);
      if (!spoken) return;
      console.log('Assist TTS:', spoken.slice(0, 120) + (spoken.length > 120 ? '…' : ''));
      synthRef.current.cancel();

      const chunks: string[] =
        spoken.length > 260
          ? (spoken.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [spoken]).map((s) => s.trim()).filter(Boolean)
          : [spoken];
      if (!chunks.length) return;

      const applyVoice = (u: SpeechSynthesisUtterance) => {
        u.rate = 1.04;
        u.pitch = 1.0;
        u.volume = 1.0;
        u.lang = 'en-US';
        const voices = synthRef.current?.getVoices() || [];
        const voice = pickNaturalVoice(voices);
        if (voice) {
          u.voice = voice;
          const lang = voice.lang;
          if (lang && /^en/i.test(lang)) u.lang = lang;
        }
      };

      const runQueue = () => {
        let i = 0;
        const next = () => {
          if (!synthRef.current || i >= chunks.length) {
            setIsSpeaking(false);
            scheduleWakeResume(180);
            return;
          }
          const u = new SpeechSynthesisUtterance(chunks[i]);
          applyVoice(u);
          u.onstart = () => {
            if (i === 0) {
              setIsSpeaking(true);
              stopWakeWordListening();
            }
          };
          u.onend = () => {
            i++;
            next();
          };
          u.onerror = () => {
            setIsSpeaking(false);
            scheduleWakeResume(180);
          };
          synthRef.current!.speak(u);
        };
        next();
      };

      if (synthRef.current.getVoices().length === 0) {
        const s = synthRef.current;
        s.onvoiceschanged = () => {
          runQueue();
          s.onvoiceschanged = null;
        };
      } else {
        runQueue();
      }
    } catch (e) {
      console.error('Speech error:', e);
    }
  }, [isMuted, scheduleWakeResume, stopWakeWordListening]);

  // Handle wake word detection
  const handleWakeWordDetected = useCallback(() => {
    mainRecPendingRef.current = true;
    stopWakeWordListening();
    setIsOpen(true);
    
    const isOwner = localStorage.getItem('jarvis_owner') === 'true';

    const ownerLines = [
      "Hey — I'm Quinton. I'm listening — want to hear about my creator or dive into something else?",
      "I'm here. Ask about my creator Quinton Ndlovu, or tell me what you need.",
      "Go ahead — I can talk about my creator's projects, skills, or how to reach him.",
      "Ready when you are — want to know about my creator?",
      "Hey — Quinton here. What should we explore about my creator's work?",
    ];
    const guestLine =
      "Hi — I'm Quinton. Want to know about my creator? He's Quinton Ndlovu — ask me about his projects, skills, or how to reach him.";
    const line = isOwner
      ? ownerLines[Math.floor(Math.random() * ownerLines.length)]
      : guestLine;
    
    // Avoid stacking duplicate wake activations
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && !last.isUser && /listening|i'm here|ready when you|my creator|want to know/i.test(last.text)) {
        return prev;
      }
      const activationMessage: Message = {
        id: Date.now(),
        text: line,
        isUser: false,
        timestamp: new Date()
      };
      return [...prev, activationMessage];
    });

    setStatusText('Listening...');
    
    if (!isMuted) {
      speak(line);
    }

    // Longer delay if TTS plays so the mic does not fight with the speaker or catch the greeting as input
    const listenDelay = isMuted ? 350 : 1200;
    setTimeout(() => {
      startListening();
      inputRef.current?.focus();
    }, listenDelay);
  }, [isMuted, speak, startListening, stopWakeWordListening]);

  // Handle user message
  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    stopListening();

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    let responseText = '';
    setStatusText('Processing...');
    setIsThinking(true);
    processingMessageRef.current = true;

    try {
    // Log for debugging
    console.log('JARVIS: Processing message:', text);

    const isOwner = localStorage.getItem('jarvis_owner') === 'true';

    // 1. Local Navigation & Control Commands first
    if (!responseText) {
      const processWebsiteCommand = (cmd: string): boolean => {
        const lowerCmd = cmd.toLowerCase();
        
        const isAbout = lowerCmd.includes('about') || lowerCmd.includes('who are you') || lowerCmd.includes('who is quinton');
        const isProjects = lowerCmd.includes('project') || lowerCmd.includes('work') || lowerCmd.includes('portfolio');
        const isSkills = lowerCmd.includes('skill') || lowerCmd.includes('tech') || lowerCmd.includes('stack');
        const isContact = lowerCmd.includes('contact') || lowerCmd.includes('touch') || lowerCmd.includes('email');
        const isResume = lowerCmd.includes('resume') || lowerCmd.includes('cv') || lowerCmd.includes('experience');
        const isHome = lowerCmd.includes('home') || lowerCmd.includes('top') || lowerCmd.includes('start');
        
        const isScroll = lowerCmd.includes('scroll to') || lowerCmd.includes('open') || lowerCmd.includes('show') || lowerCmd.includes('view') || lowerCmd.includes('go to');

        if (isAbout && isScroll) {
          const el = document.getElementById('about');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Opening About — scrolling there now.");
            return true;
          }
        }
        
        if (isProjects && isScroll) {
          const el = document.getElementById('projects');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Here are Quinton's projects — scrolling for you.");
            return true;
          }
        }
        
        if (isSkills && isScroll) {
          const el = document.getElementById('skills');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Pulling up skills and stack.");
            return true;
          }
        }
        
        if (isContact && isScroll) {
          const el = document.getElementById('contact');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Opening contact — you can reach out from there.");
            return true;
          }
        }
        
        if (isResume && isScroll) {
          const el = document.getElementById('resume');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Opening the résumé section.");
            return true;
          }
        }

        if (lowerCmd.includes('scroll down')) {
          window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
          speak("Scrolling down a bit.");
          return true;
        }

        if (lowerCmd.includes('scroll up')) {
          window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' });
          speak("Scrolling back up.");
          return true;
        }
        
        if (isHome && isScroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          speak("Back to the top of the page.");
          return true;
        }
        
        if (
          lowerCmd.includes('close jarvis') ||
          lowerCmd.includes('hide jarvis') ||
          lowerCmd.includes('close copilot') ||
          lowerCmd.includes('hide copilot') ||
          lowerCmd.includes('minimize chat')
        ) {
          setIsOpen(false);
          speak("Okay — I'll minimize the assistant.");
          return true;
        }

        if (
          lowerCmd.includes('mute jarvis') ||
          lowerCmd.includes('mute copilot') ||
          lowerCmd.includes('stop talking')
        ) {
          setIsMuted(true);
          speak("Muted — I won't read replies aloud until you turn voice back on.");
          return true;
        }

        if (
          lowerCmd.includes('unmute jarvis') ||
          lowerCmd.includes('unmute copilot') ||
          lowerCmd.includes('voice on')
        ) {
          setIsMuted(false);
          speak("Voice back on — I'll speak replies again.");
          return true;
        }

        return false;
      };

      if (processWebsiteCommand(text)) {
        setStatusText('Command Executed');
        return;
      }
    }

    // 2. Optional FastAPI backend (localhost or REACT_APP_ASSISTANT_API_URL)
    if (!responseText && assistantApiBase) {
      try {
        const response = await fetch(`${assistantApiBase}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: messages.map((m) => ({
              ...m,
              timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
            })),
            user_status: isOwner ? 'Master' : 'Guest',
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (typeof data.response === 'string' && data.response.trim()) {
            responseText = data.response.trim();
            setIsJarvisOnline(true);
          }
        } else {
          setIsJarvisOnline(false);
        }
      } catch (backendError) {
        setIsJarvisOnline(false);
        if (process.env.NODE_ENV === 'development') {
          console.info('[Quinton assistant] API /chat unreachable, using other paths.');
        }
      }
    }

    // 3. OpenAI — optional when REACT_APP_OPENAI_API_KEY is set and backend did not answer
    if (!responseText && OPENAI_API_KEY) {
      try {
        responseText = await generateJarvisResponse(text, messages);
      } catch (e) {
        console.error('JARVIS: OpenAI error:', e);
      }
    }

    // 4. Offline / keyword fallbacks
    if (!responseText) {
      const lowerText = text.toLowerCase().trim();
      
      if (lowerText.includes('hello') || lowerText.includes('hi')) {
        responseText =
          "Hi — I'm Quinton, the assistant here. Want to know about my creator, Quinton Ndlovu? I can share his projects, skills, and contact — what would you like?";
      } else if (lowerText.includes('quinton') || lowerText.includes('who are you') || lowerText.includes('who is he')) {
        responseText = `${KNOWLEDGE_BASE.personal.name} is a ${KNOWLEDGE_BASE.personal.title} based in ${KNOWLEDGE_BASE.personal.location}. ${KNOWLEDGE_BASE.personal.bio}`;
      } else if (lowerText.includes('skill') || lowerText.includes('tech') || lowerText.includes('stack')) {
        responseText = `Quinton is an expert in Frontend (${KNOWLEDGE_BASE.skills.frontend.join(', ')}), Backend (${KNOWLEDGE_BASE.skills.backend.join(', ')}), and Automation tools like ${KNOWLEDGE_BASE.skills.tools.join(', ')}.`;
      } else if (lowerText.includes('project') || lowerText.includes('work') || lowerText.includes('portfolio')) {
        const projectList = KNOWLEDGE_BASE.projects.map(p => p.name).join(', ');
        responseText = `Quinton's key projects include: ${projectList}. He specialized in creating high-performance digital solutions at Uncommon. Which one should I detail?`;
      } else if (lowerText.includes('uncommon')) {
        responseText = "Quinton is a lead developer at Uncommon.org, where he drives technological education and employment initiatives through advanced software solutions.";
      } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('reach')) {
        responseText = `You can reach Quinton via email at ${KNOWLEDGE_BASE.personal.email} or on LinkedIn at ${KNOWLEDGE_BASE.personal.linkedin}. He is based in Victoria Falls.`;
      } else if (lowerText.includes('achievement') || lowerText.includes('accomplishment')) {
        responseText = `Some of Quinton's achievements: ${KNOWLEDGE_BASE.achievements.join(' ')}`;
      } else if (lowerText.includes('interest') || lowerText.includes('hobby')) {
        responseText = `Outside of coding, Quinton enjoys: ${KNOWLEDGE_BASE.interests.join(', ')}.`;
      } else {
        responseText = OPENAI_API_KEY
          ? "I'm afraid that didn't come through cleanly. Could you repeat your question?"
          : "Start your local assistant API for richer answers: in a terminal run `cd jarvis-backend`, `pip install -r requirements.txt`, then `uvicorn main:app --reload --port 8000`. Or add REACT_APP_OPENAI_API_KEY in .env for cloud AI. I can still answer basics about Quinton’s projects, skills, and contact—what would you like?";
      }
    }

    const botMessage: Message = {
      id: Date.now() + 1,
      text: responseText,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setStatusText('System Ready');

    if (!isOpenRef.current && responseText) {
      showToast(responseText);
    }

    if (!isMuted) {
      speak(responseText);
    }
    } finally {
      setIsThinking(false);
      processingMessageRef.current = false;
      scheduleWakeResume(280);
    }
  };

  const handleUserMessageRef = useRef(handleUserMessage);
  handleUserMessageRef.current = handleUserMessage;
  const handleWakeWordDetectedRef = useRef(handleWakeWordDetected);
  handleWakeWordDetectedRef.current = handleWakeWordDetected;
  const speakRef = useRef(speak);
  speakRef.current = speak;
  const scheduleWakeResumeRef = useRef(scheduleWakeResume);
  scheduleWakeResumeRef.current = scheduleWakeResume;
  const startWakeWordListeningRef = useRef(startWakeWordListening);
  startWakeWordListeningRef.current = startWakeWordListening;
  const wakeWordEnabledRef = useRef(wakeWordEnabled);
  wakeWordEnabledRef.current = wakeWordEnabled;
  const voiceToTextSupportedRef = useRef(voiceToTextSupported);
  voiceToTextSupportedRef.current = voiceToTextSupported;

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      if (synthRef.current) {
        synthRef.current.getVoices();
      }
    }
  }, []);

  // Track user interaction for speech unlock
  useEffect(() => {
    const unlockSpeech = () => {
      if (synthRef.current) {
        const test = new SpeechSynthesisUtterance('');
        synthRef.current.speak(test);
      }
    };
    document.addEventListener('click', unlockSpeech, { once: true });
    document.addEventListener('keydown', unlockSpeech, { once: true });
    return () => {
      document.removeEventListener('click', unlockSpeech);
      document.removeEventListener('keydown', unlockSpeech);
    };
  }, []);

  // Optional assistant API — only polled when a base URL exists (localhost dev or env in production)
  useEffect(() => {
    if (!assistantApiBase) {
      setIsJarvisOnline(false);
      return;
    }
    let cancelled = false;
    let devInfoOnce = false;
    const checkBackend = async () => {
      try {
        const response = await fetch(`${assistantApiBase}/status`);
        if (cancelled) return;
        setIsJarvisOnline(response.ok);
      } catch {
        if (cancelled) return;
        setIsJarvisOnline(false);
        if (process.env.NODE_ENV === 'development' && !devInfoOnce) {
          devInfoOnce = true;
          console.info(
            '[Quinton assistant] Optional API not running — chat still works (OpenAI / typed fallbacks).',
            assistantApiBase
          );
        }
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [assistantApiBase]);

  // Initialize speech recognition (Chrome / Edge / Safari only — not Firefox)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!voiceToTextSupported) {
      recognitionRef.current = null;
      wakeWordRecognitionRef.current = null;
      return () => {};
    }

    const SpeechRecognition = getSpeechRecognitionCtor();
    if (!SpeechRecognition) {
      return () => {};
    }

    const webKitish = preferSpeechFinalOnly();
    const wakeRestartDelay = webKitish ? 220 : 100;

    try {
        // Main conversation recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = !webKitish;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let finalText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalText += event.results[i][0].transcript;
            }
          }
          const trimmed = finalText.trim();
          if (trimmed) {
            console.log('JARVIS: Final transcript:', trimmed);
            handleUserMessageRef.current(trimmed);
          }
        };

        recognition.onstart = () => {
          console.log('JARVIS: Recognition started');
          mainRecPendingRef.current = false;
          mainRecActiveRef.current = true;
          setIsListening(true);
          setStatusText('Listening...');
        };

        recognition.onend = () => {
          console.log('JARVIS: Recognition ended');
          mainRecPendingRef.current = false;
          mainRecActiveRef.current = false;
          setIsListening(false);
          scheduleWakeResumeRef.current(320);
        };

        recognition.onerror = (event: any) => {
          const err = event.error as string;
          console.error('JARVIS: Recognition error:', err);
          mainRecPendingRef.current = false;
          mainRecActiveRef.current = false;
          setIsListening(false);

          if (err === 'no-speech' || err === 'aborted') {
            return;
          }

          if (err === 'not-allowed' || err === 'service-not-allowed') {
            if (micReadyRef.current) {
              setStatusText('Mic Blocked');
              speakRef.current('Speech recognition was blocked. Check site permissions for the microphone.');
            } else {
              setStatusText('Tap the mic to enable voice');
            }
            return;
          }

          if (err === 'audio-capture') {
            setStatusText('No Microphone');
            return;
          }

          if (err === 'network') {
            setStatusText('Voice service blocked');
            speakRef.current(
              "I can't reach the browser's speech service — that's separate from this site. Try turning off VPN, relaxing firewall rules, or type your message instead."
            );
            return;
          }

          setStatusText('System Ready');
        };

        recognitionRef.current = recognition;

        // Wake word recognition — continuous mode breaks on Safari/iOS; use short sessions + onend restart
        const wakeWordRec = new SpeechRecognition();
        wakeWordRec.continuous = !webKitish;
        wakeWordRec.interimResults = false;
        wakeWordRec.lang = 'en-US';
        wakeWordRec.maxAlternatives = webKitish ? 1 : 3;

        wakeWordRec.onresult = (event: any) => {
          const results = event.results;
          const transcript = results[results.length - 1][0].transcript.toLowerCase();
          console.log('JARVIS: Wake word check:', transcript);
          
          // Improved wake word detection with higher sensitivity and movie-like triggers
          const triggers = [
            'jarvis', 'travis', 'service', 'driver', 'java', 'harvis', 
            'hey jarvis', 'hi jarvis', 'wake up jarvis', 'hello jarvis',
            'ok jarvis', 'okay jarvis', 'are you there jarvis'
          ];
          const detected = triggers.some(trigger => transcript.includes(trigger));

          if (!detected) return;
          if (mainRecActiveRef.current) return;
          const now = Date.now();
          if (now - lastWakeTriggerAtRef.current < 1600) return;
          lastWakeTriggerAtRef.current = now;
          console.log('JARVIS: Wake word detected:', transcript);
          handleWakeWordDetectedRef.current();
        };

        wakeWordRec.onerror = (event: any) => {
          const err = event.error as string;
          if (err !== 'no-speech' && err !== 'aborted') {
            console.error('JARVIS: Wake word error:', err);
          }
          if (!wakeWordEnabledRef.current) return;
          if (err === 'no-speech' || err === 'aborted') {
            return;
          }
          if (err === 'not-allowed' || err === 'service-not-allowed') {
            if (micReadyRef.current) {
              setStatusText('Mic Blocked');
            }
            return;
          }
          if (err === 'audio-capture') {
            setStatusText('No Microphone');
            return;
          }
          setTimeout(() => {
            if (!voiceToTextSupportedRef.current || !wakeWordEnabledRef.current || !micReadyRef.current) return;
            if (isOpenRef.current || mainRecPendingRef.current) return;
            if (mainRecActiveRef.current || isListeningRef.current || processingMessageRef.current) return;
            startWakeWordListeningRef.current();
          }, 500);
        };

        wakeWordRec.onend = () => {
          if (!voiceToTextSupportedRef.current || !wakeWordEnabledRef.current || !micReadyRef.current) return;
          if (isOpenRef.current || mainRecPendingRef.current) return;
          if (
            mainRecActiveRef.current ||
            isSpeakingRef.current ||
            isListeningRef.current ||
            processingMessageRef.current
          ) {
            return;
          }
          window.setTimeout(() => startWakeWordListeningRef.current(), wakeRestartDelay);
        };

        wakeWordRecognitionRef.current = wakeWordRec;
    } catch (e) {
      console.error('Speech recognition setup failed:', e);
    }

    return () => {
      if (wakeWordRecognitionRef.current) {
        try { wakeWordRecognitionRef.current.stop(); } catch {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [voiceToTextSupported]);

  // Auto-scroll to messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save conversation
  useEffect(() => {
    saveConversation(messages);
  }, [messages]);

  const hasGreetedRef = useRef(false);
  const autoMinimizeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (autoMinimizeRef.current) clearTimeout(autoMinimizeRef.current);
    };
  }, []);

  // After splash: first visit gets greeting + panel; returning visitors keep saved chat and the dock
  useEffect(() => {
    if (!siteReady || hasGreetedRef.current) return;

    const timer = setTimeout(() => {
      if (hasGreetedRef.current) return;
      hasGreetedRef.current = true;

      const isOwner = localStorage.getItem('jarvis_owner') === 'true';
      const gestureHint =
        ' To use your voice, tap the microphone once—browsers only turn on the mic after you interact.';
      const greeting = isOwner
        ? `Hey — I'm Quinton, your site assistant. Want to know about my creator? That's you — or we can prep anything for visitors. Chat here, tap the mic to talk, or enable hands-free "Jarvis" in settings.${gestureHint}`
        : `Hi — I'm Quinton. Want to know about my creator, Quinton Ndlovu? Type or tap the mic to talk. Optional: turn on hands-free "Jarvis" in settings when the panel is closed.${gestureHint}`;

      const prior = loadConversation();
      if (prior.length === 0) {
        setMessages([{ id: Date.now(), text: greeting, isUser: false, timestamp: new Date() }]);
        setIsOpen(true);
        setStatusText('Tap the mic to enable voice');
        if (!isMuted) speak(greeting);
        if (autoMinimizeRef.current) clearTimeout(autoMinimizeRef.current);
        autoMinimizeRef.current = setTimeout(() => setIsOpen(false), 12000);
      } else {
        setStatusText('Tap the mic to enable voice');
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteReady]);

  // Toggle wake word (optional always-on “Jarvis” listening — default off)
  const toggleWakeWord = () => {
    if (!voiceToTextSupported) {
      showToast('Hands-free “Jarvis” needs Chrome, Microsoft Edge, or Safari — not Firefox yet.');
      return;
    }
    const newState = !wakeWordEnabled;
    setWakeWordEnabled(newState);
    try {
      localStorage.setItem('quinton_wake_word', newState ? 'true' : 'false');
    } catch {
      /* ignore */
    }
    if (newState) {
      setStatusText('Wake Word Active');
      speak('Hands-free is on — say Jarvis anytime. Turn it off in settings to only use the mic button.');
      if (micReady) {
        window.setTimeout(() => startWakeWordListening(), 200);
      }
    } else {
      stopWakeWordListening();
      setStatusText('System Ready');
      speak('Hands-free is off — tap the mic when you want to speak.');
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('jarvis_conversation');
    speak("Conversation cleared.");
  };

  const renderIcon = (Icon: any, size: number) => {
    return React.createElement(Icon, { size }) as React.ReactElement;
  };

  const startAudioVisualizer = useCallback(async () => {
    try {
      if (audioContextRef.current) return;

      const stream = streamRef.current;
      if (!stream || stream.getTracks().every((t) => t.readyState === 'ended')) {
        return;
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setAudioLevel(average); // 0 to 255
        
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };

      updateVisualizer();
    } catch (err) {
      console.error("Visualizer Error:", err);
    }
  }, []);

  const stopAudioVisualizer = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        /* ignore */
      }
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    animationFrameRef.current = null;
    setAudioLevel(0);
  }, []);

  const requestMicPermission = async (opts?: { startListeningAfter?: boolean }) => {
    console.log('JARVIS: requestMicPermission called');

    const existing = streamRef.current;
    if (existing && existing.getTracks().some((t) => t.readyState === 'live')) {
      micReadyRef.current = true;
      setMicReady(true);
      setStatusText('System Ready');
      if (wakeWordEnabled) {
        startWakeWordListening();
      }
      void startAudioVisualizer();
      if (opts?.startListeningAfter) {
        setTimeout(() => startListening(), 380);
      }
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      console.error('JARVIS: getUserMedia not available');
      speak("Microphone is not available. Use HTTPS or localhost, and a modern browser.");
      setStatusText('Browser Not Supported');
      return;
    }

    // Note: enumerateDevices() often lists 0 audio inputs or empty labels until *after*
    // getUserMedia succeeds — do not use it to decide if a mic exists.
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const n = devices.filter((d) => d.kind === 'audioinput').length;
      console.log('JARVIS: enumerateDevices audio inputs (may be 0 before permission):', n);
    } catch (enumErr) {
      console.warn('JARVIS: enumerateDevices:', enumErr);
    }

    // Request access — this is the reliable check for a real microphone
    try {            
      console.log('JARVIS: Requesting microphone access...');
      const stream = await getMicStreamWithFallbacks();
      console.log('JARVIS: Microphone access granted! Stream ID:', stream.id);
      
      streamRef.current = stream;
      micReadyRef.current = true;
      setMicReady(true);
      speak(
        wakeWordEnabled
          ? "Mic on — I'm Quinton. Say Jarvis for hands-free, or tap the mic to talk."
          : "Mic on — I'm Quinton. Tap the mic when you want to speak."
      );
      setStatusText('System Ready');
      if (wakeWordEnabled) {
        startWakeWordListening();
      }
      void startAudioVisualizer();
      if (opts?.startListeningAfter) {
        setTimeout(() => startListening(), 380);
      }
    } catch (err: any) {
      console.error('JARVIS: Mic Permission Error:', err);
      console.error('JARVIS: Error name:', err.name);
      console.error('JARVIS: Error message:', err.message);

      micReadyRef.current = false;
      setMicReady(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatusText('Mic Blocked');
        speak("Microphone access denied. Please click the lock icon in your browser address bar and allow microphone access.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setStatusText('No Microphone');
        speak('No microphone was found. Plug in a mic, enable it in Windows sound settings, and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setStatusText('Mic In Use');
        speak("Microphone is in use by another application. Please close other apps using the microphone.");
      } else if (err.name === 'SecurityError' || err.name === 'NotSupportedError') {
        setStatusText('Mic Error');
        speak('Microphone needs a secure context. Open the site at http://localhost:3000 or https, not as a raw file path.');
      } else {
        setStatusText('Mic Error');
        speak(`Unable to access microphone: ${err.message || err.name || 'unknown error'}.`);
      }
    }
  };

  useEffect(() => {
    const wantVisualizer =
      micReady && (wakeWordEnabled || (isOpen && (isListening || isSpeaking)));
    if (wantVisualizer) {
      startAudioVisualizer();
    } else {
      stopAudioVisualizer();
    }
    return () => stopAudioVisualizer();
  }, [isOpen, isListening, isSpeaking, wakeWordEnabled, micReady, startAudioVisualizer, stopAudioVisualizer]);

  const micNeedsHelp = ['Mic Blocked', 'Mic Error', 'No Microphone', 'Mic In Use'].includes(statusText);

  const statusLabel =
    !voiceToTextSupported
      ? 'This browser has no speech-to-text API — use Chrome, Edge, or Safari for voice, or type below'
      : !micContextOk
        ? 'Microphone needs HTTPS (or localhost) — open the deployed site URL, not a raw file path'
        : micNeedsHelp
          ? 'Microphone blocked — use the button below or the lock icon in the address bar'
          : !micReady
            ? 'Voice is off until you tap the microphone once (browser privacy)'
            : isListening
              ? 'Listening…'
              : isThinking
                ? 'Thinking…'
                : isSpeaking
                  ? 'Speaking…'
                  : statusText === 'System Ready'
                    ? voiceToTextSupported && wakeWordEnabled
                      ? 'Ready — type, tap the mic, or say Jarvis (hands-free on)'
                      : 'Ready — type or tap the mic to speak'
                    : statusText;

  const needsMicTap = voiceToTextSupported && !micReady && !micNeedsHelp;

  const dockActive = voiceToTextSupported && wakeWordEnabled && micReady && !isSpeaking;

  return (
    <>
      {toast && !isOpen && (
        <div
          className="fixed bottom-24 left-4 right-4 z-[95] mx-auto max-w-md sm:left-auto sm:right-6 sm:mx-0"
          role="status"
        >
          <div className="rounded-[1.25rem] border border-gray-100 bg-white px-4 py-3 text-sm leading-snug text-[#1D1D1F] shadow-xl shadow-gray-200/50">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
              Quinton
            </span>
            {toast}
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-end sm:left-auto sm:right-6 sm:w-auto pointer-events-none">
          <div className="pointer-events-auto flex w-full max-w-md items-stretch gap-0 overflow-hidden rounded-[1.25rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/50 sm:max-w-sm">
            <button
              type="button"
              onClick={() => {
                if (autoMinimizeRef.current) {
                  clearTimeout(autoMinimizeRef.current);
                  autoMinimizeRef.current = null;
                }
                setIsOpen(true);
              }}
              className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[#F5F5F7]"
              aria-label="Open assistant chat"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1D1D1F] text-white shadow-lg shadow-black/10">
                <span
                  className={`absolute inset-0 rounded-2xl ${dockActive ? 'animate-pulse bg-white/10' : ''}`}
                  aria-hidden
                />
                {renderIcon(FaMicrophone, 18)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold tracking-tight text-[#1D1D1F]">
                  Quinton
                </span>
                <span className="mt-0.5 block truncate text-xs text-gray-500">
                  {isSpeaking
                    ? 'Speaking…'
                    : isListening
                      ? 'Listening…'
                      : !voiceToTextSupported
                        ? 'Voice typing: use Chrome, Edge, or Safari — chat works in any browser'
                        : dockActive
                        ? 'Hands-free on — say Jarvis, or open chat and tap the mic'
                        : wakeWordEnabled
                          ? 'Tap the mic once, then talk or say Jarvis'
                          : 'Tap the mic to speak — hands-free off (enable in chat settings)'}
                </span>
              </span>
              <span className="self-center pr-2 text-gray-400">{renderIcon(FaChevronUp, 14)}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (autoMinimizeRef.current) {
                  clearTimeout(autoMinimizeRef.current);
                  autoMinimizeRef.current = null;
                }
                setIsOpen(true);
                void requestMicPermission({
                  startListeningAfter: voiceToTextSupported,
                });
              }}
              className={`flex w-14 shrink-0 items-center justify-center border-l border-gray-100 transition hover:bg-[#F5F5F7] ${isListening ? 'bg-red-500 text-white hover:bg-red-600': needsMicTap ? 'bg-emerald-500/15 text-emerald-800' : 'text-[#1D1D1F]'}`}
              aria-label={
                !voiceToTextSupported
                  ? 'Microphone (optional)'
                  : needsMicTap
                    ? 'Enable microphone'
                    : 'Start voice input'
              }
            >
              {renderIcon(FaMicrophone, 18)}
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] pointer-events-none font-sans antialiased">
          <div
            className="absolute inset-0 bg-[#1D1D1F]/40 backdrop-blur-sm pointer-events-auto transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />

          <div
            className="absolute bottom-4 left-4 right-4 top-auto flex max-h-[min(90vh,720px)] min-h-[420px] flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-2xl shadow-gray-300/60 sm:left-auto sm:right-6 sm:w-[420px] pointer-events-auto"
            role="dialog"
            aria-labelledby="assistant-title"
            aria-describedby="assistant-subtitle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex shrink-0 flex-col gap-0.5 border-b border-gray-100 bg-white px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">Chat</p>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 id="assistant-title" className="truncate text-lg font-bold tracking-tight text-[#1D1D1F]">
                      Quinton
                    </h2>
                    <span
                      className={`inline-flex h-2 w-2 shrink-0 rounded-full ring-4 ring-white ${voiceToTextSupported && wakeWordEnabled && micReady ? 'bg-emerald-500 animate-pulse' : isJarvisOnline ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      title={
                        voiceToTextSupported && micReady
                          ? wakeWordEnabled
                            ? 'Hands-free listening'
                            : 'Mic ready'
                          : isJarvisOnline
                            ? 'Local knowledge API online'
                            : 'Browser-only mode'
                      }
                    />
                  </div>
                  <p id="assistant-subtitle" className="mt-0.5 text-xs text-gray-500">
                    {statusLabel}
                  </p>
                </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowSettings((s) => !s)}
                  className="rounded-full p-2 text-gray-500 transition hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                  aria-label="Assistant settings"
                >
                  {renderIcon(FaCog, 16)}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-gray-500 transition hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                  aria-label="Close assistant"
                >
                  {renderIcon(FaTimes, 16)}
                </button>
              </div>
              </div>

              {showSettings && (
                <div className="absolute right-3 top-[52px] z-10 w-[min(calc(100vw-2rem),280px)] rounded-xl border border-black/5 bg-white p-4 shadow-xl">
                  <p className="mb-3 text-xs font-medium text-neutral-900">Settings</p>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-neutral-600">Hands-free &quot;Jarvis&quot;</span>
                      <button
                        type="button"
                        onClick={toggleWakeWord}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${wakeWordEnabled ? 'bg-black' : 'bg-neutral-200'}`}
                        aria-pressed={wakeWordEnabled}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${wakeWordEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>
                      <p className="text-[10px] text-neutral-500">
                        {voiceToTextSupported
                          ? 'Off by default — when on, listens for “Jarvis” in the background. Otherwise tap the mic to talk.'
                          : 'Unavailable — browser has no speech recognition API.'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-neutral-600">Spoken replies</span>
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="rounded-full p-2 text-neutral-600 transition hover:bg-neutral-100"
                        aria-pressed={!isMuted}
                      >
                        {isMuted ? renderIcon(FaVolumeMute, 18) : renderIcon(FaVolumeUp, 18)}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={clearConversation}
                      className="w-full rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
                     >
                      Clear chat
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!voiceToTextSupported && (
              <div className="border-b border-sky-100 bg-sky-50/95 px-4 py-2.5">
                <p className="text-[11px] leading-snug text-sky-950">
                  <span className="font-semibold">Browser note: </span>
                  Firefox and some browsers do not ship speech-to-text. For voice (mic + “Jarvis”), use{' '}
                  <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Safari</strong>. You can still use
                  this chat and read-aloud everywhere.
                </p>
              </div>
            )}

            {!micContextOk && (
              <div className="border-b border-amber-100 bg-amber-50 px-4 py-2.5">
                <p className="text-[11px] leading-snug text-amber-950">
                  Microphone access needs a <strong>secure page</strong>. Open your published <strong>HTTPS</strong>{' '}
                  URL (e.g. Vercel) or <strong>localhost</strong>, not a downloaded HTML file.
                </p>
              </div>
            )}

            {needsMicTap && (
              <div className="border-b border-emerald-200/90 bg-gradient-to-r from-emerald-50/95 to-cyan-50/80 px-4 py-3">
                <p className="text-xs font-medium text-emerald-950">
                  Turn on voice (wake word & spoken replies). Your browser only allows the mic after you tap.
                </p>
                <button
                  type="button"
                  onClick={() => void requestMicPermission({ startListeningAfter: voiceToTextSupported })}
                  className="mt-2 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Enable microphone
                </button>
              </div>
            )}

            {micNeedsHelp && (
              <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-3">
                <p className="text-xs text-amber-900">
                  Microphone was blocked or unavailable. Allow access in your browser, then try again.{' '}
                  <button
                    type="button"
                    onClick={() => void requestMicPermission({ startListeningAfter: voiceToTextSupported })}
                    className="font-semibold underline decoration-amber-700/50 underline-offset-2 hover:decoration-amber-900"
                  >
                    Retry microphone
                  </button>
                </p>
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col bg-[#F5F5F7]">
              <div className="min-h-[200px] flex-1 overflow-y-auto px-4 py-4">
                <div className="mx-auto max-w-full space-y-4">
                  {messages.length === 0 && !isThinking && (
                    <p className="rounded-2xl border border-dashed border-gray-200 bg-white/80 px-4 py-6 text-center text-sm text-gray-500">
                      Start a conversation — ask about my creator or projects. Tap the <span className="font-semibold text-[#1D1D1F]">mic</span> to speak; enable hands-free &quot;Jarvis&quot; in settings if you want.
                    </p>
                  )}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${m.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {!m.isUser && (
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D1D1F] text-[11px] font-bold text-white shadow-md shadow-black/10"
                          aria-hidden
                        >
                          Q
                        </div>
                      )}
                      <div className={`max-w-[min(100%,280px)] space-y-1 ${m.isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            m.isUser
                              ? 'rounded-tr-sm bg-[#1D1D1F] text-white shadow-lg shadow-black/15'
                              : 'rounded-tl-sm border border-gray-100 bg-white text-[#1D1D1F] shadow-sm'
                          }`}
                        >
                          {m.text}
                        </div>
                        <p
                          className={`px-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 ${m.isUser ? 'text-right' : 'text-left'}`}
                        >
                          {formatMessageTime(m.timestamp)}
                        </p>
                      </div>
                      {m.isUser && (
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-[#1D1D1F]"
                          aria-hidden
                        >
                          You
                        </div>
                      )}
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex gap-2.5">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D1D1F] text-[11px] font-bold text-white"
                        aria-hidden
                      >
                        Q
                      </div>
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 bg-white px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!micReady || micNeedsHelp) {
                      void requestMicPermission({ startListeningAfter: voiceToTextSupported });
                      return;
                    }
                    toggleListening();
                  }}
                  className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                    isListening
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                      : needsMicTap || micNeedsHelp
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700'
                        : 'bg-[#1D1D1F] text-white shadow-md shadow-black/15 hover:bg-black'
                  }`}
                  aria-pressed={isListening}
                  aria-label={
                    !micReady || micNeedsHelp ? 'Enable microphone' : isListening ? 'Stop listening' : 'Start listening'
                  }
                >
                  {(isListening || isSpeaking) && (
                    <span
                      className="absolute inset-0 rounded-2xl opacity-25"
                      style={{
                        transform: `scale(${1 + audioLevel / 400})`,
                        background: isListening ? 'currentColor' : 'transparent',
                      }}
                    />
                  )}
                  <span className="relative z-[1] text-base leading-none text-current">{renderIcon(FaMicrophone, 16)}</span>
                </button>
                <p className="min-w-0 flex-1 text-xs leading-snug text-gray-500">
                  {micNeedsHelp
                    ? 'Allow the mic in the browser, or type your message below.'
                    : needsMicTap
                      ? 'Tap the green mic so the browser can hear you.'
                      : isListening
                        ? 'Listening… you can also type.'
                        : 'Voice or type — your message goes below.'}
                </p>
              </div>

              <div className="shrink-0 space-y-3 border-t border-gray-100 bg-white px-4 pb-4 pt-3">
                <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {['About', 'Projects', 'Skills', 'Contact'].map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => handleUserMessage(`Open ${cmd}`)}
                      className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#1D1D1F] transition hover:border-black hover:bg-[#F5F5F7]"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = (e.currentTarget.elements.namedItem('hud-input') as HTMLInputElement).value;
                    if (input.trim()) {
                      handleUserMessage(input.trim());
                      (e.currentTarget.elements.namedItem('hud-input') as HTMLInputElement).value = '';
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    name="hud-input"
                    type="text"
                    autoComplete="off"
                    placeholder="Message Quinton…"
                    className="min-w-0 flex-1 rounded-2xl border-2 border-transparent bg-[#F5F5F7] px-5 py-3.5 text-sm font-medium text-[#1D1D1F] placeholder:text-gray-400 transition focus:border-black focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;

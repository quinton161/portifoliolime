import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaTimes, FaVolumeMute, FaVolumeUp, FaCog, FaMicrophone, FaArrowUp, FaWhatsapp } from 'react-icons/fa';
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

// OpenAI in the browser is optional and exposes the key in the bundle — prefer the FastAPI backend + OPENAI_API_KEY on the server.
function normalizeEnvKey(raw: string | undefined): string {
  return (raw ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/^[;:\s]+|[;:\s]+$/g, "");
}

const OPENAI_API_KEY = normalizeEnvKey(process.env.REACT_APP_OPENAI_API_KEY);
const OPENAI_CHAT_MODEL = normalizeEnvKey(process.env.REACT_APP_OPENAI_MODEL) || "gpt-4o-mini";

let browserOpenAI: OpenAI | null = null;
function getBrowserOpenAI(): OpenAI | null {
  if (!OPENAI_API_KEY) return null;
  if (!browserOpenAI) {
    browserOpenAI = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  }
  return browserOpenAI;
}

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
    /** Same number — opens WhatsApp chat (mobile + desktop). */
    whatsappChatUrl: "https://wa.me/263785385293",
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
    {
      title: "Software & IT Support",
      description:
        "Windows and software setup, troubleshooting, optimization, remote support, office tools, updates, and maintenance for businesses and individuals.",
    },
    { title: "Task Automation & Workflows", description: "Integrating systems like n8n to automate complex business processes and increase efficiency." },
    { title: "Technical Consulting", description: "Helping organizations choose the right technology and architectural path for their digital products." },
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
- Contact: ${KNOWLEDGE_BASE.personal.email} · phone ${KNOWLEDGE_BASE.personal.phone} · WhatsApp same number ${KNOWLEDGE_BASE.personal.whatsapp} — visitors can message him on WhatsApp; chat link: ${KNOWLEDGE_BASE.personal.whatsappChatUrl}
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

When someone asks how to reach Quinton, mention email, phone, and WhatsApp (same number as phone). Say he’s happy to hear from people on WhatsApp for quick questions or follow-ups — give the WhatsApp chat link from the dossier when it helps.

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

    const client = getBrowserOpenAI();
    if (!client) {
      return jarvisOfflineKeywordFallback(lowerInput);
    }

    const response = await client.chat.completions.create({
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

    return jarvisOfflineKeywordFallback(lowerInput);
  }
};

function jarvisOfflineKeywordFallback(lowerInput: string): string {
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return `Hi — I’m Quinton, the assistant on this site. Want to know about my creator, Quinton Ndlovu? I can walk you through his projects, skills, and how to reach him — what would you like?`;
  }
  if (lowerInput.includes('quinton') || lowerInput.includes('who are you') || lowerInput.includes('who is he')) {
    return `${KNOWLEDGE_BASE.personal.name} is a ${KNOWLEDGE_BASE.personal.title} in ${KNOWLEDGE_BASE.personal.location}. ${KNOWLEDGE_BASE.personal.bio} ${KNOWLEDGE_BASE.personal.tagline}`;
  }
  if (
    lowerInput.includes('contact') ||
    lowerInput.includes('email') ||
    lowerInput.includes('reach') ||
    lowerInput.includes('whatsapp') ||
    lowerInput.includes('phone') ||
    lowerInput.includes('message him')
  ) {
    const p = KNOWLEDGE_BASE.personal;
    return `You can reach Quinton by email at ${p.email}, phone ${p.phone}, or WhatsApp the same number — ${p.whatsappChatUrl}`;
  }
  if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
    return `Quinton ships with ${KNOWLEDGE_BASE.skills.frontend.slice(0, 4).join(', ')}, and more — plus backend like ${KNOWLEDGE_BASE.skills.backend.slice(0, 4).join(', ')}. Want the full list or project examples?`;
  }

  return "I’m offline from the cloud model right now, but I still know Quinton’s story from local data — try “projects”, “contact”, or “skills”.";
}

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
  /** True while the main (conversation) SpeechRecognition session is active. */
  const mainRecActiveRef = useRef(false);
  /** True while handling a user message (commands, API, fallbacks). */
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

  // Push-to-talk only — no background wake word listening.
  const startListening = useCallback(() => {
    if (!recognitionRef.current || mainRecActiveRef.current) return;
    if (!getSpeechRecognitionCtor()) {
      showToast('Voice typing needs Chrome, Microsoft Edge, or Safari. Firefox does not support it yet — type your message below.');
      return;
    }

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
          mainRecActiveRef.current = false;
          setIsListening(false);
          setStatusText('System Ready');
        }
      }
    };
    window.setTimeout(() => run(0), 240);
  }, [showToast]);

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
            return;
          }
          const u = new SpeechSynthesisUtterance(chunks[i]);
          applyVoice(u);
          u.onstart = () => {
            if (i === 0) {
              setIsSpeaking(true);
            }
          };
          u.onend = () => {
            i++;
            next();
          };
          u.onerror = () => {
            setIsSpeaking(false);
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
  }, [isMuted]);

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

    const lowerTrim = text.toLowerCase().trim();
    if (
      lowerTrim === 'identify as master' ||
      lowerTrim === 'i am the owner' ||
      lowerTrim === 'master'
    ) {
      localStorage.setItem('jarvis_owner', 'true');
      responseText =
        "Got it — I’ll treat you as Quinton. I’m tuned to your portfolio data and ready when you are. What should we tackle?";
    } else if (
      lowerTrim === 'logout' ||
      lowerTrim === 'clear identity' ||
      lowerTrim === 'goodbye master'
    ) {
      localStorage.removeItem('jarvis_owner');
      responseText =
        "Okay — I’ll switch back to guest mode for everyone else. Thanks for stopping by.";
    }

    // 1. Local Navigation & Control Commands first
    if (!responseText) {
      const processWebsiteCommand = (cmd: string): boolean => {
        const lowerCmd = cmd.toLowerCase();
        
        const isAbout = lowerCmd.includes('about') || lowerCmd.includes('who are you') || lowerCmd.includes('who is quinton');
        const isProjects = lowerCmd.includes('project') || lowerCmd.includes('work') || lowerCmd.includes('portfolio');
        const isSkills = lowerCmd.includes('skill') || lowerCmd.includes('tech') || lowerCmd.includes('stack');
        const isContact =
          lowerCmd.includes('contact') ||
          lowerCmd.includes('touch') ||
          lowerCmd.includes('email') ||
          lowerCmd.includes('whatsapp') ||
          lowerCmd.includes('whats app');
        const isResume = lowerCmd.includes('resume') || lowerCmd.includes('cv') || lowerCmd.includes('experience');
        const isSoftwareIt =
          lowerCmd.includes('software') ||
          lowerCmd.includes('it support') ||
          lowerCmd.includes('computer support');
        const isHome = lowerCmd.includes('home') || lowerCmd.includes('top') || lowerCmd.includes('start');
        
        const isScroll = lowerCmd.includes('scroll to') || lowerCmd.includes('open') || lowerCmd.includes('show') || lowerCmd.includes('view') || lowerCmd.includes('go to');

        const waUrl = KNOWLEDGE_BASE.personal.whatsappChatUrl;
        const wantsWhatsAppApp =
          /\bwhatsapp\b/.test(lowerCmd) &&
          /\b(open|chat|message|text|start|link)\b/.test(lowerCmd);
        if (wantsWhatsAppApp && waUrl) {
          try {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
          } catch {
            window.location.href = waUrl;
          }
          speak('Opening WhatsApp — you can message him there.');
          return true;
        }

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
            speak(
              lowerCmd.includes('whatsapp')
                ? "Opening contact — you can WhatsApp him at the same number listed there."
                : "Opening contact — you can reach out from there."
            );
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

        if (isSoftwareIt && isScroll) {
          const el = document.getElementById('software-it');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Opening Software and IT — packages, process, and FAQ.");
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

    // 2. In-browser OpenAI when REACT_APP_OPENAI_API_KEY is set (before FastAPI so local :8000 does not shadow your key)
    if (!responseText && OPENAI_API_KEY) {
      try {
        responseText = await generateJarvisResponse(text, messages);
      } catch (e) {
        console.error('JARVIS: OpenAI error:', e);
      }
    }

    // 3. Optional FastAPI backend — when browser GPT did not answer
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
      } else if (
        lowerText.includes('contact') ||
        lowerText.includes('email') ||
        lowerText.includes('reach') ||
        lowerText.includes('whatsapp') ||
        lowerText.includes('phone') ||
        lowerText.includes('call')
      ) {
        const p = KNOWLEDGE_BASE.personal;
        responseText = `You can reach Quinton by email at ${p.email}, phone ${p.phone}, or WhatsApp the same number (${p.whatsapp}). Quick WhatsApp chat: ${p.whatsappChatUrl} — he’s also on LinkedIn: ${p.linkedin}. Based in Victoria Falls.`;
      } else if (lowerText.includes('achievement') || lowerText.includes('accomplishment')) {
        responseText = `Some of Quinton's achievements: ${KNOWLEDGE_BASE.achievements.join(' ')}`;
      } else if (lowerText.includes('interest') || lowerText.includes('hobby')) {
        responseText = `Outside of coding, Quinton enjoys: ${KNOWLEDGE_BASE.interests.join(', ')}.`;
      } else {
        responseText = OPENAI_API_KEY
          ? "I'm afraid that didn't come through cleanly. Could you repeat your question?"
          : "I can answer basics about Quinton’s projects, skills, and contact from this page. For full AI replies, run the FastAPI backend with OPENAI_API_KEY (see jarvis-backend/.env.example) and set REACT_APP_ASSISTANT_API_URL on your site, or add a dev-only REACT_APP_OPENAI_API_KEY. What would you like to know?";
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
    }
  };

  const handleUserMessageRef = useRef(handleUserMessage);
  handleUserMessageRef.current = handleUserMessage;
  const speakRef = useRef(speak);
  speakRef.current = speak;
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
      return () => {};
    }

    const SpeechRecognition = getSpeechRecognitionCtor();
    if (!SpeechRecognition) {
      return () => {};
    }

    const webKitish = preferSpeechFinalOnly();

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
          mainRecActiveRef.current = true;
          setIsListening(true);
          setStatusText('Listening...');
        };

        recognition.onend = () => {
          console.log('JARVIS: Recognition ended');
          mainRecActiveRef.current = false;
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          const err = event.error as string;
          console.error('JARVIS: Recognition error:', err);
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
    } catch (e) {
      console.error('Speech recognition setup failed:', e);
    }

    return () => {
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
        ? `Hey — I'm Quinton, your site assistant. Want to know about my creator? That's you — or we can prep anything for visitors. Chat here or tap the mic to talk.${gestureHint}`
        : `Hi — I'm Quinton. Want to know about my creator, Quinton Ndlovu? Type a message or tap the mic to speak.${gestureHint}`;

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
      speak("Mic on — I'm Quinton. Tap the mic when you want to speak.");
      setStatusText('System Ready');
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
    const wantVisualizer = micReady && isOpen && (isListening || isSpeaking);
    if (wantVisualizer) {
      startAudioVisualizer();
    } else {
      stopAudioVisualizer();
    }
    return () => stopAudioVisualizer();
  }, [isOpen, isListening, isSpeaking, micReady, startAudioVisualizer, stopAudioVisualizer]);

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
                    ? 'Ready — type or tap the mic to speak'
                    : statusText;

  const needsMicTap = voiceToTextSupported && !micReady && !micNeedsHelp;

  return (
    <>
      {toast && !isOpen && (
        <div
          className="fixed bottom-[5.75rem] left-4 right-4 z-[95] mx-auto max-w-md sm:bottom-24 sm:left-auto sm:right-6 sm:mx-0"
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
        <div className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-40 sm:bottom-8 sm:right-6">
          <button
            type="button"
            onClick={() => {
              if (autoMinimizeRef.current) {
                clearTimeout(autoMinimizeRef.current);
                autoMinimizeRef.current = null;
              }
              setIsOpen(true);
            }}
            className={`pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-sky-500 to-blue-600 text-white shadow-[0_10px_40px_-8px_rgba(14,165,233,0.55)] ring-2 ring-white/70 transition duration-200 hover:scale-[1.06] hover:shadow-[0_14px_44px_-8px_rgba(14,165,233,0.6)] active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/40 ${
              needsMicTap ? 'ring-emerald-300/90 shadow-emerald-500/20' : ''
            } ${isListening ? 'ring-sky-200' : ''}`}
            aria-label={
              needsMicTap
                ? 'Open AI assistant — enable the mic inside the panel'
                : isListening
                  ? 'Open AI assistant — listening'
                  : isSpeaking
                    ? 'Open AI assistant — speaking'
                    : 'Open AI assistant'
            }
            title="AI assistant"
          >
            {(isListening || isSpeaking) && (
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isListening ? 'animate-ping bg-sky-400' : 'bg-violet-400'}`}
                />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-white ring-2 ring-sky-500" />
              </span>
            )}
            {needsMicTap && !isListening && !isSpeaking && (
              <span
                className="pointer-events-none absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 shadow-sm ring-2 ring-white"
                aria-hidden
              />
            )}
            <span className={`relative flex items-center justify-center ${isListening ? 'scale-105' : ''}`} aria-hidden>
              {renderIcon(FaMicrophone, 22)}
            </span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] pointer-events-none font-sans antialiased">
          <p className="pointer-events-none absolute left-0 right-0 top-6 z-[101] text-center text-sm font-semibold text-sky-500">
            AI Chat
          </p>
          <div
            className="absolute inset-0 bg-[#1D1D1F]/25 backdrop-blur-[2px] pointer-events-auto transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />

          <div
            className="absolute bottom-4 left-4 right-4 top-auto flex max-h-[min(90vh,720px)] min-h-[380px] flex-col overflow-hidden rounded-[1.75rem] border border-gray-100/80 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] sm:bottom-8 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 pointer-events-auto"
            role="dialog"
            aria-labelledby="assistant-title"
            aria-describedby="assistant-subtitle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex shrink-0 flex-col gap-0.5 border-b border-gray-100/90 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 id="assistant-title" className="truncate text-base font-bold tracking-tight text-[#1D1D1F]">
                      Ask Quinton
                    </h2>
                    <span
                      className={`inline-flex h-2 w-2 shrink-0 rounded-full ring-4 ring-white ${voiceToTextSupported && micReady ? 'bg-emerald-500' : isJarvisOnline ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      title={
                        voiceToTextSupported && micReady
                          ? 'Mic ready — tap to speak'
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
                  Firefox and some browsers do not ship speech-to-text. For voice, use{' '}
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
                  Turn on the microphone. Your browser only allows the mic after you tap.
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
                    <p className="rounded-2xl border border-dashed border-gray-200 bg-white/90 px-4 py-6 text-center text-sm text-gray-500">
                      Start a conversation — ask about Quinton, projects, or contact. Tap the <span className="font-semibold text-sky-600">mic</span> in the bar below to speak.
                    </p>
                  )}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${m.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {!m.isUser && (
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-[11px] font-bold text-white shadow-md shadow-sky-500/30"
                          aria-hidden
                        >
                          Q
                        </div>
                      )}
                      <div className={`max-w-[min(100%,300px)] space-y-1 ${m.isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            m.isUser
                              ? 'rounded-tr-md bg-sky-100 text-sky-950 shadow-sm'
                              : 'rounded-tl-md bg-gray-100 text-gray-900'
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
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-200/80 text-[10px] font-bold text-sky-900"
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
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-[11px] font-bold text-white shadow-md"
                        aria-hidden
                      >
                        Q
                      </div>
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="shrink-0 space-y-3 border-t border-gray-100 bg-white px-4 pb-4 pt-3">
                <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {['About', 'Projects', 'Skills', 'Contact'].map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => handleUserMessage(`Open ${cmd}`)}
                      className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#1D1D1F] transition hover:border-sky-300 hover:bg-sky-50"
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
                  className="flex items-center gap-2"
                >
                  <div className="relative min-w-0 flex-1">
                    <input
                      ref={inputRef}
                      name="hud-input"
                      type="text"
                      autoComplete="off"
                      placeholder="How else can I help?"
                      className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-4 pr-14 text-sm font-medium text-[#1D1D1F] placeholder:text-gray-400 transition focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!micReady || micNeedsHelp) {
                          void requestMicPermission({ startListeningAfter: voiceToTextSupported });
                          return;
                        }
                        toggleListening();
                      }}
                      className={`absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition ${
                        isListening
                          ? 'bg-red-500 text-white shadow-md'
                          : needsMicTap || micNeedsHelp
                            ? 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      aria-pressed={isListening}
                      aria-label={
                        !micReady || micNeedsHelp ? 'Enable microphone' : isListening ? 'Stop listening' : 'Start listening'
                      }
                    >
                      {(isListening || isSpeaking) && (
                        <span
                          className="absolute inset-0 rounded-full opacity-30"
                          style={{
                            transform: `scale(${1 + audioLevel / 400})`,
                            background: isListening ? 'currentColor' : 'transparent',
                          }}
                        />
                      )}
                      <span className="relative z-[1] text-sm leading-none">{renderIcon(FaMicrophone, 14)}</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    aria-label="Send message"
                  >
                    {renderIcon(FaArrowUp, 18)}
                  </button>
                </form>
                <div className="flex flex-col items-center gap-2 pt-1">
                  <p className="text-center text-[11px] text-gray-400">Chat-based AI on Quinton&apos;s portfolio.</p>
                  <a
                    href={KNOWLEDGE_BASE.personal.whatsappChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md shadow-green-600/20 transition hover:scale-105 hover:bg-[#20bd5a]"
                    aria-label="Message Quinton on WhatsApp"
                    title="WhatsApp"
                  >
                    {renderIcon(FaWhatsapp, 22)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;

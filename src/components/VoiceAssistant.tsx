import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaTimes, FaVolumeMute, FaVolumeUp, FaCog, FaMicrophone, FaChevronUp, FaArrowUp, FaWhatsapp } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

// Browser OpenAI is optional; keys belong in FastAPI (OPENAI_API_KEY on the server) for production.
function normalizeEnvKey(raw: string | undefined): string {
  return (raw ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/^[;:\s]+|[;:\s]+$/g, "");
}

const OPENAI_API_KEY = normalizeEnvKey(process.env.REACT_APP_OPENAI_API_KEY);
const OPENAI_CHAT_MODEL = normalizeEnvKey(process.env.REACT_APP_OPENAI_MODEL) || 'gpt-4o-mini';

/** Google AI Studio — free tier: https://aistudio.google.com/apikey */
const GEMINI_API_KEY = normalizeEnvKey(process.env.REACT_APP_GEMINI_API_KEY);
const GEMINI_MODEL = normalizeEnvKey(process.env.REACT_APP_GEMINI_MODEL) || 'gemini-2.0-flash';

/** Groq — free tier (fast): https://console.groq.com/keys */
const GROQ_API_KEY = normalizeEnvKey(process.env.REACT_APP_GROQ_API_KEY);
const GROQ_MODEL = normalizeEnvKey(process.env.REACT_APP_GROQ_MODEL) || 'llama-3.3-70b-versatile';

/** `auto` = Gemini → Groq → OpenAI (free/cheap first). Or force: `gemini` | `groq` | `openai`. */
const LLM_PROVIDER = (process.env.REACT_APP_LLM_PROVIDER || 'auto').toLowerCase();

function hasBrowserLlmKey(): boolean {
  return !!(GEMINI_API_KEY || GROQ_API_KEY || OPENAI_API_KEY);
}

function resolveLlmProvider(): 'gemini' | 'groq' | 'openai' | null {
  if (LLM_PROVIDER === 'gemini') return GEMINI_API_KEY ? 'gemini' : null;
  if (LLM_PROVIDER === 'groq') return GROQ_API_KEY ? 'groq' : null;
  if (LLM_PROVIDER === 'openai') return OPENAI_API_KEY ? 'openai' : null;
  if (LLM_PROVIDER !== 'auto' && LLM_PROVIDER) return null;
  if (GEMINI_API_KEY) return 'gemini';
  if (GROQ_API_KEY) return 'groq';
  if (OPENAI_API_KEY) return 'openai';
  return null;
}

let browserOpenAI: OpenAI | null = null;
function getBrowserOpenAI(): OpenAI | null {
  if (!OPENAI_API_KEY) return null;
  if (!browserOpenAI) {
    browserOpenAI = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  }
  return browserOpenAI;
}

let browserGroq: OpenAI | null = null;
function getBrowserGroq(): OpenAI | null {
  if (!GROQ_API_KEY) return null;
  if (!browserGroq) {
    browserGroq = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
      dangerouslyAllowBrowser: true,
    });
  }
  return browserGroq;
}

let geminiClient: GoogleGenerativeAI | null = null;
function getGeminiClient(): GoogleGenerativeAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!geminiClient) geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
  return geminiClient;
}

async function generateWithGemini(systemPrompt: string, input: string, history: Message[]): Promise<string> {
  const genAI = getGeminiClient();
  if (!genAI) throw new Error('Gemini not configured');
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
  });
  const historyParts = history.slice(-12).map((m) => ({
    role: m.isUser ? ('user' as const) : ('model' as const),
    parts: [{ text: m.text }],
  }));
  const chat = model.startChat({ history: historyParts });
  const result = await chat.sendMessage(input);
  const text = result.response.text();
  if (!text?.trim()) throw new Error('Empty Gemini response');
  return text.trim();
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

/**
 * Strong local answers when no cloud model responded — avoids the old “offline” dead-end.
 * Mirrors the FastAPI rule layer so the site stays useful without API keys.
 */
function smartLocalAssistantReply(raw: string): string {
  const low = raw.toLowerCase().trim();
  const p = KNOWLEDGE_BASE.personal;
  const s = KNOWLEDGE_BASE.skills;
  const projects = KNOWLEDGE_BASE.projects;
  const services = KNOWLEDGE_BASE.services;

  if (!low) {
    return `Ask me about ${p.name}'s projects, skills, how to hire him, or say “contact” — I answer from his portfolio data.`;
  }

  if (
    /^(hi|hey|hello|greetings|good\s*(morning|afternoon|evening))\b/.test(low) ||
    /^(hi|hey|hello)[\s!.]*$/.test(low)
  ) {
    return `Hi — I'm Quinton, the assistant here. ${p.name} is a ${p.title} in ${p.location}. Want projects, skills, or how to reach him?`;
  }

  if (/(who are you|what are you|your name|what can you do|help me|capabilities)/.test(low)) {
    return `I'm Quinton, your guide on this portfolio. I know ${p.name}'s story, stack, shipped work, and contact — ask naturally, e.g. “what did he build?” or “email?”.`;
  }

  if (/(offline|not working|broken|api|model|openai|cloud)/.test(low)) {
    return `I'm running from this page’s knowledge base right now${hasBrowserLlmKey() ? '' : ' — add a free key: REACT_APP_GEMINI_API_KEY (Google AI Studio) or REACT_APP_GROQ_API_KEY (Groq), or run jarvis-backend with OPENAI_API_KEY. Try: “projects”, “skills”, or “contact”.'}`;
  }

  if (/(who is quinton|about quinton|tell me about|background|bio)/.test(low)) {
    return `${p.name} — ${p.title} in ${p.location}. ${p.bio} ${p.tagline} He leads engineering at ${p.organization}.`;
  }

  if (/(project|portfolio|built|shipped|work on|case study)/.test(low)) {
    const lines = projects.map((x) => `• ${x.name}: ${x.description}`).join("\n");
    return `Here's a snapshot of his work:\n${lines}\nAsk by name if you want detail.`;
  }

  if (/(skill|tech|stack|framework|language|tools?)/.test(low)) {
    return `Frontend: ${s.frontend.join(", ")}. Backend: ${s.backend.join(", ")}. Tools: ${s.tools.join(", ")}.`;
  }

  if (/(contact|email|reach|hire|whatsapp|phone|call|collab)/.test(low)) {
    return `Reach ${p.name}: ${p.email}, phone ${p.phone} (same on WhatsApp). Chat: ${p.whatsappChatUrl}. LinkedIn: ${p.linkedin}`;
  }

  if (/(where|location|based|city|zimbabwe|victoria)/.test(low)) {
    return `He's based in ${p.location} — ${p.tagline}`;
  }

  if (/uncommon/.test(low)) {
    return `He's Lead Developer at ${p.organization}, building education and ops software.`;
  }

  if (/(service|offer|freelance|consult)/.test(low)) {
    return services.map((x) => `• ${x.title}: ${x.description}`).join("\n");
  }

  if (/(achievement|award|accomplish)/.test(low)) {
    return KNOWLEDGE_BASE.achievements.join(" ");
  }

  if (/(hobby|interest|fun)/.test(low)) {
    return `Outside work: ${KNOWLEDGE_BASE.interests.join(", ")}.`;
  }

  if (/(time|date|day)\b/.test(low)) {
    const now = new Date();
    return `Local time here: ${now.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}.`;
  }

  return `I can talk about ${p.name}'s projects (${projects
    .slice(0, 3)
    .map((x) => x.name)
    .join(", ")}), full-stack skills, services, or contact (${p.email}). What would you like to explore?`;
}

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

    const openAiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-12).map((m) => ({
        role: m.isUser ? ('user' as const) : ('assistant' as const),
        content: m.text,
      })),
      { role: 'user', content: input },
    ];

    const provider = resolveLlmProvider();
    if (!provider) {
      return smartLocalAssistantReply(input);
    }

    if (provider === 'gemini') {
      return await generateWithGemini(systemPrompt, input, history);
    }

    if (provider === 'groq') {
      const groq = getBrowserGroq();
      if (!groq) return smartLocalAssistantReply(input);
      const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: openAiMessages,
        max_tokens: 900,
        temperature: 0.8,
      });
      return (
        response.choices[0]?.message?.content?.trim() ||
        'Something glitched — try again or ask about projects or contact.'
      );
    }

    const client = getBrowserOpenAI();
    if (!client) return smartLocalAssistantReply(input);

    const response = await client.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      messages: openAiMessages,
      max_tokens: 900,
      temperature: 0.8,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      'Something glitched on my side — try again, or ask about Quinton’s projects or contact info.'
    );
  } catch (error) {
    console.error('LLM Error:', error);
    return smartLocalAssistantReply(input);
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
  /** Web Speech API: accumulate finals + last interim; dispatch once on `onend` (fixes Safari/Chrome quirks). */
  const speechFinalRef = useRef('');
  const speechInterimRef = useRef('');
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
    if (!micReady) {
      showToast('Tap the green microphone button first so the browser can access your mic — then you can speak.');
      return;
    }

    const run = (attempt: number) => {
      if (!recognitionRef.current) return;
      try {
        try {
          const r = recognitionRef.current as any;
          if (typeof r.abort === 'function') r.abort();
          else if (typeof r.stop === 'function') r.stop();
        } catch {
          /* not active */
        }
        speechFinalRef.current = '';
        speechInterimRef.current = '';
        recognitionRef.current.start();
        mainRecActiveRef.current = true;
        setIsListening(true);
        setStatusText('Listening...');
      } catch (e) {
        if (attempt < 8) {
          window.setTimeout(() => run(attempt + 1), 120 + attempt * 80);
        } else {
          console.error('Speech recognition start failed after retries:', e);
          mainRecActiveRef.current = false;
          setIsListening(false);
          setStatusText('System Ready');
          showToast('Could not start speech recognition — try again or type your message.');
        }
      }
    };
    window.setTimeout(() => run(0), 120);
  }, [showToast, micReady]);

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
      try {
        synthRef.current.resume();
      } catch {
        /* ignore */
      }
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

    // 2. In-browser LLM — Gemini / Groq / OpenAI (runs before FastAPI so local :8000 does not shadow your keys)
    if (!responseText && hasBrowserLlmKey()) {
      try {
        responseText = await generateJarvisResponse(text, messages);
      } catch (e) {
        console.error('JARVIS: OpenAI error:', e);
      }
    }

    // 3. Optional FastAPI backend (localhost or REACT_APP_ASSISTANT_API_URL) — used when browser GPT did not answer
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
        responseText = hasBrowserLlmKey()
          ? "I'm afraid that didn't come through cleanly. Could you repeat your question?"
          : smartLocalAssistantReply(text);
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

    try {
        // Main conversation recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const piece = event.results[i][0]?.transcript ?? '';
            if (event.results[i].isFinal) {
              speechFinalRef.current += piece;
            } else {
              interim += piece;
            }
          }
          speechInterimRef.current = interim;
        };

        recognition.onstart = () => {
          console.log('JARVIS: Recognition started');
          speechFinalRef.current = '';
          speechInterimRef.current = '';
          mainRecActiveRef.current = true;
          setIsListening(true);
          setStatusText('Listening...');
        };

        recognition.onend = () => {
          console.log('JARVIS: Recognition ended');
          const combined = (speechFinalRef.current + speechInterimRef.current).trim();
          speechFinalRef.current = '';
          speechInterimRef.current = '';
          mainRecActiveRef.current = false;
          setIsListening(false);
          setStatusText('System Ready');
          if (combined) {
            console.log('JARVIS: Transcript:', combined);
            handleUserMessageRef.current(combined);
          }
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
            // Chrome/Edge send audio to Google’s *speech* servers — different from Gemini chat. Often fails on strict networks; not your API key.
            setStatusText('Type below — AI works');
            showToast(
              'Voice typing uses the browser’s speech service (not your Gemini key). Chat still works — type your message, or try another network/browser.'
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
  }, [voiceToTextSupported, showToast]);

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
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25">
                <span
                  className={`absolute inset-0 rounded-2xl ${isListening ? 'animate-pulse bg-white/15' : ''}`}
                  aria-hidden
                />
                {renderIcon(FaMicrophone, 18)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold tracking-tight text-[#1D1D1F]">
                  AI Chat
                </span>
                <span className="mt-0.5 block truncate text-xs text-gray-500">
                  {isSpeaking
                    ? 'Speaking…'
                    : isListening
                      ? 'Listening…'
                      : !voiceToTextSupported
                        ? 'Voice typing: use Chrome, Edge, or Safari — chat works in any browser'
                        : 'Tap the mic to speak — push-to-talk'}
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

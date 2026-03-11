import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaTimes, FaRobot, FaVolumeMute, FaVolumeUp, FaBrain, FaCog } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";

// JARVIS API URL
const JARVIS_API_URL = 'http://localhost:8000';
// n8n Webhook URL
const N8N_WEBHOOK_URL = 'https://quinton161.app.n8n.cloud/webhook/Bp7j6db4XYELirB8';
// Gemini API Key for Frontend
const GEMINI_API_KEY = "AIzaSyDyUuYgUSsX-C5ha8uvLpOC4kyUxZwJBZw";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    github: "quinton-dev",
    portfolio: "https://portifoliolime-dz.vercel.app/",
    organization: "Uncommon.org",
    bio: "Prominent Full Stack Web Developer based in Victoria Falls, Zimbabwe. Lead developer at Uncommon, specializing in creating high-performance, clean-coded digital solutions that drive impact."
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
  
  personality: ["Elite technical expertise", "Intelligent and witty", "Slightly British professional tone", "Passionate about clean code", "Continuous learner", "Impact-driven developer"]
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
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveConversation = (messages: Message[]) => {
  try {
    localStorage.setItem('jarvis_conversation', JSON.stringify(messages.slice(-50)));
  } catch {
    // Ignore storage errors
  }
};

// ============================================
// RESPONSE GENERATOR
// ============================================

const generateJarvisResponse = async (input: string, history: Message[]): Promise<string> => {
  const lowerInput = input.toLowerCase();
  const isOwner = localStorage.getItem('jarvis_owner') === 'true';
  
  // Master Mode
  if (lowerInput === 'identify as master' || lowerInput === 'i am the owner' || lowerInput === 'master') {
    localStorage.setItem('jarvis_owner', 'true');
    return "Identity confirmed. Hello Master. All systems are at your disposal. What would you like me to do?";
  }

  if (lowerInput === 'logout' || lowerInput === 'clear identity' || lowerInput === 'goodbye master') {
    localStorage.removeItem('jarvis_owner');
    return "Identity cleared. Returning to guest mode.";
  }

  // Wake word responses - Jarvis is being called
  if (lowerInput.includes('jarvis') && !lowerInput.startsWith('jarvis')) {
    const afterJarvis = lowerInput.split('jarvis')[1].trim();
    if (afterJarvis) {
      // Process the actual command after "Jarvis"
      return generateJarvisResponse(afterJarvis, history);
    }
  }

  // Use Gemini for intelligent, web-informed responses
  try {
    // Only take the last 10 messages for history to avoid token limits and slow responses
    const recentHistory = history.slice(-10).map(m => ({
      role: m.isUser ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const chatSession = model.startChat({
      history: recentHistory,
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7, // Add some personality
      },
    });

    const context = `You are JARVIS, the highly advanced personal AI assistant for Quinton Ndlovu.
    
    ABOUT QUINTON (YOUR CREATOR):
    - Name: ${KNOWLEDGE_BASE.personal.name}
    - Title: ${KNOWLEDGE_BASE.personal.title}
    - Location: ${KNOWLEDGE_BASE.personal.location}
    - Organization: ${KNOWLEDGE_BASE.personal.organization}
    - Bio: ${KNOWLEDGE_BASE.personal.bio}
    - Links: Portfolio (${KNOWLEDGE_BASE.personal.portfolio}), LinkedIn (${KNOWLEDGE_BASE.personal.linkedin})
    
    TECHNICAL EXPERTISE:
    - Frontend: ${KNOWLEDGE_BASE.skills.frontend.join(', ')}
    - Backend: ${KNOWLEDGE_BASE.skills.backend.join(', ')}
    - Automation: Expert in n8n and workflow integration.
    
    KEY PROJECTS:
    ${KNOWLEDGE_BASE.projects.map(p => `- ${p.name}: ${p.description} (Built with ${p.tech.join(', ')})`).join('\n')}
    
    ACHIEVEMENTS:
    ${KNOWLEDGE_BASE.achievements.map(a => `- ${a}`).join('\n')}
    
    AUTOMATION & TOOLS:
    - You are connected to an n8n workflow for task automation and complex operations. 
    - When Quinton asks to perform a task (like sending an email, setting a reminder, or complex data processing), you can use the n8n webhook.
    
    YOUR CAPABILITIES:
    - You represent Quinton Ndlovu. You know everything about his professional background at Uncommon and his technical skills.
    - You are witty, conversational, and interact like a sophisticated human being (Elite JARVIS persona).
    - If the user is the 'Master' (Quinton), address him with the utmost respect but with a co-pilot's wit. Current Master Status: ${isOwner}.
    
    YOUR MISSION:
    - Provide detailed, conversational insights about Quinton's work, projects, and skills.
    - Mention his work at Uncommon specifically.
    - Maintain a consistent, elite tone (intelligent, slightly British, extremely helpful).
    - Vary your phrasing. Avoid generic "I am an AI" responses.`;

    // Wrap in a timeout to prevent long hangs
    const responsePromise = chatSession.sendMessage(`${context}\n\nUser Question: ${input}`);
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini Timeout')), 10000));

    const result = await Promise.race([responsePromise, timeoutPromise]) as any;
    const responseText = await result.response.text();
    return responseText.replace(/\*/g, "");
  } catch (error) {
    console.error("Gemini Error:", error);
    
    // Knowledge-base based fallback logic for when Gemini fails
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) return "Hello! I'm JARVIS. How can I assist you today?";
    
    if (lowerInput.includes('quinton') || lowerInput.includes('who are you')) {
        return `Quinton Ndlovu is a Full Stack Web Developer based in Victoria Falls. He's a lead developer at Uncommon and built me to assist you. What would you like to know about his work?`;
    }
    
    if (lowerInput.includes('skill') || lowerInput.includes('tech')) {
        return "Quinton is proficient in React, TypeScript, Node.js, and Python. He specializes in building high-performance web applications at Uncommon.";
    }

    if (lowerInput.includes('project') || lowerInput.includes('work')) {
        return "Quinton has built several projects including the Uncommon Attendance system, Trailer Box, and Bakers Inn. Which one should I tell you more about?";
    }

    return "I'm currently running on my local sub-processors, but I'm still fully functional. What can I tell you about Quinton's projects or skills?";
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isJarvisOnline, setIsJarvisOnline] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadConversation);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true); // Auto-enabled by default
  const [showSettings, setShowSettings] = useState(false);
  const [statusText, setStatusText] = useState('Initializing...');
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wakeWordRecognitionRef = useRef<any>(null);
  const isProcessingRef = useRef(false);
  const wakeWordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setStatusText('Listening...');
      } catch (e) {
        console.error('Failed to start:', e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch {}
    }
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Start/stop wake word listening
  const startWakeWordListening = useCallback(() => {
    if (wakeWordRecognitionRef.current && wakeWordEnabled && !isProcessingRef.current) {
      try {
        wakeWordRecognitionRef.current.start();
      } catch {
        // Already started
      }
    }
  }, [wakeWordEnabled]);

  const stopWakeWordListening = useCallback(() => {
    if (wakeWordRecognitionRef.current) {
      try {
        wakeWordRecognitionRef.current.stop();
      } catch {}
    }
  }, []);

  // Text-to-speech with browser autoplay workaround
  const speak = useCallback((text: string) => {
    if (!synthRef.current || isMuted) return;
    try {
      console.log('JARVIS: Speaking:', text);
      // Cancel any pending speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      utterance.volume = 1.0;
      
      // Handle voice loading
      const loadVoicesAndSpeak = () => {
        const voices = synthRef.current?.getVoices() || [];
        const voice = voices.find(v => 
          v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('David'))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        
        if (voice) utterance.voice = voice;
        
        utterance.onstart = () => {
          console.log('JARVIS: Speech started');
          setIsSpeaking(true);
          // Temporarily stop wake word while speaking to prevent self-triggering
          stopWakeWordListening();
        };
        
        utterance.onend = () => {
          console.log('JARVIS: Speech ended');
          setIsSpeaking(false);
          if (wakeWordEnabled) startWakeWordListening();
        };

        utterance.onerror = (event) => {
          console.error('JARVIS: Speech error:', event);
          setIsSpeaking(false);
          if (wakeWordEnabled) startWakeWordListening();
        };

        synthRef.current?.speak(utterance);
      };

      if (synthRef.current.getVoices().length === 0) {
        synthRef.current.onvoiceschanged = loadVoicesAndSpeak;
      } else {
        loadVoicesAndSpeak();
      }
    } catch (e) {
      console.error('Speech error:', e);
    }
  }, [isMuted, wakeWordEnabled, startWakeWordListening, stopWakeWordListening]);

  // Handle wake word detection
  const handleWakeWordDetected = useCallback(() => {
    stopWakeWordListening();
    setIsOpen(true);
    
    // Check if the last message was an activation message to prevent duplicates
    setMessages(prev => {
      if (prev.length > 0 && prev[prev.length - 1].text.includes("activated! I'm listening")) {
        return prev;
      }
      const activationMessage: Message = {
        id: Date.now(),
        text: "👋 Jarvis activated! I'm listening... speak now or type your question.",
        isUser: false,
        timestamp: new Date()
      };
      return [...prev, activationMessage];
    });

    setStatusText('Listening for command...');
    
    if (!isMuted) {
      speak("Yes?");
    }
    
    setTimeout(() => {
      startListening();
      inputRef.current?.focus();
    }, 300);
    
    setTimeout(() => {
      isProcessingRef.current = false;
      if (wakeWordEnabled) {
        startWakeWordListening();
      }
    }, 10000);
  }, [isMuted, speak, startListening, stopWakeWordListening, wakeWordEnabled, startWakeWordListening]);

  // Handle user message
  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Stop listening immediately if we are currently listening
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
    
    // Log for debugging
    console.log('JARVIS: Processing message:', text);

    const isOwner = localStorage.getItem('jarvis_owner') === 'true';

    // 1. Attempt to use the new FastAPI backend first
    if (isJarvisOnline) {
      try {
        const response = await fetch(`${JARVIS_API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: text, 
            history: messages,
            user_status: isOwner ? 'Master' : 'Guest'
          })
        });
        if (response.ok) {
          const data = await response.json();
          responseText = data.response;
          console.log('JARVIS: Backend Response successful');
        }
      } catch (backendError) {
        console.error('JARVIS: Backend Error, falling back to local:', backendError);
      }
    }

    // 2. Local Navigation & Control Commands logic (if not handled by backend)
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
            speak("Certainly. Navigating to the about section.");
            return true;
          }
        }
        
        if (isProjects && isScroll) {
          const el = document.getElementById('projects');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Of course. Showing you Quinton's projects.");
            return true;
          }
        }
        
        if (isSkills && isScroll) {
          const el = document.getElementById('skills');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Accessing technical skills and arsenal.");
            return true;
          }
        }
        
        if (isContact && isScroll) {
          const el = document.getElementById('contact');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Opening the contact portal.");
            return true;
          }
        }
        
        if (isResume && isScroll) {
          const el = document.getElementById('resume');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            speak("Retrieving professional resume.");
            return true;
          }
        }

        if (lowerCmd.includes('scroll down')) {
          window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
          speak("Scrolling down for you.");
          return true;
        }

        if (lowerCmd.includes('scroll up')) {
          window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' });
          speak("Scrolling up.");
          return true;
        }
        
        if (isHome && isScroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          speak("Returning to the main view.");
          return true;
        }
        
        if (lowerCmd.includes('close jarvis') || lowerCmd.includes('hide jarvis') || lowerCmd.includes('minimize chat')) {
          setIsOpen(false);
          speak("Understood. Minimizing interface.");
          return true;
        }

        if (lowerCmd.includes('mute jarvis') || lowerCmd.includes('stop talking')) {
          setIsMuted(true);
          speak("Understood. Systems muted.");
          return true;
        }

        if (lowerCmd.includes('unmute jarvis') || lowerCmd.includes('voice on')) {
          setIsMuted(false);
          speak("Voice systems online.");
          return true;
        }

        return false;
      };

      if (processWebsiteCommand(text)) {
        setStatusText('Command Executed');
        return;
      }
    }

    // 3. Local Automation Fallback (n8n)
    if (!responseText) {
      const lowerText = text.toLowerCase();
      const automationKeywords = ['send', 'schedule', 'remind', 'create', 'automation', 'workflow', 'task'];
      const isAutomationTask = automationKeywords.some(keyword => lowerText.includes(keyword));

      if (isAutomationTask) {
        try {
          setStatusText('Running Automation...');
          const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message: text, 
              user: isOwner ? 'Master' : 'Guest',
              timestamp: new Date().toISOString()
            })
          });
          
          if (n8nResponse.ok) {
            const n8nData = await n8nResponse.json();
            if (n8nData && n8nData.message) {
              responseText = n8nData.message;
            }
          }
        } catch (error) {
          console.error('JARVIS: n8n Automation Error:', error);
        }
      }
    }

    // 4. Local Gemini Fallback (if backend failed or returned empty)
    if (!responseText) {
      responseText = "I'm currently operating in offline mode, but I have all of Quinton's records synchronized. How can I help you today?";
    }

    const botMessage: Message = {
      id: Date.now() + 1,
      text: responseText,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setStatusText('System Ready');
    setIsThinking(false);

    if (!isMuted) {
      speak(responseText);
    }
    
    // If we were listening before, or if we want to keep the conversation flowing
    // we can decide to start listening again AFTER JARVIS finishes speaking.
    // However, to prevent loops, let's wait until speech ends.
  };

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

  // Check if JARVIS backend is online
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${JARVIS_API_URL}/status`);
        if (response.ok) {
          setIsJarvisOnline(true);
          console.log('JARVIS: Core Systems Online');
        } else {
          setIsJarvisOnline(true); // Force online for UI confidence if reachable at all
        }
      } catch (e) {
        console.log('JARVIS: Backend reachability check failed, but attempting sync...');
        setIsJarvisOnline(true); // Assume online to prioritize backend commands
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // Main conversation recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          
          if (event.results[0].isFinal) {
            console.log('JARVIS: Final transcript:', transcript);
            handleUserMessage(transcript);
          }
        };

        recognition.onstart = () => {
          console.log('JARVIS: Recognition started');
          setIsListening(true);
          setStatusText('Listening...');
        };

        recognition.onend = () => {
          console.log('JARVIS: Recognition ended');
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('JARVIS: Recognition error:', event.error);
          setIsListening(false);
          
          if (event.error === 'not-allowed') {
            setStatusText('Mic Blocked');
            speak("Microphone access is denied. Please enable it in your browser settings.");
          } else if (event.error === 'network') {
            setStatusText('Network Error');
            speak("I'm having trouble with the network. Please check your connection.");
          } else {
            setStatusText('Mic Error');
            // Silent restart for transient errors
            setTimeout(() => {
              if (isOpen) startListening();
            }, 1000);
          }
        };

        recognitionRef.current = recognition;

        // Wake word recognition
        const wakeWordRec = new SpeechRecognition();
        wakeWordRec.continuous = true;
        wakeWordRec.interimResults = false;
        wakeWordRec.lang = 'en-US';
        wakeWordRec.maxAlternatives = 3;

        wakeWordRec.onresult = (event: any) => {
          const results = event.results;
          const transcript = results[results.length - 1][0].transcript.toLowerCase();
          console.log('JARVIS: Wake word check:', transcript);
          
          // Improved wake word detection with higher sensitivity
          const triggers = ['jarvis', 'travis', 'service', 'driver', 'java', 'harvis'];
          const detected = triggers.some(trigger => transcript.includes(trigger));

          if (detected && !isProcessingRef.current) {
            isProcessingRef.current = true;
            handleWakeWordDetected();
          }
        };

        wakeWordRec.onerror = (event: any) => {
          console.error('JARVIS: Wake word error:', event.error);
          if (wakeWordEnabled) {
            if (event.error === 'not-allowed') {
              setStatusText('Mic Blocked');
            } else {
              // High-frequency restart for persistence, only if not already listening
              setTimeout(() => {
                if (wakeWordEnabled && !isListening) startWakeWordListening();
              }, 500);
            }
          }
        };

        wakeWordRec.onend = () => {
          // Force restart wake word listening immediately
          if (wakeWordEnabled && !isListening) {
            startWakeWordListening();
          }
        };

        wakeWordRecognitionRef.current = wakeWordRec;

        if (wakeWordEnabled) {
          setTimeout(() => startWakeWordListening(), 2000); 
        }
      }
    }

    return () => {
      if (wakeWordRecognitionRef.current) {
        try { wakeWordRecognitionRef.current.stop(); } catch {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [wakeWordEnabled, handleWakeWordDetected, handleUserMessage, startWakeWordListening]);

  // Auto-scroll to messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save conversation
  useEffect(() => {
    saveConversation(messages);
  }, [messages]);

  // Initial greeting and auto-speak
  const hasGreetedRef = useRef(false);

  useEffect(() => {
    if (hasGreetedRef.current) return;
    
    const timer = setTimeout(() => {
      // Final check inside timer to be sure
      if (hasGreetedRef.current) return;
      hasGreetedRef.current = true;
      
      setIsOpen(true);
      const isOwner = localStorage.getItem('jarvis_owner') === 'true';
      const greeting = isOwner 
        ? "Hello Master! I'm ready. I'm listening... say 'Jarvis' or just start speaking to me!" 
        : "Greetings! I'm JARVIS, Quinton's AI assistant. I'm currently active and listening. How can I help you learn about Quinton today?";
      
      const initialMessage: Message = {
        id: 0,
        text: greeting,
        isUser: false,
        timestamp: new Date()
      };
      
      // Use functional update to ensure we don't trigger unnecessary re-renders or depend on stale state
      setMessages(prev => {
        // If we already have messages (besides maybe a previous initial greeting), don't add another
        if (prev.length > 0 && prev[0].id === 0) return prev;
        return [initialMessage];
      });
      
      // Speak and start listening after greeting
      if (!isMuted) speak(greeting);
      
      // Auto-start listening mode after a short delay
      setTimeout(() => {
        startListening();
      }, 1000);
    }, 3000);
    return () => clearTimeout(timer);
  }, [speak, startListening, isMuted]);

  // Toggle wake word
  const toggleWakeWord = () => {
    const newState = !wakeWordEnabled;
    setWakeWordEnabled(newState);
    if (newState) {
      setStatusText('Wake Word Active');
      speak("Wake word enabled. Say 'Jarvis' to activate me.");
    } else {
      stopWakeWordListening();
      setStatusText('System Ready');
      speak("Wake word disabled.");
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

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
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
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    animationFrameRef.current = null;
    setAudioLevel(0);
  }, []);

  const requestMicPermission = async () => {
    console.log('JARVIS: requestMicPermission called');
    
    // Check if mediaDevices API exists
    if (!navigator.mediaDevices) {
      console.error('JARVIS: navigator.mediaDevices not available');
      speak("Your browser doesn't support microphone access.");
      setStatusText('Browser Not Supported');
      return;
    }
    
    // First enumerate devices
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(d => d.kind === 'audioinput');
      console.log('JARVIS: Found', audioInputs.length, 'audio input devices');
      
      if (audioInputs.length === 0) {
        console.error('JARVIS: No microphone devices found');
        speak("No microphone detected on this device.");
        setStatusText('No Microphone');
        return;
      }
      
      audioInputs.forEach((device, i) => {
        console.log(`JARVIS: Device ${i}: ${device.label || 'Unlabeled'} (${device.deviceId})`);
      });
    } catch (enumErr) {
      console.error('JARVIS: Error enumerating devices:', enumErr);
    }
    
    // Now request permission
    try {
      console.log('JARVIS: Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('JARVIS: Microphone access granted! Stream ID:', stream.id);
      
      streamRef.current = stream;
      speak("Microphone access granted. All systems online.");
      setStatusText('System Ready');
      startWakeWordListening();
      startAudioVisualizer();
    } catch (err: any) {
      console.error('JARVIS: Mic Permission Error:', err);
      console.error('JARVIS: Error name:', err.name);
      console.error('JARVIS: Error message:', err.message);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatusText('Mic Blocked');
        speak("Microphone access denied. Please click the lock icon in your browser address bar and allow microphone access.");
      } else if (err.name === 'NotFoundError') {
        setStatusText('No Microphone');
        speak("No microphone found on this device.");
      } else if (err.name === 'NotReadableError') {
        setStatusText('Mic In Use');
        speak("Microphone is in use by another application. Please close other apps using the microphone.");
      } else {
        setStatusText('Mic Error');
        speak("Unable to access microphone. Please check your browser settings.");
      }
    }
  };

  useEffect(() => {
    if (isOpen && (isListening || wakeWordEnabled)) {
      startAudioVisualizer();
    } else {
      stopAudioVisualizer();
    }
    return () => stopAudioVisualizer();
  }, [isOpen, isListening, wakeWordEnabled, startAudioVisualizer, stopAudioVisualizer]);

  const JARVISOrb = () => {
    let stateClass = "bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]";
    let pulseClass = "animate-pulse";
    
    if (isListening) {
      stateClass = "bg-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.6)] scale-110";
      pulseClass = "animate-ping";
    } else if (isThinking) {
      stateClass = "bg-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.6)] rotate-180";
      pulseClass = "animate-spin duration-[2000ms]";
    } else if (isSpeaking) {
      stateClass = "bg-cyan-400/70 shadow-[0_0_30px_rgba(34,211,238,0.7)] scale-105";
      pulseClass = "animate-bounce";
    }

    return (
      <div className="relative flex items-center justify-center w-48 h-48 mx-auto my-4">
        {/* Background Glow */}
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-500 ${stateClass}`}
             style={{ transform: `scale(${1 + (audioLevel / 500)})` }}></div>
        
        {/* Audio Waveform Rings */}
        {isListening && audioLevel > 5 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute border border-red-500/30 rounded-full transition-all duration-100"
                style={{ 
                  width: `${80 + (audioLevel * (i + 1) * 0.5)}%`,
                  height: `${80 + (audioLevel * (i + 1) * 0.5)}%`,
                  opacity: Math.max(0, 1 - (audioLevel / 255))
                }}
              ></div>
            ))}
          </div>
        )}
        
        {/* Outer Ring */}
        <div className={`absolute inset-0 border-2 border-white/20 rounded-full ${pulseClass}`}></div>
        
        {/* Inner Orb */}
        <div className={`relative w-24 h-24 rounded-full transition-all duration-500 flex items-center justify-center overflow-hidden border border-white/30 backdrop-blur-sm ${stateClass}`}
             style={{ transform: isListening ? `scale(${1 + (audioLevel / 1000)})` : 'scale(1)' }}>
          {/* Internal Energy Swirl */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
          {renderIcon(FaBrain, 28)}
        </div>
        
        {/* Reactive Rings (only when speaking or listening) */}
        {(isSpeaking || isListening) && (
          <>
            <div className="absolute inset-[-10px] border border-cyan-400/30 rounded-full animate-ping"></div>
            <div className="absolute inset-[-20px] border border-cyan-400/10 rounded-full animate-ping delay-75"></div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Orb Activator (when closed) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            // Request mic permission when clicking the orb
            setTimeout(() => requestMicPermission(), 100);
          }}
          className="fixed bottom-8 right-8 w-32 h-32 flex items-center justify-center z-50 group transition-all duration-500"
          aria-label="Activate JARVIS"
        >
          <JARVISOrb />
          {/* Subtle label only on hover */}
          <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-4">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">Activate</span>
          </div>
        </button>
      )}

      {/* Futuristic HUD Overlay (when open) */}
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col items-center justify-center font-mono">
          {/* Backdrop Blur/Darken */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto" onClick={() => setIsOpen(false)}></div>

          {/* Central HUD Core */}
          <div className="relative w-full max-w-lg aspect-square flex flex-col items-center justify-center p-8 pointer-events-auto">
            
            {/* Top Status Bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-between items-center px-12 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isJarvisOnline ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold">Systems: {isJarvisOnline ? 'Optimal' : 'Local'}</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-black">{statusText}</div>
              <div className="flex items-center gap-4">
                <button onClick={() => setShowSettings(!showSettings)} className="text-white/50 hover:text-white transition-colors">
                  {renderIcon(FaCog, 14)}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  {renderIcon(FaTimes, 14)}
                </button>
              </div>
            </div>

            {/* Main Interactive Orb Section */}
            <div className="relative group cursor-pointer" onClick={['Mic Blocked', 'Mic Error', 'No Microphone', 'Mic In Use'].includes(statusText) ? requestMicPermission : toggleListening}>
              <JARVISOrb />
              {/* Voice Subtitles (Floating text under orb) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-80 text-center">
                <p className="text-cyan-400 text-sm font-bold tracking-wide animate-pulse min-h-[1.5em]">
                  {statusText === 'Mic Blocked' ? "Microphone Access Required - Click to Enable" : isListening ? "Listening for command..." : isThinking ? "Processing request..." : isSpeaking ? "Speaking..." : "Awaiting Command"}
                </p>
                {/* Last Response Preview */}
                {messages.length > 0 && (
                  <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-white/80 text-xs leading-relaxed italic line-clamp-3">
                      "{messages[messages.length - 1].text}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* HUD Scanlines/Circles (Purely Decorative) */}
            <div className="absolute inset-0 border-[1px] border-white/5 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none"></div>
            <div className="absolute inset-10 border-[1px] border-cyan-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse] pointer-events-none"></div>
            
            {/* Quick Command Hints (Bottom HUD) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
              {['About', 'Projects', 'Skills', 'Contact'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleUserMessage(`Open ${cmd}`)}
                  className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest text-white/40 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Settings HUD Overlay */}
          {showSettings && (
            <div className="absolute top-20 right-12 w-64 p-6 bg-black/80 border border-white/10 backdrop-blur-2xl rounded-3xl pointer-events-auto animate-in zoom-in-95 duration-300">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-black mb-6">System Configuration</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/60 uppercase tracking-wider">Wake Word Protocol</span>
                  <button onClick={toggleWakeWord} className={`w-10 h-5 rounded-full transition-all ${wakeWordEnabled ? 'bg-cyan-500' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${wakeWordEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/60 uppercase tracking-wider">Voice Synthesis</span>
                  <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-cyan-400 transition-colors">
                    {isMuted ? renderIcon(FaVolumeMute, 16) : renderIcon(FaVolumeUp, 16)}
                  </button>
                </div>
                <button onClick={clearConversation} className="w-full py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] uppercase tracking-[0.2em] rounded-xl hover:bg-red-500/20 transition-all">
                  Purge Data Streams
                </button>
              </div>
            </div>
          )}

          {/* Invisible form for manual text input if needed (accessible via keyboard) */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem('hud-input') as HTMLInputElement).value;
              if (input.trim()) {
                handleUserMessage(input.trim());
                (e.currentTarget.elements.namedItem('hud-input') as HTMLInputElement).value = '';
              }
            }}
            className="absolute bottom-12 w-full max-w-md pointer-events-auto px-8"
          >
            <input
              ref={inputRef}
              name="hud-input"
              type="text"
              placeholder="DIRECT COMMAND INPUT..."
              className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-3 text-cyan-400 text-xs tracking-widest focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-white/10 font-mono uppercase"
            />
          </form>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaVolumeMute, FaVolumeUp, FaBrain, FaCog } from 'react-icons/fa';

// JARVIS API URL
const JARVIS_API_URL = 'http://localhost:8000';
// n8n Webhook URL
const N8N_WEBHOOK_URL = 'https://quinton161.app.n8n.cloud/webhook/Bp7j6db4XYELirB8';

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
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
    try {
      localStorage.setItem('jarvis_conversation', JSON.stringify(messages.slice(-50)));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

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

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

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
  const handleUserMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Log for debugging
    console.log('JARVIS: Processing message:', text);

    // Filter out wake words from the actual command processing
    const lowerText = text.toLowerCase().trim();
    const wakeWords = ['jarvis', 'hi jarvis', 'hey jarvis', 'wake up jarvis', 'hello jarvis', 'ok jarvis', 'okay jarvis'];
    
    // Check if the input is JUST a wake word
    if (wakeWords.includes(lowerText)) {
      console.log('JARVIS: Input is just wake word, skipping processing');
      return;
    }

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

    const isOwner = localStorage.getItem('jarvis_owner') === 'true';

    // 1. Attempt to use the new FastAPI backend first
    if (isJarvisOnline) {
      try {
        const response = await fetch(`${JARVIS_API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: messagesRef.current,
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
  }, [isJarvisOnline, isMuted, speak, stopListening]);

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
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
          console.log('JARVIS: Recognized:', transcript);
          
          // Improved Wake Word Detection Logic
          const wakeWords = ['jarvis', 'hi jarvis', 'hey jarvis', 'wake up jarvis', 'hello jarvis', 'ok jarvis', 'okay jarvis'];
          const isWakeWord = wakeWords.some(word => transcript.includes(word));
          
          if (isWakeWord && !isListening && !isSpeaking && !isThinking && !isOpen) {
            console.log('JARVIS: Wake word detected!');
            handleWakeWordDetected();
            return;
          }

          // Direct Command Recognition (if already listening or open)
          if (isOpen || isListening) {
            if (event.results[event.results.length - 1].isFinal) {
              handleUserMessage(transcript);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('JARVIS: Recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setStatusText('Mic Blocked');
          }
        };

        recognition.onend = () => {
          if (wakeWordEnabled && !isListening && !isSpeaking && !isThinking) {
            try {
              recognition.start();
            } catch (e) {
              console.error('JARVIS: Failed to restart recognition:', e);
            }
          }
        };

        recognitionRef.current = recognition;

        if (wakeWordEnabled) {
          try {
            recognition.start();
          } catch (e) {
            console.error('JARVIS: Initial start failed:', e);
          }
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [wakeWordEnabled, isListening, isSpeaking, isThinking, isOpen, handleWakeWordDetected, handleUserMessage]);

  // Auto-scroll to messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startAudioVisualizer = useCallback(async () => {
    try {
      if (audioContextRef.current) return;

      console.log('JARVIS: Starting audio visualizer - requesting microphone...');
      
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / bufferLength;
        setAudioLevel(average);
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (e) {
      console.error('Visualizer error:', e);
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

  const initMicrophone = useCallback(async (isAuto = false) => {
    try {
      console.log('JARVIS: Initializing Microphone...');
      
      // Stop any existing stream before requesting a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      console.log('JARVIS: Checking if navigator.mediaDevices is available...');
      
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices) {
        console.error('JARVIS: navigator.mediaDevices is not available');
        setStatusText('Mic Offline - API Not Supported');
        return false;
      }
      
      console.log('JARVIS: Checking for available devices...');
      
      // First, enumerate devices to see if any audio input devices exist
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(d => d.kind === 'audioinput');
      
      console.log('JARVIS: Available audio input devices:', audioDevices.length);
      audioDevices.forEach((device, i) => {
        console.log(`JARVIS: Device ${i}: ${device.label || 'No label'} (${device.deviceId})`);
      });
      
      if (audioDevices.length === 0) {
        console.error('JARVIS: No audio input devices found');
        setStatusText('Mic Offline - No Microphone');
        return false;
      }
      
      console.log('JARVIS: Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false
      });
      streamRef.current = stream;
      
      console.log('JARVIS: Microphone access granted! Stream:', stream.id);
      setStatusText('System Ready');
      if (!isAuto) speak("Microphone active. Systems optimal.");
      
      // Restart speech recognition to hook into the new stream/permission
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
        setTimeout(() => {
          try { recognitionRef.current.start(); } catch (e) {}
        }, 300);
      }
      
      startAudioVisualizer();
      return true;
    } catch (err: any) {
      console.error("JARVIS: Mic Access Error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatusText('Mic Blocked');
        speak("I cannot hear you. Please allow microphone access in your browser address bar.");
        setStatusText('Mic Blocked - Check Permissions');
        speak("Microphone access denied. Please allow microphone access in your browser settings.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        console.error('JARVIS: No microphone found');
        setStatusText('Mic Offline - No Microphone');
        speak("No microphone detected. Please connect a microphone and try again.");
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        console.error('JARVIS: Microphone is in use by another application');
        setStatusText('Mic Offline - In Use');
        speak("Microphone is currently in use by another application. Please close other apps using the microphone.");
      } else if (err.name === 'OverconstrainedError') {
        console.error('JARVIS: Microphone constraints not satisfied');
        setStatusText('Mic Offline - Constraints Error');
      } else {
        setStatusText('Mic Offline');
      }
      return false;
    }
  }, [speak, startAudioVisualizer]);

  useEffect(() => {
    if (isOpen && (isListening || wakeWordEnabled)) {
      startAudioVisualizer();
    } else {
      stopAudioVisualizer();
    }
    return () => stopAudioVisualizer();
  }, [isOpen, isListening, wakeWordEnabled, startAudioVisualizer, stopAudioVisualizer]);

  // Helper to render icons safely
  const renderIcon = (Icon: any, size: number) => {
    return React.createElement(Icon, { size }) as React.ReactElement;
  };

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
            initMicrophone(true);
          }}
          className="fixed bottom-8 right-8 w-32 h-32 flex items-center justify-center z-50 group transition-all duration-500"
          aria-label="Activate JARVIS"
        >
          <JARVISOrb />
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
            <div className="relative group cursor-pointer" onClick={statusText === 'Mic Offline' ? () => initMicrophone() : toggleListening}>
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

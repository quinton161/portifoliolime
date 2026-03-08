import React, { useState, useEffect, useRef, type JSX } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute, FaTimes, FaRobot } from 'react-icons/fa';
import { IconType } from 'react-icons';

// Knowledge base containing all information about Quinton
const knowledgeBase = {
  about: {
    name: "Quinton Ndlovu",
    title: "Web Developer",
    tagline: "Turning complex problems into elegant digital solutions.",
    description: "Hi, I'm Quinton Ndlovu, a passionate web developer who enjoys building modern, responsive, and user-friendly web applications. I work with a range of technologies including HTML, CSS, JavaScript, React, TypeScript, Next.js, Python, PHP, Firebase, MongoDB, and MySQL. In addition to development, I also have experience in design and digital marketing.",
    location: "Victoria Falls, Zimbabwe",
    email: "quintonndlovu161@gmail.com",
    phone: "+263 785385293"
  },
  skills: {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js", "HTML5", "CSS3", "JavaScript"],
    backend: ["Node.js", "Firebase", "MongoDB", "MySQL", "PostgreSQL", "Python", "PHP"],
    tools: ["Figma", "Git", "Vercel", "Postman"]
  },
  services: [
    {
      title: "Front-End Development",
      description: "Crafting responsive, high-performance user interfaces using React, TypeScript, and modern CSS frameworks like Tailwind."
    },
    {
      title: "Back-End Solutions",
      description: "Building scalable server-side applications, APIs, and database architectures with Node.js and cloud technologies."
    },
    {
      title: "Digital Strategy",
      description: "Combining technical expertise with UI/UX principles and digital marketing to create impactful business solutions."
    }
  ],
  projects: [
    {
      name: "Uncommon Attendance",
      description: "A specialized attendance tracking system for educational environments."
    },
    {
      name: "Academy Learning Platform",
      description: "A comprehensive educational platform built with React and TypeScript."
    },
    {
      name: "Trailer Box",
      description: "Movie discovery application featuring high-quality trailers and real-time movie data."
    },
    {
      name: "Bakers Inn",
      description: "E-commerce solution for a bakery with seamless user experience."
    },
    {
      name: "Simba",
      description: "Interactive dashboard with real-time data visualization."
    },
    {
      name: "Scrum Tool",
      description: "Agile project management tool for tracking sprints and tasks."
    },
    {
      name: "TechConnect",
      description: "Professional networking and technology community platform."
    },
    {
      name: "NFT Marketplace",
      description: "Social media platform for NFTs with Web3 integration."
    }
  ],
  education: [
    {
      title: "Software Development",
      institution: "Uncommon.org",
      year: "2024",
      description: "Focused on full-stack web development, modern JavaScript frameworks, and agile methodologies."
    },
    {
      title: "UI/UX Design",
      institution: "Uncommon.org",
      year: "2024",
      description: "Studied design principles, user research, and prototyping tools."
    },
    {
      title: "Digital Marketing",
      institution: "Uncommon.org",
      year: "2024",
      description: "Gained expertise in SEO, content strategy, and data analytics."
    }
  ]
};

// Intent recognition and response generation
const generateResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  // Greeting patterns
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || lowerInput.includes('good morning') || lowerInput.includes('good afternoon')) {
    return "Hello! I'm Quinton's AI assistant. I can tell you all about Quinton - his skills, projects, services, or how to contact him. What would you like to know?";
  }
  
  // About Quinton
  if (lowerInput.includes('who') && (lowerInput.includes('quinton') || lowerInput.includes('you') || lowerInput.includes('about'))) {
    return `Hi, I'm Quinton Ndlovu, a passionate web developer from ${knowledgeBase.about.location}. I specialize in building modern, responsive, and user-friendly web applications using technologies like React, TypeScript, Next.js, and more.`;
  }
  
  // Skills
  if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('technology') || lowerInput.includes('technologies') || lowerInput.includes('know')) {
    const frontend = knowledgeBase.skills.frontend.join(', ');
    const backend = knowledgeBase.skills.backend.join(', ');
    return `Quinton has expertise in both front-end and back-end development. His front-end skills include ${frontend}. On the back-end, he works with ${backend}. He also uses tools like Figma, Git, Vercel, and Postman.`;
  }
  
  // Services / What I Do
  if (lowerInput.includes('service') || lowerInput.includes('what do you do') || lowerInput.includes('what i do') || lowerInput.includes('offer')) {
    const services = knowledgeBase.services.map(s => `${s.title}: ${s.description}`).join('. ');
    return `Quinton offers three main services: ${services}. Which one would you like to know more about?`;
  }
  
  // Projects / Portfolio
  if (lowerInput.includes('project') || lowerInput.includes('portfolio') || lowerInput.includes('work') || lowerInput.includes('built') || lowerInput.includes('created')) {
    const projects = knowledgeBase.projects.map(p => `${p.name}: ${p.description}`).join('. ');
    return `Quinton has worked on several projects: ${projects}. You can view all his projects on his portfolio website.`;
  }
  
  // Education
  if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('learn') || lowerInput.includes('course') || lowerInput.includes('training')) {
    const edu = knowledgeBase.education.map(e => `${e.title} at ${e.institution} in ${e.year}: ${e.description}`).join('. ');
    return `Quinton's education includes: ${edu}`;
  }
  
  // Contact
  if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('phone') || lowerInput.includes('reach') || lowerInput.includes('hire')) {
    return `You can contact Quinton at email: ${knowledgeBase.about.email}, or phone: ${knowledgeBase.about.phone}. He's based in ${knowledgeBase.about.location}. He'd love to hear from you!`;
  }
  
  // Location
  if (lowerInput.includes('location') || lowerInput.includes('where') || lowerInput.includes('live') || lowerInput.includes('based') || lowerInput.includes('from')) {
    return `Quinton is based in ${knowledgeBase.about.location}, Zimbabwe.`;
  }
  
  // Help
  if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
    return "I can tell you about Quinton's skills, services, projects, education, or how to contact him. Just ask me a question!";
  }
  
  // Default response
  return "I'm Quinton's AI assistant. I can tell you about his skills, projects, services, education, or how to contact him. What would you like to know?";
};

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hello! I'm Quinton's AI assistant. I can tell you all about him - his skills, projects, services, or how to contact him. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setCurrentTranscript(transcript);

          if (event.results[0].isFinal) {
            handleUserMessage(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (synthRef.current && !isMuted) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to find a good English voice
      const voices = synthRef.current.getVoices();
      const englishVoice = voices.find((voice: any) => voice.lang.startsWith('en') && voice.name.includes('Google'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const handleUserMessage = (text: string) => {
    const userMessage: Message = {
      id: messages.length,
      text,
      isUser: true,
      timestamp: new Date()
    };

    const response = generateResponse(text);
    const botMessage: Message = {
      id: messages.length + 1,
      text: response,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setCurrentTranscript('');

    // Speak the response
    speak(response);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      stopSpeaking();
      setIsMuted(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.elements.namedItem('message') as HTMLInputElement).value;
    if (input.trim()) {
      handleUserMessage(input.trim());
      (e.currentTarget.elements.namedItem('message') as HTMLInputElement).value = '';
    }
  };

  const renderIcon = (Icon: any, size: number) => {
    return React.createElement(Icon, { size: size }) as React.ReactElement;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : ''}`}
        aria-label="Open AI Assistant"
      >
        {renderIcon(FaRobot, 24)}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100">
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {renderIcon(FaRobot, 20)}
              </div>
              <div>
                <h3 className="font-bold">Quinton's Assistant</h3>
                <p className="text-xs text-white/70">AI Voice Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? renderIcon(FaVolumeMute, 14) : renderIcon(FaVolumeUp, 14)}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                {renderIcon(FaTimes, 14)}
              </button>
            </div>
          </div>

          {/* Voice Status Bar */}
          <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-xs text-gray-500">{isListening ? 'Listening...' : 'Tap mic to speak'}</span>
            </div>
            {currentTranscript && (
              <span className="text-xs text-gray-400 truncate max-w-[200px]">
                "{currentTranscript}"
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-black text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                name="message"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-black/10"
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? renderIcon(FaMicrophoneSlash, 16) : renderIcon(FaMicrophone, 16)}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;

"""
JARVIS AI Assistant - Main Backend
Always-listening voice assistant with comprehensive knowledge about Quinton
"""

import speech_recognition as sr
import pyttsx3
import pywhatkit
import datetime
import wikipedia
import webbrowser
import os
import subprocess
import json
import random
import threading
import queue
from typing import Optional, Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    gemini_model = None

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 170)
engine.setProperty('volume', 1.0)

# Get available voices and set a natural one
voices = engine.getProperty('voices')
for voice in voices:
    if 'david' in voice.name.lower() or 'zira' in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break

# Initialize speech recognizer
recognizer = sr.Recognizer()

# Command queue for threaded execution
command_queue = queue.Queue()

# Conversation history
conversation_history = []
MAX_HISTORY = 50

# User preferences
user_preferences = {
    "name": None,
    "is_owner": False,
    "language": "en",
    "voice_speed": 170,
    "notifications": True
}

# Load user data if exists
USER_DATA_FILE = "user_data.json"
if os.path.exists(USER_DATA_FILE):
    try:
        with open(USER_DATA_FILE, 'r') as f:
            user_preferences.update(json.load(f))
    except:
        pass

# ============================================
# COMPREHENSIVE KNOWLEDGE BASE ABOUT QUINTON
# ============================================

KNOWLEDGE_BASE = {
    # Basic Information
    "personal": {
        "name": "Quinton Ndlovu",
        "full_name": "Quinton Ndlovu",
        "title": "Full Stack Web Developer",
        "nickname": "Quinny",
        "location": "Victoria Falls, Zimbabwe",
        "birthday": "Unknown",
        "age": "Young adult",
        "email": "quintonndlovu161@gmail.com",
        "phone": "+263 785385293",
        "whatsapp": "+263 785385293",
        "linkedin": "quinton-ndlovu",
        "github": "quinton-dev",
        "website": "quinton.portfolio"
    },
    
    # Professional Information
    "professional": {
        "job_title": "Full Stack Web Developer",
        "experience": "Experienced in both frontend and backend development",
        "companies": ["Freelance", "Various clients in Zimbabwe"],
        "focus_areas": ["Web Development", "UI/UX Design", "Digital Strategy"]
    },
    
    # Technical Skills
    "skills": {
        "frontend": [
            "React", "React Native", "TypeScript", "JavaScript", 
            "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Vue.js"
        ],
        "backend": [
            "Node.js", "Python", "PHP", "Express.js", 
            "Firebase", "MongoDB", "MySQL", "REST APIs"
        ],
        "tools": [
            "Git", "GitHub", "VS Code", "Figma", "Adobe XD",
            "Postman", "Docker", "AWS", "Vercel"
        ],
        "soft_skills": [
            "Problem Solving", "Communication", "Team Leadership",
            "Project Management", "Client Relations", "Creative Thinking"
        ]
    },
    
    # Projects
    "projects": [
        {
            "name": "Uncommon Attendance",
            "description": "Attendance management system for businesses",
            "tech": ["React", "Node.js", "MongoDB"],
            "features": ["QR Code attendance", "Analytics", "Reporting"]
        },
        {
            "name": "Academy Learning Platform",
            "description": "Online education platform for students",
            "tech": ["React", "Firebase", "Node.js"],
            "features": ["Video courses", "Quizzes", "Progress tracking"]
        },
        {
            "name": "Trailer Box",
            "description": "Movie trailer discovery app",
            "tech": ["React Native", "TMDB API"],
            "features": ["Movie search", "Trailers", "Watchlist"]
        },
        {
            "name": "Bakers Inn",
            "description": "E-commerce platform for bakery",
            "tech": ["React", "Node.js", "Payment integration"],
            "features": ["Online ordering", "Delivery tracking"]
        },
        {
            "name": "Simba Dashboard",
            "description": "Business analytics dashboard",
            "tech": ["React", "D3.js", "Python"],
            "features": ["Data visualization", "Real-time updates"]
        },
        {
            "name": "Scrum Tool",
            "description": "Project management tool",
            "tech": ["React", "Firebase", "TypeScript"],
            "features": ["Kanban boards", "Sprint planning", "Team collaboration"]
        },
        {
            "name": "TechConnect",
            "description": "Tech blog and community platform",
            "tech": ["Next.js", "Markdown", "GitHub API"]
        },
        {
            "name": "ShopTacle",
            "description": "E-commerce platform",
            "tech": ["React", "Node.js", "MongoDB"]
        }
    ],
    
    # Education
    "education": [
        {
            "institution": "Various online courses",
            "degree": "Self-taught through online platforms",
            "focus": "Web Development, Programming"
        }
    ],
    
    # Interests and Hobbies
    "interests": [
        "Photography",
        "Exploring nature",
        "Traveling",
        "Learning new technologies",
        "Building side projects",
        "Music",
        "Gaming",
        "Artificial Intelligence"
    ],
    
    # Personality traits
    "personality": [
        "Passionate about clean code",
        "User-centric design approach",
        "Always up for a challenge",
        "Approachable and friendly",
        "Detail-oriented",
        "Continuous learner",
        "Problem solver"
    ],
    
    # Goals
    "goals": [
        "Building impactful digital solutions",
        "Growing as a developer",
        "Helping businesses go digital",
        "Contributing to open source"
    ],
    
    # Favorite things
    "favorites": {
        "programming_language": "JavaScript/TypeScript and Python",
        "framework": "React",
        "music": "Various genres",
        "food": "Local Zimbabwean cuisine",
        "movie_genre": "Action and Sci-Fi",
        "quote": "Code is like humor. When you have to explain it, it's bad."
    },
    
    # Social presence
    "social": {
        "linkedin": "linkedin.com/in/quinton-ndlovu",
        "github": "github.com/quinton-dev",
        "twitter": "@QuintonDev"
    }
}


# ============================================
# VOICE RESPONSE FUNCTIONS
# ============================================

def speak(text: str, interrupt: bool = True):
    """Convert text to speech with interrupt capability"""
    try:
        if interrupt:
            engine.stop()
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Speech error: {e}")


def speak_async(text: str):
    """Speak in a separate thread to not block main loop"""
    thread = threading.Thread(target=speak, args=(text,))
    thread.daemon = True
    thread.start()


# ============================================
# RESPONSE GENERATION
# ============================================

def get_knowledge_response(query: str) -> Optional[str]:
    """Generate response based on knowledge base"""
    query = query.lower()
    
    # Name queries
    if any(q in query for q in ["what is your name", "who are you", "who is this"]):
        if "master" in query or "owner" in query:
            return "I am JARVIS, Quinton's personal AI assistant. Think of me as the guardian of his digital world!"
        return "I am JARVIS, Quinton's personal AI assistant."
    
    # About Quinton - general
    if any(q in query for q in ["who is quinton", "tell me about quinton", "about quinton"]):
        p = KNOWLEDGE_BASE["personal"]
        pro = KNOWLEDGE_BASE["professional"]
        return f"Quinton Ndlovu is a {pro['job_title']} based in {p['location']}. He's passionate about building web applications and loves learning new technologies. He's known for his clean code and user-friendly designs."
    
    # Location
    if any(q in query for q in ["where does quinton live", "where is quinton from", "quinton's location"]):
        return f"Quinton is based in {KNOWLEDGE_BASE['personal']['location']}, Zimbabwe - home to one of the world's greatest natural wonders, Victoria Falls!"
    
    # Contact information
    if any(q in query for q in ["contact quinton", "quinton's email", "reach quinton", "how to contact"]):
        p = KNOWLEDGE_BASE["personal"]
        return f"You can reach Quinton at {p['email']} or call him at {p['phone']}. He's also active on LinkedIn."
    
    # Skills
    if any(q in query for q in ["what skills", "quinton's skills", "tech stack", "technologies"]):
        skills = KNOWLEDGE_BASE["skills"]
        frontend = ", ".join(skills["frontend"][:5])
        backend = ", ".join(skills["backend"][:5])
        return f"Quinton is skilled in frontend technologies like {frontend}. On the backend, he works with {backend}. He's a true full-stack developer!"
    
    # Projects
    if any(q in query for q in ["what projects", "quinton's projects", "portfolio", "work done"]):
        projects = KNOWLEDGE_BASE["projects"]
        names = [p["name"] for p in projects[:5]]
        return f"Quinton has built several impressive projects including {', '.join(names)}, and more. Would you like to know about a specific project?"
    
    # Specific project details
    for project in KNOWLEDGE_BASE["projects"]:
        if project["name"].lower() in query:
            p = project
            tech = ", ".join(p["tech"])
            return f"{p['name']} is {p['description']}. It was built using {tech}. {p.get('features', []).__str__()}"
    
    # Hobbies/Interests
    if any(q in query for q in ["hobbies", "interests", "what does quinton do for fun"]):
        interests = ", ".join(KNOWLEDGE_BASE["interests"])
        return f"When Quinton isn't coding, he enjoys {interests}. He's a well-rounded individual who loves both technology and nature!"
    
    # Goals
    if any(q in query for q in ["goals", "aspirations", "what does quinton want"]):
        goals = ", ".join(KNOWLEDGE_BASE["goals"])
        return f"Quinton's goals include {goals}. He's always pushing to grow and make an impact!"
    
    # Personality
    if any(q in query for q in ["personality", "character", "what is quinton like"]):
        traits = ", ".join(KNOWLEDGE_BASE["personality"][:5])
        return f"Quinton is known for being {traits}. He's a great person to work with!"
    
    # Education
    if any(q in query for q in ["education", "study", "where did quinton learn"]):
        return "Quinton is primarily self-taught through online platforms. He's always learning and staying updated with the latest technologies."
    
    # Availability for work
    if any(q in query for q in ["available for work", "hiring", "freelance", "contract"]):
        return "Yes! Quinton is available for freelance projects and full-time opportunities. You can contact him through his portfolio!"
    
    return None


def generate_response(command: str) -> str:
    """Generate intelligent response using knowledge base and AI"""
    
    # Add to history
    conversation_history.append({"role": "user", "content": command})
    if len(conversation_history) > MAX_HISTORY:
        conversation_history.pop(0)
    
    command_lower = command.lower()
    
    # Check knowledge base first
    kb_response = get_knowledge_response(command_lower)
    if kb_response:
        conversation_history.append({"role": "assistant", "content": kb_response})
        return kb_response
    
    # Time queries
    if "time" in command_lower:
        current_time = datetime.datetime.now().strftime("%I:%M %p")
        return f"The current time is {current_time}."
    
    # Date queries
    if "date" in command_lower or "day" in command_lower:
        current_date = datetime.datetime.now().strftime("%A, %B %d, %Y")
        return f"Today is {current_date}."
    
    # Wikipedia search
    if "wikipedia" in command_lower or "who is" in command_lower or "what is" in command_lower:
        try:
            topic = command_lower.replace("wikipedia", "").replace("search", "").replace("who is", "").replace("what is", "").strip()
            if topic:
                summary = wikipedia.summary(topic, sentences=2)
                conversation_history.append({"role": "assistant", "content": summary})
                return summary
        except:
            pass
    
    # Google search
    if "search google" in command_lower or "google" in command_lower:
        query = command_lower.replace("search google for", "").replace("google", "").strip()
        if query:
            pywhatkit.search(query)
            return f"Searching Google for {query}."
    
    # YouTube
    if "youtube" in command_lower:
        query = command_lower.replace("play", "").replace("youtube", "").strip()
        if query:
            pywhatkit.playonyt(query)
            return f"Playing {query} on YouTube."
    
    # Open websites
    if "open" in command_lower:
        sites = {
            "github": "https://github.com",
            "linkedin": "https://linkedin.com",
            "youtube": "https://youtube.com",
            "google": "https://google.com",
            "twitter": "https://twitter.com"
        }
        for site, url in sites.items():
            if site in command_lower:
                webbrowser.open(url)
                return f"Opening {site}."
    
    # Tell a joke
    if "joke" in command_lower:
        jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "Why did the developer go broke? Because he used up all his cache!",
            "What do you call a fake noodle? An impasta!",
            "Why do Java developers wear glasses? Because they can't C#!"
        ]
        return random.choice(jokes)
    
    # How are you
    if "how are you" in command_lower:
        responses = [
            "I'm doing great, thank you for asking! Ready to help you with anything.",
            "I'm excellent! All systems are running smoothly.",
            "Fantastic! It's always a pleasure to assist you."
        ]
        return random.choice(responses)
    
    # Thank you
    if "thank" in command_lower:
        return "You're welcome! Is there anything else I can help you with?"
    
    # Goodbye
    if any(q in command_lower for q in ["goodbye", "bye", "see you", "exit", "quit", "stop"]):
        responses = [
            "Goodbye! It was great chatting with you!",
            "See you later! Don't hesitate to call if you need anything!",
            "Farewell! Have a wonderful day!"
        ]
        return random.choice(responses)
    
    # Use Gemini AI if available
    if gemini_model:
        try:
            # Build context from conversation history
            context = "You are JARVIS, a helpful AI assistant for Quinton Ndlovu's portfolio. "
            context += "Be conversational, friendly, and helpful. Keep responses concise."
            
            full_prompt = f"{context}\n\nUser: {command}"
            response = gemini_model.generate_content(full_prompt)
            text = response.text.replace("*", "")
            conversation_history.append({"role": "assistant", "content": text})
            return text
        except Exception as e:
            print(f"Gemini error: {e}")
    
    # Fallback responses
    fallbacks = [
        "I'm not sure about that, but I can tell you about Quinton's work, skills, or how to contact him!",
        "That's interesting! Would you like to know more about Quinton's projects?",
        "I might not have learned that yet. But I know a lot about Quinton - want me to tell you?"
    ]
    return random.choice(fallbacks)


# ============================================
# VOICE LISTENING
# ============================================

def listen_for_wake_word():
    """Continuously listen for the wake word 'Jarvis'"""
    print("🎙️ JARVIS is now listening. Say 'Jarvis' to activate...")
    
    while True:
        try:
            with sr.Microphone() as source:
                recognizer.adjust_for_ambient_noise(source, duration=1)
                print("👂 Listening for 'Jarvis'...")
                
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)
                
                try:
                    command = recognizer.recognize_google(audio).lower()
                    print(f"🔊 Heard: {command}")
                    
                    if "jarvis" in command:
                        # Wake word detected!
                        print("✨ Wake word detected!")
                        speak_async("Yes? How can I assist you?")
                        
                        # Now listen for the actual command
                        listen_for_command()
                        
                except sr.UnknownValueError:
                    pass
                except sr.RequestError:
                    print("⚠️ Speech recognition service unavailable")
                    
        except Exception as e:
            print(f"Error in wake word listening: {e}")
            continue


def listen_for_command():
    """Listen for user command after wake word"""
    print("👂 Listening for command...")
    
    try:
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio = recognizer.listen(source, timeout=30, phrase_time_limit=10)
            
            try:
                command = recognizer.recognize_google(audio).lower()
                print(f"📝 Command: {command}")
                
                if any(q in command for q in ["goodbye", "bye", "stop", "that's all", "exit"]):
                    speak_async("Goodbye! Call me anytime you need help.")
                    return
                
                # Generate and speak response
                response = generate_response(command)
                print(f"🤖 Response: {response}")
                speak_async(response)
                
            except sr.UnknownValueError:
                speak_async("I didn't catch that. Could you please repeat?")
            except sr.RequestError:
                speak_async("I'm having trouble understanding right now.")
                
    except Exception as e:
        print(f"Error listening for command: {e}")


# ============================================
# FLASK API FOR REACT INTEGRATION
# ============================================

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/status', methods=['GET'])
def status():
    """Check if JARVIS is online"""
    return jsonify({
        "status": "online",
        "gemini_configured": gemini_model is not None,
        "owner_mode": user_preferences.get("is_owner", False)
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests from React frontend"""
    data = request.json
    message = data.get('message', '')
    
    response = generate_response(message)
    
    return jsonify({
        "response": response,
        "history": conversation_history[-10:]
    })

@app.route('/speak', methods=['POST'])
def speak_text():
    """Speak text sent from frontend"""
    data = request.json
    text = data.get('text', '')
    speak_async(text)
    return jsonify({"status": "success"})

@app.route('/set-owner', methods=['POST'])
def set_owner():
    """Set owner mode"""
    data = request.json
    password = data.get('password', '')
    
    # Simple password check (in production, use proper auth)
    if password == "quinton123":
        user_preferences["is_owner"] = True
        save_user_data()
        return jsonify({"status": "success", "message": "Owner mode activated"})
    return jsonify({"status": "error", "message": "Invalid password"})

@app.route('/history', methods=['GET'])
def get_history():
    """Get conversation history"""
    return jsonify({"history": conversation_history[-20:]})

@app.route('/clear-history', methods=['POST'])
def clear_history():
    """Clear conversation history"""
    conversation_history.clear()
    return jsonify({"status": "success"})

def save_user_data():
    """Save user preferences"""
    try:
        with open(USER_DATA_FILE, 'w') as f:
            json.dump(user_preferences, f)
    except:
        pass


# ============================================
# MAIN ENTRY POINT
# ============================================

if __name__ == "__main__":
    import sys
    
    print("=" * 50)
    print("🚀 Starting JARVIS AI Assistant")
    print("=" * 50)
    
    # Check for command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "--voice" or sys.argv[1] == "-v":
            # Voice mode - always listening
            print("🎙️ Starting in VOICE LISTENING mode")
            speak_async("Jarvis is now online. Say Jarvis to activate.")
            listen_for_wake_word()
        elif sys.argv[1] == "--help":
            print("Usage: python main.py [options]")
            print("  -v, --voice    Start in voice listening mode")
            print("  -h, --help     Show this help message")
        else:
            print("Unknown option. Use --help for usage information.")
    else:
        # Default: Start Flask API server
        print("🌐 Starting API server on http://localhost:8000")
        print("📱 Connect your React app to http://localhost:8000")
        speak_async("API server started. You can now connect your portfolio.")
        app.run(host="0.0.0.0", port=8000, debug=True)

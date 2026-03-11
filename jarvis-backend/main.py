from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import httpx
from google import genai
from google.genai import types
import subprocess
import webbrowser
import pyautogui
import psutil
import platform
import screen_brightness_control as sbc
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
import math

app = FastAPI(title="J.A.R.V.I.S. Core API")

# Comprehensive local knowledge base about Quinton
KNOWLEDGE_BASE = {
    "personal": {
        "name": "Quinton Ndlovu",
        "title": "Full Stack Web Developer & Digital Creator",
        "location": "Victoria Falls, Zimbabwe",
        "email": "quintonndlovu161@gmail.com",
        "phone": "+263 785385293",
        "whatsapp": "+263 785385293",
        "linkedin": "https://www.linkedin.com/in/quinton-ndlovu-40b559341/",
        "github": "quinton-dev",
        "portfolio": "https://portifoliolime-dz.vercel.app/",
        "organization": "Uncommon.org",
        "bio": "Prominent Full Stack Web Developer based in Victoria Falls, Zimbabwe. Lead developer at Uncommon, specializing in creating high-performance, clean-coded digital solutions that drive impact."
    },
    "skills": {
        "frontend": ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Vue.js", "Framer Motion"],
        "backend": ["Node.js", "Python", "PHP", "Express.js", "Firebase", "MongoDB", "MySQL", "PostgreSQL"],
        "tools": ["Git", "GitHub", "VS Code", "Figma", "Docker", "AWS", "n8n (Automation)"]
    },
    "projects": [
        {"name": "Uncommon Attendance", "description": "Advanced attendance management system for Uncommon.org staff and students.", "tech": ["React", "Node.js", "MongoDB", "Express"]},
        {"name": "Academy Learning Platform", "description": "Comprehensive online education platform with interactive courses.", "tech": ["React", "Firebase", "Tailwind"]},
        {"name": "Trailer Box", "description": "Mobile-first movie trailer discovery application.", "tech": ["React Native", "TMDB API"]},
        {"name": "Bakers Inn", "description": "Full-scale E-commerce solution for a major bakery chain.", "tech": ["React", "Node.js", "Stripe"]},
        {"name": "Simba Dashboard", "description": "Sophisticated business analytics and data visualization dashboard.", "tech": ["React", "D3.js", "Recharts"]},
        {"name": "TechConnect", "description": "Modern technology blog platform with markdown support.", "tech": ["Next.js", "Markdown", "Vercel"]},
        {"name": "ShopTacle", "description": "High-performance e-commerce platform with intuitive UX.", "tech": ["React", "Node.js", "Redux"]}
    ],
    "services": [
        {"title": "Full Stack Web Development", "description": "End-to-end development of scalable web applications using the latest tech stacks."},
        {"title": "UI/UX Design & Implementation", "description": "Creating beautiful, user-centric interfaces that provide exceptional digital experiences."},
        {"title": "Task Automation & Workflows", "description": "Integrating systems like n8n to automate complex business processes and increase efficiency."},
        {"title": "Technical Consulting", "description": "Helping organizations choose the right technology and architectural path for their digital products."}
    ],
    "achievements": [
        "Lead Developer at Uncommon.org, driving technological education and employment initiatives.",
        "Built and deployed multiple production-grade applications for regional businesses.",
        "Expertise in bridging the gap between design and high-performance engineering.",
        "Based in the world-renowned Victoria Falls, contributing to the growing tech hub in Zimbabwe."
    ],
    "interests": ["Photography", "Exploring nature in Victoria Falls", "Traveling", "Learning new tech", "AI/ML", "Music production", "Gaming"],
    "personality": ["Elite technical expertise", "Intelligent and witty", "Slightly British professional tone", "Passionate about clean code", "Continuous learner", "Impact-driven developer"]
}


def generate_local_response(message: str, user_status: str) -> dict:
    """Generate response using local knowledge base when API is unavailable"""
    lower_msg = message.lower()
    is_master = user_status == "Master"
    
    # Greetings
    if any(word in lower_msg for word in ["hello", "hi", "hey", "good morning", "good evening", "good afternoon"]):
        if is_master:
            return {"response": "Good day, Master Quinton. All systems are operational. How may I assist you today?", "source": "local_ai"}
        return {"response": "Hello! I'm JARVIS. How can I assist you today?", "source": "local_ai"}
    
    # About Quinton
    if any(word in lower_msg for word in ["who are you", "what are you", "about yourself"]):
        return {"response": "I am JARVIS, the personal AI assistant for Quinton Ndlovu. I'm a sophisticated AI designed to help answer questions about Quinton and assist with various tasks on your computer.", "source": "local_ai"}
    
    if any(word in lower_msg for word in ["who is quinton", "about quinton", "quinton's bio"]):
        return {"response": f"{KNOWLEDGE_BASE['personal']['bio']} He is the lead developer at {KNOWLEDGE_BASE['personal']['organization']}.", "source": "local_ai"}
    
    # Skills
    if any(word in lower_msg for word in ["skill", "tech", "stack", "technology"]):
        skills = f"Quinton's technical skills include:\nFrontend: {', '.join(KNOWLEDGE_BASE['skills']['frontend'])}\nBackend: {', '.join(KNOWLEDGE_BASE['skills']['backend'])}\nTools: {', '.join(KNOWLEDGE_BASE['skills']['tools'])}"
        return {"response": skills, "source": "local_ai"}
    
    # Projects
    if any(word in lower_msg for word in ["project", "portfolio", "work", "built", "created"]):
        projects_text = "Quinton has built several notable projects:\n"
        for p in KNOWLEDGE_BASE['projects']:
            projects_text += f"• {p['name']}: {p['description']} ({', '.join(p['tech'])})\n"
        return {"response": projects_text, "source": "local_ai"}
    
    # Contact
    if any(word in lower_msg for word in ["contact", "email", "phone", "reach"]):
        return {"response": f"You can reach Quinton at:\nEmail: {KNOWLEDGE_BASE['personal']['email']}\nPhone: {KNOWLEDGE_BASE['personal']['phone']}\nWhatsApp: {KNOWLEDGE_BASE['personal']['whatsapp']}\nLinkedIn: {KNOWLEDGE_BASE['personal']['linkedin']}", "source": "local_ai"}
    
    # Location
    if any(word in lower_msg for word in ["location", "where", "based", "city", "country"]):
        return {"response": f"Quinton is based in {KNOWLEDGE_BASE['personal']['location']}.", "source": "local_ai"}
    
    # Organization
    if any(word in lower_msg for word in ["organization", "company", "work at", "uncommon"]):
        return {"response": f"Quinton works at {KNOWLEDGE_BASE['personal']['organization']}, where he serves as Lead Developer, driving technological education and employment initiatives.", "source": "local_ai"}
    
    # Services
    if any(word in lower_msg for word in ["service", "offer", "provide"]):
        services_text = "Quinton offers the following services:\n"
        for s in KNOWLEDGE_BASE['services']:
            services_text += f"• {s['title']}: {s['description']}\n"
        return {"response": services_text, "source": "local_ai"}
    
    # Achievements
    if any(word in lower_msg for word in ["achievement", "accomplish", "award"]):
        achievements_text = "Quinton's key achievements:\n"
        for a in KNOWLEDGE_BASE['achievements']:
            achievements_text += f"• {a}\n"
        return {"response": achievements_text, "source": "local_ai"}
    
    # Interests
    if any(word in lower_msg for word in ["interest", "hobby"]):
        return {"response": f"Quinton's interests include: {', '.join(KNOWLEDGE_BASE['interests'])}", "source": "local_ai"}
    
    # Default response
    if is_master:
        return {"response": f"I understand your query, Master. However, I'm currently operating in offline mode with synchronized knowledge. Could you rephrase your question? I know about Quinton's skills, projects, contact info, and more.", "source": "local_ai"}
    return {"response": "I understand your question. I'm JARVIS, currently operating in offline mode. I can tell you about Quinton's skills, projects, services, contact information, and more. What would you like to know?", "source": "local_ai"}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
GEMINI_API_KEY = "AIzaSyDyUuYgUSsX-C5ha8uvLpOC4kyUxZwJBZw"
N8N_WEBHOOK_URL = "https://quinton161.app.n8n.cloud/webhook/Bp7j6db4XYELirB8"

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-2.0-flash"

class ChatMessage(BaseModel):
    id: int
    text: str
    isUser: bool
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]
    user_status: Optional[str] = "Guest"

@app.get("/status")
async def status():
    return {"status": "online", "version": "1.0.0", "system": "J.A.R.V.I.S. Core"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        lower_msg = request.message.lower()
        
        # 1. PC CONTROL LOGIC (UNIVERSAL & SYSTEM)
        # ---------------------------------------------------------
        
        # --- UNIVERSAL APP OPENER ---
        if "open" in lower_msg:
            app_to_open = lower_msg.replace("open", "").strip()
            
            # List of specific mappings for common apps
            known_apps = {
                "notepad": "notepad",
                "calculator": "calc",
                "chrome": "chrome",
                "browser": "https://www.google.com",
                "code": "code",
                "vscode": "code",
                "spotify": "spotify",
                "terminal": "cmd",
                "powershell": "powershell",
                "settings": "ms-settings:",
                "word": "winword",
                "excel": "excel",
                "powerpoint": "powerpnt",
                "control panel": "control",
                "task manager": "taskmgr",
                "file explorer": "explorer",
                "explorer": "explorer",
            }
            
            # Social media and website URLs
            social_urls = {
                "youtube": "https://www.youtube.com",
                "instagram": "https://www.instagram.com",
                "facebook": "https://www.facebook.com",
                "whatsapp": "https://web.whatsapp.com",
                "gmail": "https://mail.google.com",
                "tiktok": "https://www.tiktok.com",
                "twitter": "https://twitter.com",
                "x": "https://x.com",
                "linkedin": "https://linkedin.com",
                "github": "https://github.com",
                "reddit": "https://reddit.com",
                "netflix": "https://netflix.com",
            }
            
            # Check known apps first
            if app_to_open in known_apps:
                target = known_apps[app_to_open]
                if target.startswith("http") or target.startswith("ms-settings:"):
                    webbrowser.open(target)
                else:
                    subprocess.Popen(target, shell=True)
                return {"response": f"Initializing {app_to_open} for you, Sir.", "source": "pc_control"}
            
            # Check social URLs
            if app_to_open in social_urls:
                webbrowser.open(social_urls[app_to_open])
                return {"response": f"Opening {app_to_open} in your browser, Sir.", "source": "pc_control"}
            
            # Check if input is already a URL
            if app_to_open.startswith("http://") or app_to_open.startswith("https://"):
                webbrowser.open(app_to_open)
                return {"response": f"Opening the URL, Sir.", "source": "pc_control"}
            
            # Universal fallback using Windows 'start'
            try:
                # 'start' is very powerful on Windows and can open most registered apps and files
                subprocess.Popen(f"start {app_to_open}", shell=True)
                return {"response": f"Initializing {app_to_open} via universal protocols.", "source": "pc_control"}
            except Exception as e:
                return {"response": f"Couldn't open {app_to_open}. {str(e)}", "source": "pc_control"}

        # --- SYSTEM AUTOMATION ---
        if "system" in lower_msg or "pc" in lower_msg or "computer" in lower_msg:
            if "shutdown" in lower_msg:
                # os.system("shutdown /s /t 60") # 60 sec delay for safety during dev
                return {"response": "Protocol initialized. System shutdown in 60 seconds. You can say 'abort shutdown' to cancel.", "source": "pc_control"}
            elif "restart" in lower_msg:
                # os.system("shutdown /r /t 60")
                return {"response": "Protocol initialized. System restart in 60 seconds. You can say 'abort shutdown' to cancel.", "source": "pc_control"}
            elif "lock" in lower_msg:
                import ctypes
                ctypes.windll.user32.LockWorkStation()
                return {"response": "Systems locked. Security protocol active.", "source": "pc_control"}
            elif "sleep" in lower_msg:
                os.system("rundll32.exe powrprof.dll,SetSuspendState 0,1,0")
                return {"response": "Entering sleep mode. I'll be here when you return.", "source": "pc_control"}
            elif "abort" in lower_msg or "cancel" in lower_msg:
                os.system("shutdown /a")
                return {"response": "System protocols aborted. Normal operations resumed.", "source": "pc_control"}

        # --- VOLUME CONTROL ---
        if "volume" in lower_msg:
            try:
                # Try using pycaw with new API
                from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
                
                try:
                    # Newer pycaw API
                    speakers = AudioUtilities.GetSpeakers()
                    volume = speakers.QueryInterface(IAudioEndpointVolume)
                except:
                    # Fallback for older API
                    devices = AudioUtilities.GetSpeakers()
                    interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
                    volume = interface.QueryInterface(IAudioEndpointVolume)
                
                if "up" in lower_msg or "increase" in lower_msg:
                    current_vol = volume.GetMasterVolumeLevelScalar()
                    volume.SetMasterVolumeLevelScalar(min(1.0, current_vol + 0.1), None)
                    return {"response": "Volume increased by 10%.", "source": "pc_control"}
                elif "down" in lower_msg or "decrease" in lower_msg:
                    current_vol = volume.GetMasterVolumeLevelScalar()
                    volume.SetMasterVolumeLevelScalar(max(0.0, current_vol - 0.1), None)
                    return {"response": "Volume decreased by 10%.", "source": "pc_control"}
                elif "mute" in lower_msg:
                    volume.SetMute(1, None)
                    return {"response": "Systems muted.", "source": "pc_control"}
                elif "unmute" in lower_msg:
                    volume.SetMute(0, None)
                    return {"response": "Systems unmuted.", "source": "pc_control"}
            except Exception as e:
                # Fallback to system command
                import winsound
                return {"response": "Volume control unavailable on this system.", "source": "pc_control"}

        # --- BRIGHTNESS CONTROL ---
        if "brightness" in lower_msg:
            try:
                current = sbc.get_brightness()[0]
                if "up" in lower_msg or "increase" in lower_msg:
                    sbc.set_brightness(min(100, current + 20))
                    return {"response": "Display brightness increased.", "source": "pc_control"}
                elif "down" in lower_msg or "decrease" in lower_msg:
                    sbc.set_brightness(max(0, current - 20))
                    return {"response": "Display brightness decreased.", "source": "pc_control"}
            except:
                return {"response": "I'm unable to adjust brightness on this hardware configuration.", "source": "pc_control"}

        # --- MEDIA CONTROL ---
        if "play" in lower_msg or "pause" in lower_msg or "stop" in lower_msg:
            pyautogui.press('playpause')
            return {"response": "Media state toggled.", "source": "pc_control"}
        if "next" in lower_msg and "track" in lower_msg:
            pyautogui.press('nexttrack')
            return {"response": "Skipping to next track.", "source": "pc_control"}

        # --- SCREEN CONTROL ---
        if "minimize all" in lower_msg or "show desktop" in lower_msg:
            pyautogui.hotkey('win', 'd')
            return {"response": "Minimizing all active windows. Clear view established.", "source": "pc_control"}
        
        if "screenshot" in lower_msg:
            pyautogui.screenshot("screenshot.png")
            return {"response": "Screenshot captured and saved to core directory.", "source": "pc_control"}

        # --- SYSTEM INFO ---
        if "system status" in lower_msg or "cpu" in lower_msg or "memory" in lower_msg:
            cpu_usage = psutil.cpu_percent()
            mem = psutil.virtual_memory()
            return {
                "response": f"Core Systems Report: CPU Usage at {cpu_usage}%. Available Memory: {mem.available // (1024*1024)} MB. All sub-processors functioning within normal parameters.",
                "source": "pc_control"
            }

        # 2. Check for Automation Keywords (n8n)
        # ---------------------------------------------------------
        automation_keywords = ['send', 'schedule', 'remind', 'create', 'automation', 'workflow', 'task']
        
        if any(kw in lower_msg for kw in automation_keywords):
            async with httpx.AsyncClient() as http_client:
                n8n_resp = await http_client.post(
                    N8N_WEBHOOK_URL,
                    json={
                        "message": request.message,
                        "user": request.user_status,
                        "source": "JARVIS_BACKEND"
                    }
                )
                if n8n_resp.status_code == 200:
                    data = n8n_resp.json()
                    if isinstance(data, dict) and "message" in data:
                        return {"response": data["message"], "source": "n8n"}

        # 2. AI Processing with Gemini with fallback to local knowledge base
        try:
            history_context = []
            for m in request.history[-10:]:
                role = "user" if m.isUser else "model"
                history_context.append(types.Content(role=role, parts=[types.Part(text=m.text)]))

            # System context injection
            system_instruction = f"""You are JARVIS, the highly advanced personal AI assistant for Quinton Ndlovu.
            Quinton is a world-class Full Stack Developer and Entrepreneur based in Victoria Falls, Zimbabwe.
            
            Detailed Knowledge Base about Quinton:
            - Role: Lead Developer at Uncommon.org, specialized in React, TypeScript, Node.js, and Python.
            - Core Skills: Full-stack development, UI/UX design, and Digital Strategy.
            - Notable Projects: 
                * Uncommon Attendance: High-precision tracking system for educational institutions.
                * Trailer Box: Cinematic movie discovery platform with real-time data.
                * Bakers Inn: Seamless e-commerce ordering system for premium bakeries.
                * Simba: High-performance data visualization dashboard.
                * TechConnect: Professional networking community for tech collaboration.
            - Background: Studied Software Development, UI/UX, and Digital Marketing at Uncommon.org in 2024.
            - Personality: Sophisticated, witty, and highly efficient. Like the JARVIS from Iron Man, you are fiercely loyal to 'Master Quinton' but professional with all guests.
            - Contact: quintonndlovu161@gmail.com | +263 785385293
            
            You are currently running on his dedicated FastAPI backend with full OS control capabilities.
            Master Status: {request.user_status == 'Master'}
            
            If Master Status is True, greet him as 'Master Quinton' or 'Sir'. Be ready to execute PC commands immediately.
            """
            
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=history_context + [types.Content(role="user", parts=[types.Part(text=request.message)])],
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                )
            )
            return {"response": response.text.replace("*", ""), "source": "gemini"}
        
        except Exception as api_error:
            # API failed - use local knowledge base
            print(f"API Error: {api_error}")
            return generate_local_response(request.message, request.user_status)

    except Exception as e:
        print(f"Backend Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

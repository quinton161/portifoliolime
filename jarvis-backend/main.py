"""
Quinton assistant API — local portfolio knowledge only (no OpenAI / Gemini required).
Run: pip install -r requirements.txt && uvicorn main:app --reload --host 127.0.0.1 --port 8000
"""
from __future__ import annotations

import os
import re
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import httpx
except ImportError:
    httpx = None  # type: ignore

# -----------------------------------------------------------------------------
# Knowledge base (keep in sync with src/components/VoiceAssistant.tsx)
# -----------------------------------------------------------------------------
KNOWLEDGE_BASE = {
    "personal": {
        "name": "Quinton Ndlovu",
        "title": "Full Stack Web Developer & Digital Creator",
        "location": "Victoria Falls, Zimbabwe",
        "email": "quintonndlovu161@gmail.com",
        "phone": "+263 785385293",
        "whatsapp": "+263 785385293",
        "linkedin": "https://www.linkedin.com/in/quinton-ndlovu-40b559341/",
        "github": "https://github.com/quinton-dev",
        "portfolio": "https://portifoliolime-dz.vercel.app/",
        "organization": "Uncommon.org",
        "bio": (
            "Full Stack Web Developer based in Victoria Falls, Zimbabwe. Lead Developer at "
            "Uncommon.org, shipping high-performance, clean-coded products that move education, "
            "commerce, and operations forward."
        ),
        "tagline": (
            "I build modern web apps, learning platforms, and automation — from prototype to production."
        ),
        "education": (
            "Software development and digital strategy through Uncommon.org and continuous hands-on work "
            "on real client and internal products."
        ),
        "focusAreas": [
            "React / TypeScript product engineering",
            "Education and org tooling at Uncommon",
            "E‑commerce, dashboards, and integrations",
            "Workflow automation (e.g. n8n)",
        ],
        "values": (
            "Readable architecture, accessible UI, honest timelines, and measurable outcomes for users "
            "and stakeholders."
        ),
    },
    "skills": {
        "frontend": [
            "React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS",
            "Next.js", "Vue.js", "Framer Motion",
        ],
        "backend": [
            "Node.js", "Python", "PHP", "Express.js", "Firebase",
            "MongoDB", "MySQL", "PostgreSQL",
        ],
        "tools": [
            "Git", "GitHub", "VS Code", "Figma", "Docker", "AWS", "n8n (Automation)",
        ],
    },
    "projects": [
        {"name": "Uncommon Attendance", "description": "Attendance management for Uncommon.org staff and students.", "tech": ["React", "Node.js", "MongoDB", "Express"]},
        {"name": "Academy Learning Platform", "description": "Online education platform with interactive courses.", "tech": ["React", "Firebase", "Tailwind"]},
        {"name": "Trailer Box", "description": "Mobile-first movie trailer discovery app.", "tech": ["React Native", "TMDB API"]},
        {"name": "Bakers Inn", "description": "E-commerce for a major bakery chain.", "tech": ["React", "Node.js", "Stripe"]},
        {"name": "Simba Dashboard", "description": "Business analytics and data visualization.", "tech": ["React", "D3.js", "Recharts"]},
        {"name": "TechConnect", "description": "Tech blog platform with markdown.", "tech": ["Next.js", "Markdown", "Vercel"]},
        {"name": "ShopTacle", "description": "E-commerce platform with polished UX.", "tech": ["React", "Node.js", "Redux"]},
    ],
    "services": [
        {"title": "Full Stack Web Development", "description": "End-to-end scalable web applications."},
        {"title": "UI/UX Design & Implementation", "description": "Interfaces that feel as good as they look."},
        {"title": "Task Automation & Workflows", "description": "n8n and integrations to save time."},
        {"title": "Technical Consulting", "description": "Architecture and technology choices for teams."},
    ],
    "achievements": [
        "Lead Developer at Uncommon.org.",
        "Multiple production apps for regional businesses.",
        "Bridges design and engineering.",
        "Victoria Falls–based; growing the local tech scene.",
    ],
    "interests": [
        "Photography", "Nature in Victoria Falls", "Travel", "New tech", "AI/ML",
        "Music production", "Gaming",
    ],
}

N8N_WEBHOOK_URL = os.environ.get("N8N_WEBHOOK_URL", "").strip()

app = FastAPI(title="Portfolio Assistant API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    id: int
    text: str
    isUser: bool
    timestamp: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    user_status: Optional[str] = "Guest"


def _normalize(msg: str) -> str:
    return re.sub(r"\s+", " ", msg.lower().strip())


def _word_set(text: str) -> set:
    return {w for w in re.findall(r"[a-z0-9']+", _normalize(text)) if len(w) > 1}



def try_automation_webhook(message: str, user_status: str) -> Optional[str]:
    if not N8N_WEBHOOK_URL or httpx is None:
        return None
    keys = ("send ", "schedule", "remind", "workflow", "automation", " n8n")
    low = message.lower()
    if not any(k in low for k in keys):
        return None
    try:
        with httpx.Client(timeout=15.0) as client:
            r = client.post(
                N8N_WEBHOOK_URL,
                json={"message": message, "user": user_status, "source": "portfolio_api"},
            )
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, dict) and data.get("message"):
                return str(data["message"])
    except Exception:
        pass
    return None


def compose_local_answer(message: str, user_status: str) -> Tuple[str, str]:
    """
    Returns (response_text, source_tag).
    Pure rules + knowledge — no external LLM. Tone: clear and friendly; assistant name is Quinton (creator: Quinton Ndlovu).
    """
    raw = message.strip()
    low = _normalize(raw)
    ws = _word_set(raw)
    master = user_status == "Master"

    if not low:
        return (
            "I'm here. Ask about Quinton's background, projects, stack, or how to get in touch — "
            "I answer from this site's knowledge.",
            "local",
        )

    # --- Time / date ---
    if any(p in low for p in ("what time", "current time", "what's the time")):
        now = datetime.now(timezone.utc).astimezone()
        return (f"Local time is {now.strftime('%H:%M')} on {now.strftime('%A, %d %B %Y')}.", "local")

    if any(p in low for p in ("today's date", "what date", "what day")):
        now = datetime.now(timezone.utc).astimezone()
        return (f"Today is {now.strftime('%A, %d %B %Y')}.", "local")

    # --- Thanks / bye ---
    if ws & {"thanks", "thank", "thx", "cheers"} or "thank you" in low:
        if master:
            return (
                "You're welcome, Quinton — happy to help. Want to go deeper on anything?",
                "local",
            )
        return (
            "Glad to help! If you want more detail, try projects, skills, or contact.",
            "local",
        )
    if ws & {"bye", "goodbye", "exit", "later"}:
        return (
            "Take care — say Jarvis anytime if you want hands-free help on this site again.",
            "local",
        )

    # --- Greetings ---
    greet_hits = sum(
        1
        for w in (
            "hello", "hi", "hey", "good", "morning", "afternoon", "evening",
            "greetings", "yo", "sup",
        )
        if w in low
    )
    if greet_hits and len(ws) <= 6:
        if master:
            return (
                "Hey — I'm Quinton, your on-site assistant. Want to know about my creator or prep something for visitors?",
                "local",
            )
        return (
            "Hi — I'm Quinton. Want to know about my creator, Quinton Ndlovu? I answer from his portfolio data on this server "
            "(no cloud key required for basics). What would you like to know?",
            "local",
        )

    # --- Identity ---
    if any(p in low for p in ("who are you", "what are you", "your name")):
        return (
            "I'm Quinton — the assistant on this site, here to talk about my creator Quinton Ndlovu's work. "
            "This server holds his knowledge base; the browser can add OpenAI for deeper chat if you configure it.",
            "local",
        )

    p = KNOWLEDGE_BASE["personal"]

    if any(
        x in low
        for x in (
            "who is quinton",
            "about quinton",
            "tell me about quinton",
            "quinton ndlovu",
        )
    ) or ("quinton" in low and any(x in low for x in ("who", "about", "bio", "background"))):
        focus = ", ".join(p.get("focusAreas", []))
        return (
            f"{p['name']} — {p['title']} in {p['location']}. {p['bio']} "
            f"{p.get('tagline', '')} "
            f"He works at {p['organization']}. Focus areas: {focus}. "
            f"Values: {p.get('values', '')}",
            "local",
        )

    if any(x in low for x in ("skill", "tech", "stack", "technologies", "languages", "framework")):
        s = KNOWLEDGE_BASE["skills"]
        return (
            "Quinton's toolkit: "
            f"Frontend — {', '.join(s['frontend'])}. "
            f"Backend — {', '.join(s['backend'])}. "
            f"Tools — {', '.join(s['tools'])}.",
            "local",
        )

    if any(x in low for x in ("project", "portfolio", "work", "built", "case study")):
        lines = [f"• {pr['name']}: {pr['description']}" for pr in KNOWLEDGE_BASE["projects"]]
        return ("Notable work:\n" + "\n".join(lines), "local")

    if any(x in low for x in ("contact", "email", "reach", "phone", "whatsapp", "hire", "collab")):
        gh = p.get("github", "")
        return (
            f"Reach Quinton: {p['email']}, phone/WhatsApp {p['phone']}, "
            f"LinkedIn {p['linkedin']}, GitHub {gh}. Portfolio: {p['portfolio']}.",
            "local",
        )

    if any(x in low for x in ("location", "where", "based", "city", "country", "victoria")):
        return (f"Quinton is based in {p['location']}.", "local")

    if "uncommon" in low or ("work" in low and "where" in low):
        return (
            f"He's Lead Developer at {p['organization']}, focused on education and employment through software.",
            "local",
        )

    if any(x in low for x in ("service", "offer", "do you do", "what does he")):
        bits = [f"• {s['title']}: {s['description']}" for s in KNOWLEDGE_BASE["services"]]
        return ("Services:\n" + "\n".join(bits), "local")

    if any(x in low for x in ("achievement", "accomplish", "award")):
        return (
            "Highlights:\n"
            + "\n".join(f"• {a}" for a in KNOWLEDGE_BASE["achievements"]),
            "local",
        )

    if any(x in low for x in ("hobby", "hobbies", "interest", "interests", "for fun")):
        return (
            f"Outside work: {', '.join(KNOWLEDGE_BASE['interests'])}.",
            "local",
        )

    # --- Light keyword overlap for vague questions mentioning Quinton ---
    if "quinton" in low:
        return (
            "Quinton is a full-stack developer in Victoria Falls and Lead Developer at Uncommon.org — "
            f"({p.get('tagline', 'modern web apps and automation.')}) "
            "Ask for projects, stack, contact, or services and I'll narrow it down.",
            "local",
        )

    # --- Help / default ---
    hint = (
        "I pull answers from this portfolio's data — bio, stack, projects, services, interests, contact. "
        "Try: “What projects has Quinton shipped?” or “How do I contact him?”"
    )
    if master:
        return (
            "I'm not seeing a rule-based match for that, Quinton — want to drill into projects, stack, "
            "story, or contact instead?",
            "local",
        )
    return (hint, "local")


@app.get("/status")
async def status():
    return {
        "status": "online",
        "version": "2.0",
        "mode": "local-knowledge",
        "openai_required": False,
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        user = request.user_status or "Guest"
        msg = request.message.strip()
        if not msg:
            raise HTTPException(status_code=400, detail="message required")

        auto = try_automation_webhook(msg, user)
        if auto:
            return {"response": auto, "source": "n8n"}

        text, source = compose_local_answer(msg, user)
        return {"response": text, "source": source}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)

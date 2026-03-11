# JARVIS AI Assistant 🎙️

Your personal AI assistant that listens when you call its name!

## Features

- **Wake Word Activation** - Say "Jarvis" to activate (in both Python and React!)
- **Always Listening** - Enable the wake word feature and Jarvis will respond when called
- **Comprehensive Knowledge** - Knows everything about Quinton (skills, projects, contact info, interests, etc.)
- **Voice Interaction** - Speak naturally and get spoken responses
- **Text Chat** - Type messages in the chat interface
- **Memory** - Remembers conversation history
- **AI Powered** - Integrates with Google Gemini for advanced responses

## Quick Start

### Option 1: React Frontend Only (Browser-based)

The React app has built-in voice recognition! Just:

1. Start your React app: `npm start`
2. Open the JARVIS chat
3. Click the microphone or enable "Always Listen" mode
4. Say "Jarvis" to activate!

### Option 2: Full Setup with Python Backend

For the full always-listening experience:

#### 1. Install Python Dependencies

```bash
cd jarvis
pip install -r requirements.txt
```

#### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your Gemini API key (optional but recommended)
```

Get a free API key from: https://aistudio.google.com/app/apikey

#### 3. Start the Backend

```bash
# API server mode (connects to React frontend)
python main.py

# OR voice listening mode (standalone)
python main.py --voice
```

#### 4. Start the React App

```bash
npm start
```

## Usage

### In the React App:

1. **Open JARVIS** - Click the robot icon in the bottom right
2. **Enable Wake Word** - Toggle "Always Listen for Jarvis" in settings
3. **Say "Jarvis"** - The assistant will activate and listen for your command
4. **Speak or Type** - Ask anything about Quinton!

### Wake Word Commands:

- "Jarvis, what projects has Quinton built?"
- "Jarvis, tell me about Quinton's skills"
- "Jarvis, how can I contact him?"
- "Jarvis, what time is it?"
- "Jarvis, tell me a joke"

### Master Mode:

Say "identify as master" or "I am the owner" to access special features.

## Commands Reference

### Knowledge Queries:
- "Who is Quinton?" - Learn about Quinton
- "What are his skills?" - Technical expertise
- "Show me his projects" - Portfolio items
- "How to contact him?" - Email, phone, LinkedIn

### Actions:
- "What time is it?" - Current time
- "What's today's date?" - Current date
- "Search [topic] on Google" - Open Google search
- "Play [song] on YouTube" - Play on YouTube
- "Open [website]" - Open websites

### General:
- "Tell me a joke" - Random programming jokes
- "Clear conversation" - Start fresh

## Troubleshooting

### Microphone not working?
- Check browser permissions for microphone access
- Make sure no other app is using the microphone
- Try using Chrome or Edge browser

### Python backend not connecting?
- Make sure port 8000 is available
- Check that all dependencies are installed
- Verify .env file has correct API key

### Wake word not detecting?
- Speak clearly and say "Jarvis" distinctly
- Check microphone is working
- Reduce background noise

## File Structure

```
jarvis/
├── main.py              # Main Python backend
├── requirements.txt    # Python dependencies
├── .env.example        # Environment template
├── README.md           # This file
└── user_data.json      # Auto-generated user preferences
```

## Technology Stack

### Frontend:
- React + TypeScript
- Web Speech API (Speech Recognition + Speech Synthesis)
- Tailwind CSS

### Backend (Optional):
- Python
- Flask
- SpeechRecognition
- pyttsx3
- Google Gemini AI
- Wikipedia API

## License

MIT - Feel free to customize and use!

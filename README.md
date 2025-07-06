# 🤖 Voice AI Assistant (Web App)
A voice-based AI assistant that accepts spoken input, sends it to an LLM (OpenAI/Gemini), and responds with natural speech using ElevenLabs or Web Speech API. Built using Next.js, Tailwind CSS, and browser-compatible APIs.
## ✨ Features
- 🎤 Voice Input via Microphone
- 🧠 LLM Integration (OpenAI / Gemini)
- 🔊 Text-to-Speech Output (ElevenLabs / Web Speech)
- 💬 Chat Transcript with Last 3 Message Memory
- 📱 Responsive Mobile UI
- 📥 Download Transcripts Feature
## 📦 Folder Structure
voiceaiassist/
├── app/ # Next.js app directory
│ ├── page.tsx # Main page with logic
│ └── layout.tsx # Layout wrapper
├── components/
│ ├── MicButton.tsx # Microphone UI + fallback
│ ├── TranscriptBubble.tsx # Shows chat messages
│ └── DownloadButton.tsx # Downloads chat transcript
├── utils/
│ ├── useSpeechRecognition.ts # STT using browser or Whisper
│ ├── tts.ts # ElevenLabs or Web Speech API
│ └── askLLM.ts # Sends prompt to LLM (OpenAI, Gemini, Groq)
├── styles/
│ └── globals.css # Tailwind CSS setup
├── .env # API keys (ElevenLabs, OpenAI, etc.)
├── next.config.js # Next.js config
├── tailwind.config.js # Tailwind theme setup
├── package.json
└── README.md

bash
Copy
Edit
## 🔧 Setup Instructions
### 1. Clone the Repository
```bash
git clone https://github.com/your-username/voiceaiassist.git
cd voiceaiassist
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment
Create a .env file:

env
Copy
Edit
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
4. Run the App
bash
Copy
Edit
npm run dev
🧪 APIs Used
Web Speech API / Whisper (Speech-to-Text)

ElevenLabs / SpeechSynthesis (Text-to-Speech)

OpenAI, Gemini, Groq (LLM)

📱 Mobile Support
Fully responsive UI using Tailwind CSS.

Mic button and transcript optimized for touch interaction.

🧠 Memory Feature
Stores last 3 interactions in memory.

Passed in prompt to preserve conversational context.

💡 Bonus Features
Download chat transcript as .txt or .json.

Fallbacks for mic and TTS when unavailable.

🚀 Demo & Deployment
Record a short demo using Loom or OBS showing full flow.

Host app for free using Vercel.

🔗 Repository Info
Repo URL: https://github.com/your-username/voiceaiassist
License: MIT

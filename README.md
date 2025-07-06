# 🤖 Voice AI Assistant (Web App)

A voice-based AI assistant that accepts spoken input, sends it to an LLM (OpenAI/Gemini), and responds with natural speech using ElevenLabs or Web Speech API. Built using Next.js, Tailwind CSS, and browser-compatible APIs.

---

## ✨ Features

- 🎤 Voice Input via Microphone  
- 🧠 LLM Integration (OpenAI / Gemini / Groq)  
- 🔊 Text-to-Speech Output (ElevenLabs / Web Speech)  
- 💬 Chat Transcript with Last 3 Message Memory  
- 📱 Responsive Mobile UI  
- 📥 Download Transcripts Feature  

## 🔧 Setup Instructions

🔧 Setup Instructions
## 1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/voiceaiassist.git
cd voiceaiassist

## 2. Install Dependencies
bash
Copy
Edit
npm install

## 3. Configure Environment
Create a .env file in the root directory:

env
Copy
Edit
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key

## 4. Run the App
bash
Copy
Edit
npm run dev


## 🧪 APIs Used
🎙️ Web Speech API or Whisper (Speech-to-Text)

🗣️ ElevenLabs or SpeechSynthesis (Text-to-Speech)

## 🧠 OpenAI, Gemini, or Groq (LLM Response)

## 📱 Mobile Support
Fully responsive UI using Tailwind CSS

Optimized mic button and layout for touch interaction

## 🧠 Memory Feature
Stores last 3 chat interactions

Preserves short-term context during conversation

## 💡 Bonus Features
💾 Download chat transcript as .txt or .json

## 🔄 Fallbacks for unsupported browsers (mic, speech synthesis)

## 🚀 Demo & Deployment
Record a short screen demo using Loom, OBS, or similar

Deploy instantly using Vercel

## 🔗 Repository Info
Repo URL: https://github.com/your-username/voiceaiassist

License: MIT

Author: [R.OHMPRAKAASH]



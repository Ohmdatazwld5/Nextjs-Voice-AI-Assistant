"use client";

import React, { useRef, useState, useEffect } from "react";
import { askGroq } from "../utils/groq";
import { useSpeechRecognition } from "../utils/useSpeechRecognition";
import { speakTextWithElevenLabs } from "../utils/tts";
import TranscriptBubble from "../components/TranscribeBubble";
import MicButton from "../components/MicButton";

interface Message {
  from: "user" | "ai";
  text: string;
  audioUrl?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    listening,
    startListening,
    stopListening,
    error: srError,
    supported,
  } = useSpeechRecognition({
    onResult: (result) => setTranscript(result),
    onEnd: async (finalText) => {
      if (finalText) await handleSend(finalText);
      setTranscript("");
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (supported && typeof window !== "undefined") {
      const hasSeenGuide = localStorage.getItem("voice-guide-seen");
      if (!hasSeenGuide) {
        setShowVoiceGuide(true);
        localStorage.setItem("voice-guide-seen", "true");
      }
    }
  }, [supported]);

  useEffect(() => {
    if (listening && typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(100);
    }
  }, [listening]);

  async function handleSend(text: string) {
    const newUserMessage: Message = { from: "user", text: text.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);
    setIsSpeaking(true);

    try {
      const conversationHistory = [...messages, newUserMessage]
        .map(m => `${m.from === "user" ? "User" : "AI"}: ${m.text}`)
        .join("\n");

      const context = `${conversationHistory}\nUser: ${text.trim()}`;
      
      const aiText = await askGroq(context);
      
      try {
        const audioUrl = await speakTextWithElevenLabs(aiText);
        const aiMessage: Message = { from: "ai", text: aiText, audioUrl };
        setMessages(prev => [...prev, aiMessage]);
      } catch (ttsError) {
        console.error("TTS Error:", ttsError);
        const aiMessage: Message = { from: "ai", text: aiText };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (e) {
      console.error("Error in handleSend:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      const aiMessage: Message = {
        from: "ai",
        text: `Sorry, something went wrong! ${errorMessage}`
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setLoading(false);
      setIsSpeaking(false);
    }
  }

  function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    handleSend(input);
    setInput("");
  }

  function toggleListening() {
    if (listening) {
      stopListening();
    } else {
      startListening();
      setShowVoiceGuide(false);
    }
  }

  useEffect(() => {
    if (!listening && inputRef.current) inputRef.current.focus();
  }, [listening]);

  const VoiceGuide = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-800">
        <div className="text-6xl mb-6">🎤</div>
        <h3 className="text-2xl font-bold mb-4 text-white">Voice Control Tips</h3>
        <div className="text-sm text-gray-400 space-y-3 mb-6">
          <p>• Tap the mic button to start speaking</p>
          <p>• Speak clearly and naturally</p>
          <p>• The AI will respond with voice</p>
          <p>• Use "Stop" to interrupt playback</p>
        </div>
        <button
          onClick={() => setShowVoiceGuide(false)}
          className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-xl font-bold transition-all duration-200"
        >
          Got it!
        </button>
      </div>
    </div>
  );

  const ErrorMessage = ({ error }: { error: string }) => (
    <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-3">
      <div className="flex items-center">
        <span className="text-red-400 text-sm">⚠️</span>
        <span className="text-red-400 text-sm ml-2 font-medium">
          {error.includes("not-allowed") ? "Please allow microphone access" : error}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {showVoiceGuide && <VoiceGuide />}

      <div className="w-full max-w-4xl bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-800/50 overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎙️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">Voice AI Assistant</h1>
                <p className="text-gray-400">Speak or type to chat</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${supported ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
              <span className="text-gray-400 text-sm hidden md:block">
                {supported ? 'Voice Ready' : 'Voice Unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="h-[500px] flex flex-col">
          {srError && (
            <div className="p-4">
              <ErrorMessage error={srError} />
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Hi! I'm your voice assistant
                </h2>
                <p className="text-gray-400">
                  Press the mic button or type to start chatting
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <TranscriptBubble key={i} msg={msg} />
            ))}

            {transcript && (
              <div className="animate-pulse">
                <TranscriptBubble
                  msg={{ from: "user", text: transcript, live: true }}
                />
              </div>
            )}

            {loading && (
              <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Status Bars */}
          <div className="px-6">
            {listening && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Listening...</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isSpeaking && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">AI is speaking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-6 bg-black">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MicButton
                listening={listening}
                onClick={toggleListening}
                disabled={!supported || loading}
              />
              {!supported && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
              )}
            </div>

            <form onSubmit={onFormSubmit} className="flex-1 flex space-x-3">
              <input
                ref={inputRef}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                type="text"
                placeholder={listening ? "Listening..." : "Type your message..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading || listening}
                aria-label="Message input"
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-100 disabled:bg-gray-800 text-black px-8 py-3 rounded-xl transition-all duration-200 font-bold disabled:cursor-not-allowed disabled:text-gray-500"
                disabled={loading || !input.trim() || listening}
              >
                Send
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-6 mt-4">
            <button
              onClick={() => setShowVoiceGuide(true)}
              className="text-gray-400 text-sm hover:text-white transition-colors font-medium"
            >
              🎤 Voice Tips
            </button>
            <button
              onClick={() => setMessages([])}
              className="text-gray-400 text-sm hover:text-red-400 transition-colors font-medium"
            >
              🗑️ Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


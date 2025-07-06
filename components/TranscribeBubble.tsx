import React from "react";

interface Message {
  from: "user" | "ai";
  text: string;
  audioUrl?: string;
  live?: boolean; // Add live prop for in-progress transcript
}

export default function TranscriptBubble({ msg }: { msg: Message }) {
  return (
    <div
      className={`flex items-center ${
        msg.from === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`rounded-2xl px-4 py-3 max-w-xs shadow transition-all duration-200 relative text-base ${
          msg.from === "user"
            ? "bg-blue-100 text-blue-900"
            : msg.live
            ? "bg-blue-200 text-blue-800 border border-blue-400 animate-pulse"
            : "bg-green-100 text-green-900 animate-fadein"
        }`}
        style={{ wordBreak: "break-word" }}
        aria-live={msg.live ? "polite" : undefined}
      >
        {/* Mic pulse for live transcript */}
        {msg.live && (
          <span className="absolute left-[-18px] top-1/2 transform -translate-y-1/2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
          </span>
        )}
        {msg.from === "ai" && msg.audioUrl && (
          <audio src={msg.audioUrl} controls className="mb-1 w-full" />
        )}
        <div>{msg.text}</div>
      </div>
    </div>
  );
}
import React from "react";

export default function MicButton({
  listening,
  onClick,
  disabled,
}: {
  listening: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  // No need for typeof window check or conditional rendering here,
  // just export the component as usual.
  // Mounting/SSR guards should be handled in the parent component if needed.

  return (
    <button
      aria-label={listening ? "Stop listening" : "Start listening"}
      className={`relative rounded-full w-16 h-16 flex items-center justify-center border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
        listening
          ? "bg-red-500 border-red-700 ring-red-400"
          : "bg-white border-gray-400"
      } ${disabled ? "opacity-50" : "hover:shadow-lg"}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      tabIndex={0}
    >
      {/* Animated waves when listening */}
      {listening && (
        <span className="absolute w-20 h-20 rounded-full border-4 border-red-300 animate-ping opacity-70"></span>
      )}
      <svg
        width={36}
        height={36}
        viewBox="0 0 20 20"
        fill={listening ? "#fff" : "#888"}
        aria-hidden="true"
      >
        <path d="M10 2a2 2 0 012 2v7a2 2 0 11-4 0V4a2 2 0 012-2zm5 9a5 5 0 01-10 0H3a7 7 0 0014 0h-2zm-5 7a1 1 0 001-1v-1H9v1a1 1 0 001 1z" />
      </svg>
      <span className="sr-only">
        {listening ? "Listening, press to stop" : "Press to start listening"}
      </span>
    </button>
  );
}
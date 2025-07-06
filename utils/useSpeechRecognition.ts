import { useEffect, useRef, useState } from "react";

interface SRProps {
  onResult: (text: string) => void;
  onEnd: (finalText: string) => void;
}

export function useSpeechRecognition({ onResult, onEnd }: SRProps) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscript = useRef("");

  useEffect(() => {
    // SSR Guard
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      setError("Web Speech API not supported in this browser.");
      return;
    }
    setSupported(true);

    // Check mic permissions - guard for SSR
    if (
      typeof navigator !== "undefined" &&
      navigator.permissions &&
      typeof navigator.permissions.query === "function"
    ) {
      try {
        // @ts-ignore
        navigator.permissions.query({ name: "microphone" }).then((result: any) => {
          if (result.state === "denied") {
            setError("Microphone access denied.");
          }
        }).catch(() => {});
      } catch {}
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript.current += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      onResult(finalTranscript.current + interim);
    };

    recognitionRef.current.onerror = (event: any) => {
      setError(event.error);
      setListening(false);
    };

    recognitionRef.current.onend = () => {
      setListening(false);
      onEnd(finalTranscript.current.trim());
      finalTranscript.current = "";
    };

    return () => {
      recognitionRef.current && recognitionRef.current.abort();
    };
  }, []);

  function startListening() {
    setError(null);
    if (recognitionRef.current) {
      finalTranscript.current = "";
      recognitionRef.current.start();
      setListening(true);
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }

  return { listening, startListening, stopListening, error, supported };
}
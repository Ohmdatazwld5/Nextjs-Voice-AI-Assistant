export async function speakTextWithElevenLabs(text: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    throw new Error(
      "Missing ElevenLabs configuration. Please add NEXT_PUBLIC_ELEVENLABS_API_KEY and NEXT_PUBLIC_ELEVENLABS_VOICE_ID to your .env.local file"
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `ElevenLabs API Error (${response.status}): ${errorData.detail || response.statusText || 'Unknown error'}`
      );
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play the audio
    const audio = new Audio(audioUrl);
    audio.play();

    // Cleanup the object URL after playback
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

    return audioUrl;
  } catch (error) {
    console.error("ElevenLabs API Error:", error);
    throw error;
  }
}
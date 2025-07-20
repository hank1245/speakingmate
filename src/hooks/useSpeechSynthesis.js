import { useEffect, useRef, useState } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      synthRef.current.addEventListener('voiceschanged', loadVoices);

      return () => {
        synthRef.current?.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const speak = (text, options = {}) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice preferences (prefer English voices)
    const englishVoices = voices.filter(voice => 
      voice.lang.startsWith('en-') || voice.lang === 'en'
    );
    
    if (englishVoices.length > 0) {
      // Prefer US English, then any English voice
      const preferredVoice = englishVoices.find(v => v.lang === 'en-US') || englishVoices[0];
      utterance.voice = preferredVoice;
    }

    // Configure speech parameters
    utterance.rate = options.rate || 0.9; // Slightly slower for language learning
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Event handlers
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeaking(false);
    }
  };

  const isSupported = 'speechSynthesis' in window;

  return {
    speak,
    stop,
    speaking,
    voices,
    isSupported
  };
};
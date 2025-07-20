import { useRef, useState, useEffect } from "react";

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      // Configure recognition settings
      recognition.continuous = true; // Keep listening until manually stopped
      recognition.interimResults = true; // Show results while speaking
      recognition.lang = "en-US"; // Set language to English
      recognition.maxAlternatives = 1;

      // Event handlers
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setIsListening(false);

        let errorMessage = "Speech recognition error occurred.";

        switch (event.error) {
          case "no-speech":
            errorMessage = "No speech was detected. Please try again.";
            break;
          case "audio-capture":
            errorMessage =
              "No microphone was found. Please check your microphone.";
            break;
          case "not-allowed":
            errorMessage =
              "Microphone permission denied. Please allow microphone access.";
            break;
          case "network":
            errorMessage = "Network error occurred during speech recognition.";
            break;
          case "service-not-allowed":
            errorMessage = "Speech recognition service is not allowed.";
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }

        setError(errorMessage);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setError("Failed to start speech recognition. Please try again.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setError(null);
  };

  const isSupported = !!(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
};

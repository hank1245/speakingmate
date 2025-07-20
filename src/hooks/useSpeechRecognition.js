// useSpeechRecognition.js

import { useRef, useState, useEffect } from "react";

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // 변경점 1: 이전 텍스트를 저장할 ref 추가
  const committedTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      // 변경점 2: onresult 로직 수정
      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        // 현재 세션의 모든 결과(누적)를 순회합니다.
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        // 이전 텍스트에 현재 세션의 텍스트를 더해줍니다.
        setTranscript(
          committedTranscriptRef.current + finalTranscript + interimTranscript
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        // ... (기존 에러 처리 로직 동일)
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // 변경점 3: startListening 로직 수정
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      // 시작 시, 현재 텍스트를 "확정된" 텍스트로 저장합니다. (뒤에 공백 추가)
      committedTranscriptRef.current = transcript
        ? transcript.trim() + " "
        : "";
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

  // 변경점 4: resetTranscript 로직 수정
  const resetTranscript = () => {
    setTranscript("");
    committedTranscriptRef.current = ""; // ref도 함께 초기화
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

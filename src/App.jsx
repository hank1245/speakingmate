import { useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "./styles/common";
import { CHAT_CONTACTS, ERROR_MESSAGES } from "./constants";
import { useSpeechSynthesis, useSpeechRecognition, useChat } from "./hooks";
import { Sidebar, ChatArea } from "./components";
import { getSuggestionForContext } from "./services/openai";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: ${colors.background.main};
`;

function App() {
  const [suggestion, setSuggestion] = useState("");
  const [isGettingHelp, setIsGettingHelp] = useState(false);
  
  const { speak, speaking, isSupported: ttsSupported } = useSpeechSynthesis();
  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: speechSupported,
  } = useSpeechRecognition();

  const {
    currentChatId,
    currentContact,
    currentMessages,
    isLoading,
    handleSpeechMessage,
    handleContactSelect,
    getLastMessage,
    handleCreateCharacter,
    handleToggleFavorite,
    isFavorite,
    organizedContacts,
    toggleMessageCorrection,
  } = useChat(CHAT_CONTACTS);

  // Handle speech recognition transcript - removed automatic input setting

  // Handle speech recognition errors
  useEffect(() => {
    if (speechError) {
      console.error("Speech recognition error:", speechError);
    }
  }, [speechError]);

  const handleMicClick = () => {
    if (isListening) {
      // Stop recording and process the speech transcript
      stopListening();

      // Process the transcript when stopping - now uses grammar correction
      if (transcript && transcript.trim() && currentChatId) {
        handleSpeechMessage(transcript.trim(), ttsSupported ? speak : null);
        // Clear the transcript after processing
        resetTranscript();
      }
    } else {
      // Start recording
      if (speechSupported) {
        resetTranscript(); // Clear any previous transcript completely
        startListening();
      } else {
        alert(ERROR_MESSAGES.SPEECH_NOT_SUPPORTED);
      }
    }
  };

  const handleCancelClick = () => {
    if (isListening) {
      // Stop recording without processing
      stopListening();
      // Clear the transcript completely
      resetTranscript();
    }
  };

  const handleHelpClick = async () => {
    if (!currentChatId || !currentContact) {
      return;
    }

    setIsGettingHelp(true);
    setSuggestion("");

    try {
      const suggestionText = await getSuggestionForContext(
        currentMessages,
        currentContact.personality
      );
      setSuggestion(`example: ${suggestionText}`);
    } catch (error) {
      console.error("Error getting suggestion:", error);
      setSuggestion("Sorry, couldn't get a suggestion right now.");
    } finally {
      setIsGettingHelp(false);
    }
  };

  return (
    <AppContainer>
      <Sidebar
        currentChatId={currentChatId}
        onContactSelect={handleContactSelect}
        getLastMessage={getLastMessage}
        onCreateCharacter={handleCreateCharacter}
        organizedContacts={organizedContacts}
      />

      <ChatArea
        currentContact={currentContact}
        messages={currentMessages}
        isLoading={isLoading}
        onMicClick={handleMicClick}
        onCancelClick={handleCancelClick}
        onHelpClick={handleHelpClick}
        onSpeak={speak}
        isListening={isListening}
        speechSupported={speechSupported}
        ttsSupported={ttsSupported}
        speaking={speaking}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={currentContact ? isFavorite(currentContact.id) : false}
        onToggleCorrection={toggleMessageCorrection}
        suggestion={suggestion}
        isGettingHelp={isGettingHelp}
      />
    </AppContainer>
  );
}

export default App;

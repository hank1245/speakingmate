import { useEffect } from "react";
import styled from "styled-components";
import { colors } from "./styles/common";
import { CHAT_CONTACTS, ERROR_MESSAGES } from "./constants";
import { useSpeechSynthesis, useSpeechRecognition, useChat } from "./hooks";
import { Sidebar, ChatArea } from "./components";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: ${colors.background.main};
`;

function App() {
  const { speak, speaking, isSupported: ttsSupported } = useSpeechSynthesis();
  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    isSupported: speechSupported,
  } = useSpeechRecognition();

  const {
    currentChatId,
    currentContact,
    currentMessages,
    inputText,
    isLoading,
    setInputText,
    handleSendMessage,
    handleContactSelect,
    getLastMessage,
    handleCreateCharacter,
    handleToggleFavorite,
    isFavorite,
    organizedContacts,
  } = useChat(CHAT_CONTACTS);

  // Handle speech recognition transcript
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript, setInputText]);

  // Handle speech recognition errors
  useEffect(() => {
    if (speechError) {
      console.error("Speech recognition error:", speechError);
    }
  }, [speechError]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(ttsSupported ? speak : null);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      // 듣고 있는 중(일시정지)일 때는 recognition만 멈춥니다.
      stopListening();
    } else {
      // 멈춰있는 상태일 때는 recognition을 시작합니다.
      if (speechSupported) {
        // resetTranscript(); // 필요하다면 이 부분은 남겨두거나, 사용자가 직접 지우도록 둘 수 있습니다.
        // setInputText(""); // 위와 동일
        startListening();
      } else {
        alert(ERROR_MESSAGES.SPEECH_NOT_SUPPORTED);
      }
    }
  };

  const handleSend = () => {
    handleSendMessage(ttsSupported ? speak : null);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
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
        inputText={inputText}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
        onMicClick={handleMicClick}
        onSpeak={speak}
        isListening={isListening}
        speechSupported={speechSupported}
        ttsSupported={ttsSupported}
        speaking={speaking}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={currentContact ? isFavorite(currentContact.id) : false}
      />
    </AppContainer>
  );
}

export default App;

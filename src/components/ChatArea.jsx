import { useRef, useEffect } from "react";
import styled from "styled-components";
import { colors } from "../styles/common";
import WelcomeScreen from "./WelcomeScreen";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${colors.background.chat};
`;

function ChatArea({
  currentContact,
  messages,
  isLoading,
  onMicClick,
  onCancelClick,
  onSpeak,
  isListening,
  speechSupported,
  ttsSupported,
  speaking,
  onToggleFavorite,
  isFavorite,
  onToggleCorrection,
}) {
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!currentContact) {
    return (
      <ChatContainer>
        <WelcomeScreen />
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader
        contact={currentContact}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />

      <ChatMessages
        ref={chatContainerRef}
        messages={messages}
        contact={currentContact}
        isLoading={isLoading}
        onSpeak={onSpeak}
        ttsSupported={ttsSupported}
        speaking={speaking}
        onToggleCorrection={onToggleCorrection}
      />

      <ChatInput
        onMicClick={onMicClick}
        onCancelClick={onCancelClick}
        isLoading={isLoading}
        isListening={isListening}
        speechSupported={speechSupported}
      />
    </ChatContainer>
  );
}

export default ChatArea;

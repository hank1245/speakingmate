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

const SuggestionContainer = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  padding: 15px 20px;
  background: ${colors.background.input};
  border-top: 1px solid ${colors.border};
  color: ${colors.text.muted};
  font-style: italic;
  font-size: 14px;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

function ChatArea({
  currentContact,
  messages,
  isLoading,
  onMicClick,
  onCancelClick,
  onHelpClick,
  onSpeak,
  onStopSpeak,
  isListening,
  speechSupported,
  ttsSupported,
  speakingMessageId,
  onToggleFavorite,
  isFavorite,
  onToggleCorrection,
  suggestion,
  isGettingHelp,
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
        onStopSpeak={onStopSpeak}
        ttsSupported={ttsSupported}
        speakingMessageId={speakingMessageId}
        onToggleCorrection={onToggleCorrection}
      />

      <SuggestionContainer show={suggestion}>{suggestion}</SuggestionContainer>

      <ChatInput
        onMicClick={onMicClick}
        onCancelClick={onCancelClick}
        onHelpClick={onHelpClick}
        isLoading={isLoading}
        isListening={isListening}
        speechSupported={speechSupported}
        isGettingHelp={isGettingHelp}
      />
    </ChatContainer>
  );
}

export default ChatArea;

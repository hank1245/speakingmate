import { forwardRef } from "react";
import styled from "styled-components";
import { colors } from "../styles/common";
import { UI_TEXT } from "../constants/strings";
import MessageBubble from "./MessageBubble";

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: ${colors.background.chat};
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${colors.text.muted};
  margin-top: 50px;

  h3 {
    margin-bottom: 10px;
    color: ${colors.text.primary};
  }
`;

const ChatMessages = forwardRef(
  ({ messages, contact, isLoading, onSpeak, ttsSupported, speaking }, ref) => {
    if (messages.length === 0) {
      return (
        <MessagesContainer ref={ref}>
          <EmptyState>
            <h3>
              {UI_TEXT.START_CONVERSATION} {contact?.name}!
            </h3>
            <p>{UI_TEXT.INSTRUCTIONS}</p>
          </EmptyState>
        </MessagesContainer>
      );
    }

    return (
      <MessagesContainer ref={ref}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.isUser}
            onSpeak={onSpeak}
            ttsSupported={ttsSupported}
            speaking={speaking}
          />
        ))}

        {isLoading && (
          <MessageBubble
            message={{ isLoading: true }}
            isUser={false}
            ttsSupported={false}
            speaking={false}
          />
        )}
      </MessagesContainer>
    );
  }
);

ChatMessages.displayName = "ChatMessages";

export default ChatMessages;

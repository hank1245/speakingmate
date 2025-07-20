import styled from "styled-components";
import { colors, animations } from "../styles/common";
import { UI_TEXT } from "../constants/strings";

const BubbleContainer = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  margin: 10px 0;
  border-radius: 18px;
  word-wrap: break-word;
  position: relative;

  ${(props) =>
    props.isUser
      ? `
    background: ${colors.primary};
    color: ${colors.text.primary};
    margin-left: auto;
    text-align: right;
  `
      : `
    background: ${colors.background.input};
    color: ${colors.text.message};
    margin-right: auto;
  `}
`;

const SpeakButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0.7;
  transition: all 0.2s ease;
  color: ${colors.text.message};

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }

  ${(props) =>
    props.speaking &&
    `
    animation: pulse 1.5s infinite;
  `}

  ${animations}
`;

const LoadingBubble = styled(BubbleContainer)`
  background: ${colors.background.input};
  color: ${colors.text.message};
  margin-right: auto;

  .loading-content {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .dots {
    animation: blink 1.4s infinite;
  }

  ${animations}
`;

function MessageBubble({ message, isUser, onSpeak, ttsSupported, speaking }) {
  if (message.isLoading) {
    return (
      <LoadingBubble>
        <div className="loading-content">
          <span>{UI_TEXT.THINKING}</span>
          <span className="dots">...</span>
        </div>
      </LoadingBubble>
    );
  }

  return (
    <BubbleContainer isUser={isUser}>
      {message.text}
      {!isUser && ttsSupported && (
        <SpeakButton
          onClick={() => onSpeak(message.text)}
          speaking={speaking}
          title={UI_TEXT.BUTTON_TITLES.READ_ALOUD}
        >
          🔊
        </SpeakButton>
      )}
    </BubbleContainer>
  );
}

export default MessageBubble;

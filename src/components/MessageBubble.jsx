import styled from "styled-components";
import { colors, animations } from "../styles/common";
import { UI_TEXT } from "../constants/strings";

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 10px 0;
  position: relative;

  ${(props) =>
    props.isUser
      ? `
    justify-content: flex-end;
  `
      : `
    justify-content: flex-start;
  `}
`;

const BubbleContainer = styled.div`
  width: fit-content;
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  position: relative;

  ${(props) =>
    props.isUser
      ? `
    background: ${colors.primary};
    color: ${colors.text.primary};
    text-align: right;
  `
      : `
    background: ${colors.background.input};
    color: ${colors.text.message};
    opacity: 0;
    animation: fadeInBubble 0.6s ease-out forwards;
  `}

  @keyframes fadeInBubble {
    from {
      opacity: 0;
      transform: translateY(15px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const CorrectionButton = styled.button`
  position: absolute;
  top: 50%;
  left: -36px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: 0.7;
  transition: all 0.2s ease;
  color: ${(props) => (props.isShowingCorrected ? colors.success : "#ff9800")};
  z-index: 10;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
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
  opacity: 0;
  animation: fadeInDelayed 1.5s ease-in-out 1s forwards;

  .loading-content {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .dots {
    animation: blink 1.4s infinite 1s;
  }

  @keyframes fadeInDelayed {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${animations}
`;

const StopButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 4px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
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

  ${animations}
`;

function MessageBubble({
  message,
  isUser,
  onSpeak,
  onStopSpeak,
  ttsSupported,
  speaking,
  onToggleCorrection,
}) {
  if (message.isLoading) {
    return (
      <MessageContainer>
        <LoadingBubble>
          <div className="loading-content">
            <span>{UI_TEXT.THINKING}</span>
            <span className="dots">...</span>
          </div>
        </LoadingBubble>
      </MessageContainer>
    );
  }

  const hasCorrection = message.correctedText && isUser;

  return (
    <MessageContainer isUser={isUser}>
      <BubbleContainer isUser={isUser}>
        {hasCorrection && (
          <CorrectionButton
            onClick={() => onToggleCorrection(message.id)}
            isShowingCorrected={message.isShowingCorrected}
            title={
              message.isShowingCorrected
                ? "Show original message"
                : "Show grammar correction"
            }
          >
            {message.isShowingCorrected ? "↩️" : "⚠️"}
          </CorrectionButton>
        )}
        {message.text}
        {!isUser && ttsSupported && (
          <>
            <SpeakButton
              onClick={() => onSpeak(message.text)}
              speaking={speaking}
              title={UI_TEXT.BUTTON_TITLES.READ_ALOUD}
            >
              🔊
            </SpeakButton>
            {speaking && (
              <StopButton onClick={onStopSpeak} title="Stop reading">
                ⏹️
              </StopButton>
            )}
          </>
        )}
      </BubbleContainer>
    </MessageContainer>
  );
}

export default MessageBubble;

import styled from "styled-components";
import { colors, CircularButton } from "../styles/common";
import { UI_TEXT } from "../constants/strings";

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  background: ${colors.background.input};
  padding: 15px 20px;
  border-top: 1px solid ${colors.border};
`;

const MicButton = styled(CircularButton)`
  background: ${(props) =>
    props.isRecording ? colors.danger : colors.primary};
  color: ${colors.text.primary};
  width: 60px;
  height: 60px;
  font-size: 24px;
`;

const CancelButton = styled(CircularButton)`
  background: ${colors.background.hover};
  color: ${colors.text.muted};
  width: 45px;
  height: 45px;
  font-size: 20px;
  border: 2px solid ${colors.border};

  &:hover:not(:disabled) {
    background: ${colors.background.active};
    color: ${colors.text.primary};
    border-color: ${colors.text.muted};
  }
`;

const HelpButton = styled(CircularButton)`
  background: ${colors.background.hover};
  color: ${colors.text.muted};
  width: 45px;
  height: 45px;
  font-size: 20px;
  border: 2px solid ${colors.border};

  &:hover:not(:disabled) {
    background: ${colors.background.active};
    color: ${colors.text.primary};
    border-color: ${colors.text.muted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function ChatInput({
  onMicClick,
  onCancelClick,
  onHelpClick,
  isLoading,
  isListening,
  speechSupported,
  isGettingHelp,
}) {
  return (
    <InputContainer>
      {isListening && (
        <CancelButton
          onClick={onCancelClick}
          title="Cancel recording"
          disabled={isLoading}
        >
          ✕
        </CancelButton>
      )}

      <MicButton
        onClick={onMicClick}
        isRecording={isListening}
        title={
          isListening
            ? UI_TEXT.BUTTON_TITLES.STOP_RECORDING
            : UI_TEXT.BUTTON_TITLES.START_RECORDING
        }
        disabled={!speechSupported || isLoading}
      >
        {isListening ? "🔴" : "🎤"}
      </MicButton>

      <HelpButton
        onClick={onHelpClick}
        title="Get answer suggestion"
        disabled={isLoading || isListening || isGettingHelp}
      >
        {isGettingHelp ? "⏳" : "💡"}
      </HelpButton>
    </InputContainer>
  );
}

export default ChatInput;

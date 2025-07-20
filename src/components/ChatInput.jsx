import styled from "styled-components";
import { colors, CircularButton } from "../styles/common";
import { UI_TEXT } from "../constants/strings";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${colors.background.input};
  padding: 15px 20px;
  border-top: 1px solid ${colors.border};
`;

const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 24px;
  background: ${colors.background.inputField};
  color: ${colors.text.primary};

  &::placeholder {
    color: ${colors.text.muted};
  }
`;

const MicButton = styled(CircularButton)`
  background: ${(props) =>
    props.isRecording ? colors.danger : colors.primary};
  color: ${colors.text.primary};
`;

const SendButton = styled(CircularButton)`
  background: ${colors.primary};
  color: ${colors.text.primary};
`;

function ChatInput({
  inputText,
  onInputChange,
  onKeyPress,
  onSend,
  onMicClick,
  isLoading,
  isListening,
  speechSupported,
  contact,
}) {
  return (
    <InputContainer>
      <TextInput
        type="text"
        value={inputText}
        onChange={onInputChange}
        onKeyDown={onKeyPress}
        placeholder={`${UI_TEXT.PLACEHOLDER_MESSAGE} ${contact?.name}...`}
        disabled={isLoading}
      />
      <MicButton
        onClick={onMicClick}
        isRecording={isListening}
        title={
          isListening
            ? UI_TEXT.BUTTON_TITLES.STOP_RECORDING
            : UI_TEXT.BUTTON_TITLES.START_RECORDING
        }
        disabled={!speechSupported}
      >
        {isListening ? "🔴" : "🎤"}
      </MicButton>
      <SendButton
        onClick={onSend}
        disabled={!inputText.trim() || isLoading}
        title={UI_TEXT.BUTTON_TITLES.SEND_MESSAGE}
      >
        ✈️
      </SendButton>
    </InputContainer>
  );
}

export default ChatInput;

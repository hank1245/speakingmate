import { useState } from "react";
import styled from "styled-components";
import { colors } from "../styles/common";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${colors.background.sidebar};
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid ${colors.border};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h2 {
    color: ${colors.text.primary};
    margin: 0;
    font-size: 24px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.text.muted};
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;

  &:hover {
    color: ${colors.text.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: ${colors.text.primary};
    font-size: 14px;
    font-weight: 500;
  }

  .description {
    color: ${colors.text.secondary};
    font-size: 12px;
    margin-top: -4px;
  }
`;

const Input = styled.input`
  background: ${colors.background.inputField};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 12px 16px;
  color: ${colors.text.primary};
  font-size: 16px;

  &::placeholder {
    color: ${colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const TextArea = styled.textarea`
  background: ${colors.background.inputField};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 12px 16px;
  color: ${colors.text.primary};
  font-size: 16px;
  resize: vertical;
  min-height: 100px;

  &::placeholder {
    color: ${colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
`;

const EmojiButton = styled.button`
  background: ${(props) => (props.selected ? colors.primary : "transparent")};
  border: 1px solid
    ${(props) => (props.selected ? colors.primary : colors.border)};
  border-radius: 6px;
  padding: 8px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.background.hover};
    border-color: ${colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: ${colors.text.secondary};
  border: 1px solid ${colors.border};

  &:hover:not(:disabled) {
    background: ${colors.background.hover};
    color: ${colors.text.primary};
  }
`;

const CreateButton = styled(Button)`
  background: ${colors.primary};
  color: ${colors.text.primary};

  &:hover:not(:disabled) {
    background: #4752c4;
  }
`;

const EMOJI_OPTIONS = [
  "👨‍💼",
  "👩‍💼",
  "👨‍🏫",
  "👩‍🏫",
  "👨‍⚕️",
  "👩‍⚕️",
  "👨‍🍳",
  "👩‍🍳",
  "👨‍🎨",
  "👩‍🎨",
  "👨‍💻",
  "👩‍💻",
  "👨‍🔬",
  "👩‍🔬",
  "👨‍🎤",
  "👩‍🎤",
  "🧑‍✈️",
  "👮‍♂️",
  "👮‍♀️",
  "👨‍🚒",
  "👩‍🚒",
  "👨‍🌾",
  "👩‍🌾",
  "👨‍🏭",
  "👩‍🏭",
  "👨‍🔧",
  "👩‍🔧",
  "👨‍⚖️",
  "👩‍⚖️",
  "👨‍🚀",
  "👩‍🚀",
  "🧑‍🎓",
];

const COLOR_OPTIONS = [
  "#4CAF50",
  "#FF9800",
  "#E91E63",
  "#2196F3",
  "#9C27B0",
  "#FF5722",
  "#795548",
  "#607D8B",
  "#FFC107",
  "#8BC34A",
  "#00BCD4",
  "#3F51B5",
  "#F44336",
  "#673AB7",
  "#009688",
  "#CDDC39",
];

function CharacterCreationModal({ isOpen, onClose, onCreateCharacter }) {
  const [formData, setFormData] = useState({
    name: "",
    myRole: "",
    characterRole: "",
    conversationTopic: "",
    avatar: "👨‍💼",
    color: COLOR_OPTIONS[0],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newCharacter = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      avatar: formData.avatar,
      color: formData.color,
      personality: `You are ${formData.characterRole || "a helpful assistant"}. 
        The user's role is: ${formData.myRole || "someone learning English"}. 
        Focus conversations on: ${
          formData.conversationTopic || "general English practice"
        }.
        ${
          formData.characterRole
            ? `Stay in character as ${formData.characterRole} and draw from relevant knowledge and experiences.`
            : ""
        }
        ${
          formData.conversationTopic
            ? `Guide conversations toward topics related to ${formData.conversationTopic}.`
            : ""
        }`,
    };

    onCreateCharacter(newCharacter);

    // Reset form
    setFormData({
      name: "",
      myRole: "",
      characterRole: "",
      conversationTopic: "",
      avatar: "👨‍💼",
      color: COLOR_OPTIONS[0],
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>새 캐릭터 생성</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>캐릭터 이름 *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="예: Emma, 선생님, 친구 등"
              required
            />
          </FormGroup>

          <FormGroup>
            <label>나의 역할</label>
            <div className="description">
              대화에서 당신의 역할이나 상황을 설명하세요
            </div>
            <Input
              type="text"
              value={formData.myRole}
              onChange={(e) => handleInputChange("myRole", e.target.value)}
              placeholder="예: 영어를 배우는 학생, 해외여행 준비생, 직장인 등"
            />
          </FormGroup>

          <FormGroup>
            <label>캐릭터의 역할</label>
            <div className="description">
              AI가 맡을 역할이나 직업을 설명하세요
            </div>
            <Input
              type="text"
              value={formData.characterRole}
              onChange={(e) =>
                handleInputChange("characterRole", e.target.value)
              }
              placeholder="예: 영어 선생님, 카페 점원, 여행 가이드, 친구 등"
            />
          </FormGroup>

          <FormGroup>
            <label>대화 주제 및 상황</label>
            <div className="description">
              주로 어떤 주제나 상황에 대해 대화하고 싶은지 설명하세요
            </div>
            <TextArea
              value={formData.conversationTopic}
              onChange={(e) =>
                handleInputChange("conversationTopic", e.target.value)
              }
              placeholder="예: 일상 대화, 비즈니스 영어, 여행 영어, 면접 연습, 취미 관련 대화 등"
            />
          </FormGroup>

          <FormGroup>
            <label>아바타 선택</label>
            <EmojiGrid>
              {EMOJI_OPTIONS.map((emoji) => (
                <EmojiButton
                  key={emoji}
                  type="button"
                  selected={formData.avatar === emoji}
                  onClick={() => handleInputChange("avatar", emoji)}
                >
                  {emoji}
                </EmojiButton>
              ))}
            </EmojiGrid>
          </FormGroup>

          <FormGroup>
            <label>색상 선택</label>
            <EmojiGrid>
              {COLOR_OPTIONS.map((color) => (
                <EmojiButton
                  key={color}
                  type="button"
                  selected={formData.color === color}
                  onClick={() => handleInputChange("color", color)}
                  style={{ backgroundColor: color, color: "white" }}
                >
                  ●
                </EmojiButton>
              ))}
            </EmojiGrid>
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            <CreateButton type="submit" disabled={!formData.name.trim()}>
              생성
            </CreateButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CharacterCreationModal;

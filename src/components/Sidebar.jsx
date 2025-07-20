import { useState } from "react";
import styled from "styled-components";
import { colors } from "../styles/common";
import { UI_TEXT } from "../constants/strings";
import CharacterCreationModal from "./CharacterCreationModal";

const SidebarContainer = styled.div`
  width: 320px;
  background: ${colors.background.sidebar};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${colors.border};
`;

const SidebarHeader = styled.div`
  padding: 20px;
  background: ${colors.background.header};
  border-bottom: 1px solid ${colors.border};

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${colors.text.primary};
    font-size: 18px;
    font-weight: 600;
  }

  .subtitle {
    color: ${colors.text.secondary};
    font-size: 14px;
    margin-top: 5px;
  }
`;

const ContactsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
`;

const SectionHeader = styled.div`
  padding: 12px 20px 8px 20px;
  color: ${colors.text.secondary};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${colors.background.sidebar};
  position: sticky;
  top: 0;
  z-index: 1;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 8px 20px;
`;

const ContactItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-left: 3px solid transparent;

  ${(props) =>
    props.active &&
    `
    background: ${colors.background.active};
    border-left-color: ${props.color || colors.primary};
  `}

  &:hover {
    background: ${colors.background.hover};
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-right: 12px;
    background: ${(props) => props.color || colors.primary};
    opacity: 0.8;
  }

  .info {
    flex: 1;

    .name {
      color: ${colors.text.primary};
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 2px;
    }

    .last-message {
      color: ${colors.text.secondary};
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const AddCharacterButton = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 2px dashed ${colors.border};
  margin: 10px;
  border-radius: 8px;

  &:hover {
    background: ${colors.background.hover};
    border-color: ${colors.primary};
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-right: 12px;
    background: transparent;
    color: ${colors.text.muted};
  }

  .text {
    color: ${colors.text.secondary};
    font-size: 16px;
    font-weight: 500;
  }

  &:hover .icon {
    color: ${colors.primary};
  }

  &:hover .text {
    color: ${colors.text.primary};
  }
`;

function Sidebar({
  currentChatId,
  onContactSelect,
  getLastMessage,
  onCreateCharacter,
  organizedContacts,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCharacter = (newCharacter) => {
    onCreateCharacter(newCharacter);
    setIsModalOpen(false);
  };

  const {
    favorites,
    default: defaultContacts,
    custom: customContacts,
  } = organizedContacts();

  const renderContactItem = (contact) => (
    <ContactItem
      key={contact.id}
      active={currentChatId === contact.id}
      color={contact.color}
      onClick={() => onContactSelect(contact.id)}
    >
      <div className="avatar">{contact.avatar}</div>
      <div className="info">
        <div className="name">{contact.name}</div>
        <div className="last-message">{getLastMessage(contact.id)}</div>
      </div>
    </ContactItem>
  );

  return (
    <SidebarContainer>
      <SidebarHeader>
        <div className="logo">🤖 {UI_TEXT.APP_NAME}</div>
        <div className="subtitle">{UI_TEXT.APP_SUBTITLE}</div>
      </SidebarHeader>

      <ContactsList>
        {favorites.length > 0 && (
          <>
            <SectionHeader>Favorite Characters</SectionHeader>
            {favorites.map(renderContactItem)}
            <SectionDivider />
          </>
        )}

        {defaultContacts.length > 0 && (
          <>
            <SectionHeader>Default Characters</SectionHeader>
            {defaultContacts.map(renderContactItem)}
          </>
        )}

        {customContacts.length > 0 && (
          <>
            {defaultContacts.length > 0 && <SectionDivider />}
            <SectionHeader>My Characters</SectionHeader>
            {customContacts.map(renderContactItem)}
          </>
        )}

        <AddCharacterButton onClick={() => setIsModalOpen(true)}>
          <div className="icon">+</div>
          <div className="text">새 캐릭터 추가</div>
        </AddCharacterButton>
      </ContactsList>

      <CharacterCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateCharacter={handleCreateCharacter}
      />
    </SidebarContainer>
  );
}

export default Sidebar;

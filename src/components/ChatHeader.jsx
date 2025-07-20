import styled from "styled-components";
import { colors, CircularButton } from "../styles/common";
import { UI_TEXT } from "../constants/strings";

const HeaderContainer = styled.div`
  padding: 15px 20px;
  background: ${colors.background.header};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: ${(props) => props.color || colors.primary};
    opacity: 0.8;
  }

  .info {
    .name {
      color: ${colors.text.primary};
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .status {
      color: ${colors.text.muted};
      font-size: 12px;
    }
  }
`;

const FavoriteButton = styled(CircularButton)`
  background: transparent;
  color: ${(props) => (props.isFavorite ? "#ff6b6b" : colors.text.muted)};
  font-size: 20px;
  width: 36px;
  height: 36px;

  &:hover:not(:disabled) {
    background: ${colors.background.hover};
    color: ${(props) => (props.isFavorite ? "#ff4757" : "#ff6b6b")};
  }
`;

function ChatHeader({ contact, onToggleFavorite, isFavorite }) {
  if (!contact) return null;

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(contact.id);
    }
  };

  return (
    <HeaderContainer>
      <ContactInfo color={contact.color}>
        <div className="avatar">{contact.avatar}</div>
        <div className="info">
          <div className="name">{contact.name}</div>
          <div className="status">{UI_TEXT.STATUS_ONLINE}</div>
        </div>
      </ContactInfo>

      <FavoriteButton
        isFavorite={isFavorite}
        onClick={handleFavoriteClick}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "♥" : "♡"}
      </FavoriteButton>
    </HeaderContainer>
  );
}

export default ChatHeader;

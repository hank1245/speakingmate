import styled from "styled-components";
import { colors } from "../styles/common";
import { UI_TEXT } from "../constants/strings";

const HeaderContainer = styled.div`
  padding: 15px 20px;
  background: ${colors.background.header};
  border-bottom: 1px solid ${colors.border};
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

function ChatHeader({ contact }) {
  if (!contact) return null;

  return (
    <HeaderContainer color={contact.color}>
      <div className="avatar">{contact.avatar}</div>
      <div className="info">
        <div className="name">{contact.name}</div>
        <div className="status">{UI_TEXT.STATUS_ONLINE}</div>
      </div>
    </HeaderContainer>
  );
}

export default ChatHeader;

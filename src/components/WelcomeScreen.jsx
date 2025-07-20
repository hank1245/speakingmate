import styled from "styled-components";
import { colors, animations } from "../styles/common";
import { UI_TEXT } from "../constants/strings";

const WelcomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${colors.text.muted};
  text-align: center;

  .robot {
    font-size: 80px;
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
  }

  .welcome-text {
    font-size: 28px;
    margin-bottom: 10px;
    color: ${colors.text.primary};
  }

  .admin {
    color: ${colors.primary};
  }

  .subtitle {
    font-size: 16px;
    max-width: 400px;
    line-height: 1.5;
  }

  ${animations}
`;

function WelcomeScreen() {
  return (
    <WelcomeContainer>
      <div className="robot">🤖</div>
      <div className="welcome-text">
        {UI_TEXT.WELCOME_MESSAGE}{" "}
        <span className="admin">{UI_TEXT.WELCOME_ADMIN}</span>!
      </div>
      <div className="subtitle">{UI_TEXT.WELCOME_SUBTITLE}</div>
    </WelcomeContainer>
  );
}

export default WelcomeScreen;

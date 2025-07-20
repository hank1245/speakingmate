import styled from "styled-components";

// Common colors
export const colors = {
  primary: "#5865f2",
  danger: "#ff4757",
  success: "#4CAF50",
  background: {
    main: "#1a1a1a",
    sidebar: "#2d2d30",
    chat: "#36393f",
    header: "#3c3c41",
    input: "#40444b",
    inputField: "#484c52",
    hover: "#3a3a3d",
    active: "#3e3e42",
  },
  text: {
    primary: "#ffffff",
    secondary: "#b3b3b3",
    muted: "#72767d",
    message: "#dcddde",
  },
  border: "#3e3e42",
};

// Common button styles
export const ButtonBase = styled.button`
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CircularButton = styled(ButtonBase)`
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    transform: none;
  }
`;

// Common animations
export const animations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

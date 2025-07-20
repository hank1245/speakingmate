// Storage keys
export const STORAGE_KEYS = {
  ALL_CHAT_MESSAGES: "allChatMessages",
  CUSTOM_CONTACTS: "customContacts",
  FAVORITES: "favorites",
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "Sorry, I encountered an error. Please try again.",
  API_KEY: "Please configure your OpenAI API key in the .env file.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
  SPEECH_NOT_SUPPORTED:
    "Speech recognition is not supported in your browser. Please try Chrome or Safari.",
};

// UI Text
export const UI_TEXT = {
  APP_NAME: "SpeakingMate",
  APP_SUBTITLE: "English Speaking Practice",
  WELCOME_MESSAGE: "Welcome,",
  WELCOME_ADMIN: "admin",
  WELCOME_SUBTITLE: "Please select a chat to start messaging.",
  STATUS_ONLINE: "Online • English Practice Partner",
  NO_MESSAGES_YET: "No messages yet",
  THINKING: "Thinking",
  PLACEHOLDER_MESSAGE: "Message",
  START_CONVERSATION: "Start a conversation with",
  INSTRUCTIONS: "You can type or use the microphone button to speak.",
  BUTTON_TITLES: {
    READ_ALOUD: "Read aloud",
    START_RECORDING: "Start recording",
    STOP_RECORDING: "Stop recording",
    SEND_MESSAGE: "Send message",
  },
};

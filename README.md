# English Speaking App

A React-based English conversation practice app with AI-powered chat, text-to-speech, and speech recognition features.

## Features

- **AI Conversation**: Chat with GPT-4o-mini for English practice
- **Text-to-Speech**: AI responses are automatically read aloud
- **Speech Recognition**: Speak your messages using the microphone button
- **Chat Interface**: Clean, modern chat bubbles interface
- **Conversation History**: Automatically saved to localStorage
- **Responsive Design**: Works on desktop and mobile devices

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure OpenAI API**
   - Copy `.env` file and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Browser Support

- **Speech Recognition**: Works best in Chrome and Safari
- **Text-to-Speech**: Supported in all modern browsers
- **Chat Interface**: Works in all modern browsers

## Usage

1. **Text Chat**: Type your message and press Enter or click the send button
2. **Voice Chat**: Click the microphone button, speak your message, then click it again to send
3. **Listen to Responses**: AI responses are automatically read aloud, or click the 🔊 button on any message
4. **Conversation History**: Your conversations are automatically saved and restored

## Technologies Used

- React 18
- Vite
- Styled Components
- OpenAI GPT-4o-mini API
- Web Speech API (Speech Recognition & Synthesis)

## File Structure

```
src/
├── App.jsx                 # Main app component
├── services/
│   └── openai.js          # OpenAI API integration
├── hooks/
│   ├── useSpeechSynthesis.js   # Text-to-speech hook
│   └── useSpeechRecognition.js # Speech recognition hook
├── index.css              # Global styles
└── main.jsx              # App entry point
```

## License

MIT License
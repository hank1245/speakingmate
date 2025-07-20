import { useState, useEffect } from "react";
import { STORAGE_KEYS, ERROR_MESSAGES, UI_TEXT } from "../constants/strings";
import { sendMessageToOpenAI } from "../services/openai";

export function useChat(initialContacts) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [allChats, setAllChats] = useState({});
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState(initialContacts);

  // Load all conversation histories and custom contacts from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem(STORAGE_KEYS.ALL_CHAT_MESSAGES);
    if (savedChats) {
      setAllChats(JSON.parse(savedChats));
    }

    const savedContacts = localStorage.getItem(STORAGE_KEYS.CUSTOM_CONTACTS);
    if (savedContacts) {
      const customContacts = JSON.parse(savedContacts);
      setContacts([...initialContacts, ...customContacts]);
    }
  }, [initialContacts]);

  // Save all chats to localStorage whenever allChats change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ALL_CHAT_MESSAGES,
      JSON.stringify(allChats)
    );
  }, [allChats]);

  const getCurrentMessages = () => {
    return currentChatId ? allChats[currentChatId] || [] : [];
  };

  const addMessage = (text, isUser = false) => {
    if (!currentChatId) return;

    const newMessage = {
      id: Date.now(),
      text,
      isUser,
      timestamp: new Date().toISOString(),
    };

    setAllChats((prev) => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), newMessage],
    }));
  };

  const getPersonalityPrompt = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    return contact ? contact.personality : "";
  };

  const handleSendMessage = async (speak) => {
    if (!inputText.trim() || isLoading || !currentChatId) return;

    const userMessage = inputText.trim();
    setInputText("");
    addMessage(userMessage, true);
    setIsLoading(true);

    try {
      const currentMessages = getCurrentMessages();
      const personalityPrompt = getPersonalityPrompt(currentChatId);
      const aiResponse = await sendMessageToOpenAI(
        userMessage,
        currentMessages,
        personalityPrompt
      );
      addMessage(aiResponse, false);

      // Automatically speak AI responses if TTS is supported
      if (speak && aiResponse) {
        setTimeout(() => speak(aiResponse), 500);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = ERROR_MESSAGES.GENERIC;

      if (error.message.includes("API key")) {
        errorMessage = ERROR_MESSAGES.API_KEY;
      } else if (error.message.includes("Rate limit")) {
        errorMessage = ERROR_MESSAGES.RATE_LIMIT;
      }

      addMessage(errorMessage, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSelect = (contactId) => {
    setCurrentChatId(contactId);
  };

  const getLastMessage = (chatId) => {
    const messages = allChats[chatId];
    if (!messages || messages.length === 0) return UI_TEXT.NO_MESSAGES_YET;
    const lastMessage = messages[messages.length - 1];
    return lastMessage.text.length > 50
      ? lastMessage.text.substring(0, 50) + "..."
      : lastMessage.text;
  };

  const handleCreateCharacter = (newCharacter) => {
    const updatedContacts = [...contacts, newCharacter];
    setContacts(updatedContacts);

    // Save custom contacts to localStorage
    const customContacts = updatedContacts.filter(
      (contact) => !initialContacts.find((initial) => initial.id === contact.id)
    );
    localStorage.setItem(
      STORAGE_KEYS.CUSTOM_CONTACTS,
      JSON.stringify(customContacts)
    );
  };

  const currentContact = contacts.find((c) => c.id === currentChatId);
  const currentMessages = getCurrentMessages();

  return {
    currentChatId,
    currentContact,
    currentMessages,
    allChats,
    inputText,
    isLoading,
    contacts,
    setInputText,
    handleSendMessage,
    handleContactSelect,
    getLastMessage,
    handleCreateCharacter,
  };
}

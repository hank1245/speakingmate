import { useState, useEffect } from "react";
import { STORAGE_KEYS, ERROR_MESSAGES, UI_TEXT } from "../constants/strings";
import { sendMessageToOpenAI, correctGrammar } from "../services/openai";

export function useChat(initialContacts) {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [allChats, setAllChats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState(initialContacts);
  const [favorites, setFavorites] = useState([]);

  // Load all conversation histories and custom contacts from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem(STORAGE_KEYS.ALL_CHAT_MESSAGES);
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      console.log("Loaded chats from localStorage:", parsedChats);
      setAllChats(parsedChats);
    }

    const savedContacts = localStorage.getItem(STORAGE_KEYS.CUSTOM_CONTACTS);
    if (savedContacts) {
      const customContacts = JSON.parse(savedContacts);
      setContacts([...initialContacts, ...customContacts]);
    }

    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [initialContacts]);

  // Save all chats to localStorage whenever allChats change
  useEffect(() => {
    // Only save if allChats has content (not empty object)
    if (Object.keys(allChats).length > 0) {
      console.log("Saving chats to localStorage:", allChats);
      localStorage.setItem(
        STORAGE_KEYS.ALL_CHAT_MESSAGES,
        JSON.stringify(allChats)
      );
    }
  }, [allChats]);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  const getCurrentMessages = () => {
    return currentChatId ? allChats[currentChatId] || [] : [];
  };

  const addMessage = (
    text,
    isUser = false,
    originalText = null,
    correctedText = null
  ) => {
    if (!currentChatId) return;

    const newMessage = {
      id: Date.now(),
      text,
      isUser,
      timestamp: new Date().toISOString(),
      originalText,
      correctedText,
      isShowingCorrected: false, // Track which version is currently displayed
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

  const handleSpeechMessage = async (speechText, speak) => {
    if (!speechText.trim() || isLoading || !currentChatId) return;

    setIsLoading(true);

    try {
      // First, correct the grammar of the speech transcript
      const grammarResult = await correctGrammar(speechText.trim());

      // Add the message with both original and corrected versions
      addMessage(
        grammarResult.original, // Display the punctuation-corrected version first
        true,
        grammarResult.original, // Original with punctuation
        grammarResult.corrected // Grammar-corrected version (null if no corrections needed)
      );

      // Then get AI response using the original punctuation-corrected text
      const currentMessages = getCurrentMessages();
      const personalityPrompt = getPersonalityPrompt(currentChatId);
      const aiResponse = await sendMessageToOpenAI(
        grammarResult.original,
        currentMessages,
        personalityPrompt
      );
      addMessage(aiResponse, false);

      // Automatically speak AI responses if TTS is supported
      if (speak && aiResponse) {
        setTimeout(() => speak(aiResponse), 500);
      }
    } catch (error) {
      console.error("Error processing speech message:", error);
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
    return lastMessage.text.length > 30
      ? lastMessage.text.substring(0, 30) + "..."
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

  const handleToggleFavorite = (contactId) => {
    setFavorites((prev) => {
      if (prev.includes(contactId)) {
        return prev.filter((id) => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const isFavorite = (contactId) => {
    return favorites.includes(contactId);
  };

  const toggleMessageCorrection = (messageId) => {
    if (!currentChatId) return;

    setAllChats((prev) => ({
      ...prev,
      [currentChatId]: prev[currentChatId].map((message) => {
        if (message.id === messageId && message.correctedText) {
          const isCurrentlyShowingCorrected = message.isShowingCorrected;
          return {
            ...message,
            text: isCurrentlyShowingCorrected
              ? message.originalText
              : message.correctedText,
            isShowingCorrected: !isCurrentlyShowingCorrected,
          };
        }
        return message;
      }),
    }));
  };

  // Organize contacts by favorites, default characters, and custom characters
  const organizedContacts = () => {
    const favoriteContacts = contacts.filter((contact) =>
      favorites.includes(contact.id)
    );
    const defaultContacts = contacts.filter((contact) =>
      initialContacts.find((initial) => initial.id === contact.id)
    );
    const customContacts = contacts.filter(
      (contact) => !initialContacts.find((initial) => initial.id === contact.id)
    );

    return {
      favorites: favoriteContacts,
      default: defaultContacts.filter(
        (contact) => !favorites.includes(contact.id)
      ),
      custom: customContacts.filter(
        (contact) => !favorites.includes(contact.id)
      ),
    };
  };

  const currentContact = contacts.find((c) => c.id === currentChatId);
  const currentMessages = getCurrentMessages();

  return {
    currentChatId,
    currentContact,
    currentMessages,
    allChats,
    isLoading,
    contacts,
    favorites,
    handleSpeechMessage,
    handleContactSelect,
    getLastMessage,
    handleCreateCharacter,
    handleToggleFavorite,
    isFavorite,
    organizedContacts,
    toggleMessageCorrection,
  };
}

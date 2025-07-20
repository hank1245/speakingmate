const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const sendMessageToOpenAI = async (
  message,
  conversationHistory = [],
  personalityPrompt = ""
) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file."
    );
  }

  // Build conversation context with personality
  const systemContent = `You are a helpful English conversation partner${
    personalityPrompt ? ` with this background: ${personalityPrompt}` : ""
  }. 

Guidelines:
- Keep responses conversational and encouraging
- Stay in character based on your personality background
- Don't correct grammar mistakes unless explicitly asked
- Ask follow-up questions to keep the conversation flowing
- Adapt your language level to match the user's proficiency
- Be patient and supportive
- Focus on practical, everyday English usage
- Draw from your background and expertise when relevant
- Keep your response shorter than 160 characters`;

  const messages = [
    {
      role: "system",
      content: systemContent,
    },
    ...conversationHistory.map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text,
    })),
    {
      role: "user",
      content: message,
    },
  ];

  const requestBody = {
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: 300,
    temperature: 0.7,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);

      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your OpenAI API key.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (response.status === 500) {
        throw new Error(
          "OpenAI service is temporarily unavailable. Please try again."
        );
      } else {
        throw new Error(
          `OpenAI API error: ${errorData.error?.message || "Unknown error"}`
        );
      }
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response received from OpenAI");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
};

export const getSuggestionForContext = async (
  conversationHistory = [],
  personalityPrompt = ""
) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file."
    );
  }

  // Build conversation context with personality
  const systemContent = `You are a helpful English conversation partner${
    personalityPrompt ? ` with this background: ${personalityPrompt}` : ""
  }. 

Based on the conversation history, suggest a natural and contextually appropriate response that the user could say to continue the conversation. 

Guidelines:
- Provide only ONE suggested response
- Make it conversational and natural
- Keep it shorter than 100 characters
- Match the user's language proficiency level
- Don't suggest questions if the assistant just asked a question
- Suggest responses that would naturally continue the conversation flow
- Make the suggestion relevant to the conversation topic

Return ONLY the suggested response text without any explanations or formatting.`;

  const messages = [
    {
      role: "system",
      content: systemContent,
    },
    ...conversationHistory.map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text,
    })),
  ];

  const requestBody = {
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: 50,
    temperature: 0.8,
    presence_penalty: 0.2,
    frequency_penalty: 0.2,
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI Suggestion Error:", errorData);

      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your OpenAI API key.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (response.status === 500) {
        throw new Error(
          "OpenAI service is temporarily unavailable. Please try again."
        );
      } else {
        throw new Error(
          `OpenAI API error: ${errorData.error?.message || "Unknown error"}`
        );
      }
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No suggestion received from OpenAI");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error getting suggestion from OpenAI API:", error);
    throw error;
  }
};


export const analyzeConversationErrors = async (
  conversationHistory = [],
  contactName = "",
  conversationDate = ""
) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file."
    );
  }

  // Filter only user messages for analysis
  const userMessages = conversationHistory.filter(msg => msg.isUser && msg.text && msg.text.trim());

  if (userMessages.length === 0) {
    return {
      conversationInfo: {
        contactName,
        date: conversationDate,
        totalUserMessages: 0
      },
      errors: [],
      summary: "No user messages found in this conversation."
    };
  }

  const messages = [
    {
      role: "system",
      content: `You are an English grammar analysis assistant. Analyze the user's messages from a conversation for grammatical errors and language learning opportunities.

Analyze the following user messages and provide a comprehensive report in this exact JSON format:
{
  "conversationInfo": {
    "contactName": "${contactName}",
    "date": "${conversationDate}",
    "totalUserMessages": ${userMessages.length}
  },
  "errors": [
    {
      "messageText": "exact user message with error",
      "errorType": "grammar|word_choice|sentence_structure|punctuation|spelling",
      "errorDescription": "brief description of what's wrong",
      "suggestion": "corrected version",
      "explanation": "why this is better and learning tip",
      "severity": "high|medium|low"
    }
  ],
  "summary": "overall assessment of the user's English level and main areas for improvement"
}

Guidelines:
- Only analyze user messages (not assistant responses)
- Focus on errors that would help with learning
- Ignore minor stylistic preferences
- Prioritize grammar, word choice, and sentence structure issues
- Be encouraging but specific about improvements
- If no significant errors are found, return an empty errors array
- Severity: high = affects meaning/comprehension, medium = grammatically incorrect but understandable, low = minor improvements`,
    },
    {
      role: "user",
      content: `Please analyze these user messages from a conversation:

${userMessages.map((msg, index) => `Message ${index + 1}: "${msg.text}"`).join('\n')}`,
    },
  ];

  const requestBody = {
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: 800,
    temperature: 0.2,
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI Conversation Analysis Error:", errorData);
      throw new Error(`Conversation analysis failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No analysis received from OpenAI");
    }

    const responseText = data.choices[0].message.content.trim();
    
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse conversation analysis response:", responseText);
      // Return a fallback response if JSON parsing fails
      return {
        conversationInfo: {
          contactName,
          date: conversationDate,
          totalUserMessages: userMessages.length
        },
        errors: [],
        summary: "Analysis completed but response format was unexpected."
      };
    }
  } catch (error) {
    console.error("Error analyzing conversation:", error);
    throw error;
  }
};

export const correctGrammar = async (text) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file."
    );
  }

  const messages = [
    {
      role: "system",
      content:
        "You are a grammar correction assistant. For the given text, provide two versions:\n1. First, add only proper punctuation (periods, question marks, etc.) to complete the sentence without changing grammar\n2. Second, if there are any grammar mistakes, provide a grammatically corrected version\n\nFormat your response as:\n[First sentence with punctuation]\n#\n[Second sentence with grammar corrections]\n\nIf there are no grammar mistakes needed, return only the first sentence (with punctuation) without the # separator. Return ONLY the corrected text without any explanations or additional comments.",
    },
    {
      role: "user",
      content: text,
    },
  ];

  const requestBody = {
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: 150,
    temperature: 0.1,
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI Grammar Correction Error:", errorData);
      // If grammar correction fails, return original text
      return { original: text, corrected: null };
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return { original: text, corrected: null };
    }

    const responseText = data.choices[0].message.content.trim();

    // Parse the response
    if (responseText.includes("#")) {
      const [original, corrected] = responseText
        .split("#")
        .map((s) => s.trim());
      return { original, corrected };
    } else {
      // No grammar corrections needed
      return { original: responseText, corrected: null };
    }
  } catch (error) {
    console.error("Error correcting grammar:", error);
    // If error occurs, return original text
    return { original: text, corrected: null };
  }
};

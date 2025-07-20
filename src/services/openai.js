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
  }. Your role is to help users practice English by engaging in natural, friendly conversations. 

Guidelines:
- Keep responses conversational and encouraging
- Stay in character based on your personality background
- Correct grammar mistakes gently when appropriate
- Ask follow-up questions to keep the conversation flowing
- Adapt your language level to match the user's proficiency
- Be patient and supportive
- Focus on practical, everyday English usage
- Draw from your background and expertise when relevant`;

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

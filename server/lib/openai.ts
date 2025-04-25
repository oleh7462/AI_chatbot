import OpenAI from "openai";
import { Message } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "your-api-key" // Should be set via environment variable
});

// Format messages for the OpenAI API
function formatMessagesForOpenAI(previousMessages: Message[], newMessage?: string): Array<{ role: string; content: string }> {
  const formattedMessages = previousMessages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  if (newMessage) {
    formattedMessages.push({
      role: "user",
      content: newMessage
    });
  }

  // Add a system message at the beginning if there isn't one already
  if (formattedMessages.length === 0 || formattedMessages[0].role !== "system") {
    formattedMessages.unshift({
      role: "system",
      content: "You are a helpful, friendly, and knowledgeable AI assistant. Provide detailed and accurate responses to user questions. Be concise when appropriate, but provide comprehensive information when needed."
    });
  }

  return formattedMessages;
}

// Generate an AI response for a chat message
export async function generateAIResponse(previousMessages: Message[], newMessage: string): Promise<string> {
  try {
    const messages = formatMessagesForOpenAI(previousMessages, newMessage);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I apologize, but I encountered an error processing your request. Please try again later.";
  }
}

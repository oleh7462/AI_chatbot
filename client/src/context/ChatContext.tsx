import React, { createContext, useContext, useState, useEffect } from "react";
import { Chat, Message } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

interface ChatContextProps {
  activeChat: string | null;
  chats: Chat[];
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  startNewChat: () => void;
  switchChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch chats from the backend on initial load
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  async function fetchChats() {
    try {
      const response = await apiRequest("GET", "/api/chats", undefined);
      const data = await response.json();
      setChats(data);
      
      // Set the active chat to the most recent one if available
      if (data.length > 0 && !activeChat) {
        setActiveChat(data[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats. Please try again.",
        variant: "destructive",
      });
    }
  }
  
  async function fetchMessages(chatId: string) {
    try {
      setMessages([]); // Clear messages while loading
      const response = await apiRequest("GET", `/api/chats/${chatId}/messages`, undefined);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function sendMessage(content: string) {
    // Create a new chat if no active chat
    if (!activeChat) {
      startNewChat();
      // This will set activeChat and call this function again
      return;
    }

    try {
      // Add user message to local state immediately
      const userMessage: Message = {
        id: uuidv4(),
        content,
        role: "user",
        chatId: activeChat,
        createdAt: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      
      // Send the message to the API
      const response = await apiRequest("POST", `/api/chats/${activeChat}/messages`, {
        content,
        role: "user",
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      // Fetch the updated messages (including AI response)
      fetchMessages(activeChat);
      
      // Update the chat list to show the most recent activity
      fetchChats();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function startNewChat() {
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChatId);
    setMessages([]);
    
    // Create the chat on the backend
    apiRequest("POST", "/api/chats", { id: newChatId, title: "New Chat" })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to create new chat. Please try again.",
          variant: "destructive",
        });
      });
  }

  function switchChat(chatId: string) {
    setActiveChat(chatId);
  }

  return (
    <ChatContext.Provider
      value={{
        activeChat,
        chats,
        messages,
        isLoading,
        sendMessage,
        startNewChat,
        switchChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

import { useRef, useEffect } from "react";
import { useChatContext } from "@/context/ChatContext";
import { Activity } from "lucide-react";
import { Message } from "@/lib/types";

export default function ChatMessages() {
  const { messages, isLoading } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 chat-container">
      {/* Welcome Message if no messages yet */}
      {messages.length === 0 && (
        <div className="flex items-start max-w-3xl mx-auto">
          <div className="flex-shrink-0 mr-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="message-bubble-ai bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm max-w-[85%]">
            <p className="text-gray-800 dark:text-gray-300">Hi there! I'm your AI assistant. How can I help you today?</p>
          </div>
        </div>
      )}

      {/* Render all messages */}
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}

      {/* Typing indicator */}
      {isLoading && (
        <div className="flex items-start max-w-3xl mx-auto">
          <div className="flex-shrink-0 mr-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="message-bubble-ai bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm typing-indicator">
            <p className="text-gray-500 dark:text-gray-400 flex">
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </p>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex items-start max-w-3xl mx-auto justify-end">
        <div className="message-bubble-user bg-blue-600 text-white p-4 rounded-lg shadow-sm max-w-[85%]">
          <p className="text-white">{message.content}</p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200">
            <span className="text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-start max-w-3xl mx-auto">
        <div className="flex-shrink-0 mr-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="message-bubble-ai bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm max-w-[85%]">
          <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }
}

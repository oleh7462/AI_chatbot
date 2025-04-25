import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useChatContext();

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    sendMessage(message);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 min-h-[56px] bg-gray-100 dark:bg-gray-800 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 overflow-hidden">
            <div className="px-3 py-2 min-h-[56px] flex">
              <textarea 
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none py-1 px-0 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Type your message here..."
                rows={1}
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
          <span>Powered by OpenAI API • </span>
          <button className="ml-1 text-primary-600 dark:text-primary-400 hover:underline focus:outline-none">Terms</button>
          <span className="mx-1">•</span>
          <button className="text-primary-600 dark:text-primary-400 hover:underline focus:outline-none">Privacy policy</button>
        </div>
      </div>
    </div>
  );
}

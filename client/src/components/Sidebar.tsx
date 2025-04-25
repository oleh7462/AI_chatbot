import { useChatContext } from "@/context/ChatContext";
import { Activity, MenuIcon, PlusIcon, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile, onClose }: SidebarProps) {
  const { chats, activeChat, startNewChat, switchChat } = useChatContext();

  const handleStartNewChat = () => {
    startNewChat();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleChatClick = (chatId: string) => {
    switchChat(chatId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`${isMobile ? "w-full" : "w-64"} flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="font-semibold text-lg">AI Assistant</h2>
          </div>
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <button 
          onClick={handleStartNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          <PlusIcon className="h-5 w-5" />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Chats</h3>
            
            {chats.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className={`w-full flex items-center px-4 py-2 text-sm text-left rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeChat === chat.id ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
              >
                <div className="flex-1 truncate text-gray-900 dark:text-gray-100">{chat.title || "New Conversation"}</div>
                {chat.updatedAt && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: false })}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <span className="text-sm font-medium">U</span>
            </div>
            <div className="text-sm font-medium">User</div>
          </div>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

import { useState } from "react";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { Info, Sliders } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const { activeChat } = useChatContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - shown on desktop or when toggled on mobile */}
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <div className={`${window.innerWidth < 1024 ? "fixed inset-0 z-40 lg:relative" : ""}`}>
            {window.innerWidth < 1024 && (
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleSidebar}></div>
            )}
            <div className={`relative z-50 h-full ${window.innerWidth < 1024 ? "w-3/4 max-w-xs" : ""}`}>
              <Sidebar isMobile={window.innerWidth < 1024} onClose={toggleSidebar} />
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
          {/* Desktop Header */}
          <header className="hidden lg:flex px-6 py-4 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Current Chat</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                <Sliders className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                <Info className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Chat Messages */}
          <ChatMessages />

          {/* Chat Input */}
          <ChatInput />
        </main>
      </div>
    </div>
  );
}

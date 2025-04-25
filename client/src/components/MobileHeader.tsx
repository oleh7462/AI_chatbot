import { MenuIcon, Settings } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 focus:outline-none"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-lg font-semibold">AI Assistant</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          <Settings className="h-5 w-5" />
        </button>
        <div className="relative">
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <span className="sr-only">User profile</span>
            <span className="text-sm font-medium">U</span>
          </button>
        </div>
      </div>
    </header>
  );
}

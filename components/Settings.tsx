import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Globe, User, LogOut } from 'lucide-react';

const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleNotifications = () => setNotifications(!notifications);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Settings"
      >
        Settings
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2">
            <div className="px-4 py-2 text-sm font-medium text-gray-900">Settings</div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded"
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </button>

            {/* Notifications Toggle */}
            <button
              onClick={toggleNotifications}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded"
            >
              <Bell className="w-4 h-4" />
              Notifications {notifications ? 'On' : 'Off'}
            </button>

            {/* Language Option */}
            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded">
              <Globe className="w-4 h-4" />
              Language
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Profile */}
            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 rounded">
              <User className="w-4 h-4" />
              Profile
            </button>

            {/* Logout */}
            <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-3 rounded">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
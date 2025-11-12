import React, { useState, useEffect } from 'react';
import { FileText, Sun, Moon, LogOut } from 'lucide-react';

const Header = ({ onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    const v = !darkMode;
    setDarkMode(v);
    localStorage.setItem('darkMode', v.toString());
    document.documentElement.classList.toggle('dark', v);
  };

  const tecnico = localStorage.getItem('tecnicoCode')

  return (
    <header className="bg-white dark:bg-gray-800 border-b-2 border-black dark:border-white sticky top-0 z-50">
      <div className="container px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">HenkanCX Synk</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Sistema de Inspección Inteligente</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-600 dark:text-gray-300 mr-2">{tecnico ? `Técnico: ${tecnico}` : ''}</div>
          <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
          {onLogout && (
            <button onClick={onLogout} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

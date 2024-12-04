import React from 'react';
import {useTheme} from "@/app/hooks/useTheme";

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="px-2 py-2 bg-zinc-200 hover:bg-zinc-300 drop-shadow-md w-12
               dark:bg-gray-700 text-gray-800 dark:text-gray-200
               hover:dark:bg-gray-600 rounded-full
               transition-colors duration-300 ease-in-out"
        >
            {theme === 'light' ? (
                <img src="/images/light.png" alt="Light" className="w-8 h-8"/>
            ) : (
                <img src="/images/dark.png" alt="Dark" className="w-8 h-8"/>
            )}
        </button>
    );
};

export default ThemeToggle;

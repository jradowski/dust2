import React from 'react';
import {useTheme} from "@/app/hooks/useTheme";

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded"
        >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
    );
};

export default ThemeToggle;

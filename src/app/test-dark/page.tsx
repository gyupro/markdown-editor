'use client';

import { useTheme } from '@/hooks/useTheme';

export default function TestDarkPage() {
  const { theme, toggleTheme, isLoaded } = useTheme();

  if (!isLoaded) {
    return <div>Loading theme...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Dark Mode Test Page</h1>
        
        <div className="space-y-2">
          <p>Current theme: <strong>{theme}</strong></p>
          <p>Document class list: <code>{typeof window !== 'undefined' ? document.documentElement.classList.toString() : 'Loading...'}</code></p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme
        </button>

        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Test Card</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This card should have a white background in light mode and dark gray background in dark mode.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded">
              <p className="text-gray-800 dark:text-gray-100">Light gray / Very dark gray</p>
            </div>
            <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded">
              <p className="text-gray-900 dark:text-white">Gray 200 / Gray 800</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-500 dark:text-gray-400">Gray 500 / Gray 400</p>
            <p className="text-gray-600 dark:text-gray-300">Gray 600 / Gray 300</p>
            <p className="text-gray-700 dark:text-gray-200">Gray 700 / Gray 200</p>
            <p className="text-gray-800 dark:text-gray-100">Gray 800 / Gray 100</p>
            <p className="text-gray-900 dark:text-white">Gray 900 / White</p>
          </div>
        </div>
      </div>
    </div>
  );
}
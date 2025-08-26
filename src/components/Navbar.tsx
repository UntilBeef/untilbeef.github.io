import { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

import { useTheme } from '@/hooks/useTheme';

export function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
           {/* Logo, title and theme toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <i className="fa-solid fa-code text-white"></i>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Roblox Lua 教程</span>
            </div>
            <button 
              id="theme-toggle" 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
            >
              {isDark ? (
                <i className="fa-solid fa-sun text-yellow-400"></i> // 暗色模式显示太阳图标
                ) : (
                <i className="fa-solid fa-moon text-gray-700 dark:text-gray-300"></i> // 默认显示月亮图标
                )}
            </button>
          </div>

          {/* Desktop search */}
          <div className="hidden md:flex relative w-1/3">
            <input
              type="text"
              placeholder="搜索文档内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            <i className="fa-solid fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            
            {/* Search results */}
            {isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                <div className="p-2 text-sm font-medium text-gray-500 dark:text-gray-400">搜索结果 ({searchResults.length})</div>
                {searchResults.map((result, index) => (
                  <div key={index} className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{result.section.title} - {result.subsection.title}</div>
                    {result.matches.map((match, mIndex) => (
                      <div key={mIndex} className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {match.type === 'title' ? (
                          <span className="italic">标题匹配: </span>
                        ) : (
                          <span className="italic">内容预览: </span>
                        )}
                        {match.text}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            
            {isSearching && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                <div className="text-sm text-gray-500 dark:text-gray-400">未找到与 "{searchQuery}" 匹配的结果</div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {showMobileMenu ? (
                <i className="fa-solid fa-times"></i>
              ) : (
                <i className="fa-solid fa-bars"></i>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索文档内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            <i className="fa-solid fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          {/* Mobile search results */}
          {isSearching && searchResults.length > 0 && (
            <div className="mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-50">
              <div className="p-2 text-sm font-medium text-gray-500 dark:text-gray-400">搜索结果 ({searchResults.length})</div>
              {searchResults.map((result, index) => (
                <div key={index} className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{result.section.title} - {result.subsection.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
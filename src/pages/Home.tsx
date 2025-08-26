import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Hero section */}
      <div className="flex-1 container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-lg">
          <i className="fa-solid fa-code text-white text-3xl"></i>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Roblox Lua <span className="text-blue-600 dark:text-blue-400">编程教程</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10">
          从零开始学习 Roblox Lua 编程，掌握游戏开发的核心技能。本教程涵盖变量、函数、数据类型、控制流和面向对象编程等所有核心知识点。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/docs"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            开始学习
            <i className="fa-solid fa-arrow-right ml-2"></i>
          </Link>
          
          <a
            href="https://space.bilibili.com/3546854264408363?spm_id_from=333.1007.0.0"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            <i className="fa-brands fa-bilibili mr-2"></i>
            B站主页
          </a>
        </div>
      </div>
      
      {/* Features section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">教程特点</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-book text-blue-600 dark:text-blue-400 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">全面的内容</h3>
              <p className="text-gray-600 dark:text-gray-400">
                涵盖从基础语法到高级面向对象编程的所有核心知识点，满足不同层次学习者的需求。
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-code text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">丰富的示例</h3>
              <p className="text-gray-600 dark:text-gray-400">
                每个知识点都配有详细的代码示例和解释，帮助您更好地理解和应用所学内容。
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <i className="fa-solid fa-search text-purple-600 dark:text-purple-400 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">快速搜索</h3>
              <p className="text-gray-600 dark:text-gray-400">
                内置强大的搜索功能，让您可以快速找到所需的知识点和代码示例。
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Roblox Lua 编程教程 | 编者: UntilBeef</p>          
        </div>
      </footer>
    </div>
  );
}
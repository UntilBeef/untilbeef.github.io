import { cn } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              编者和开发者: <span className="font-medium text-gray-900 dark:text-white">UntilBeef</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              © {new Date().getFullYear()} Roblox Lua 教程文档. 保留所有权利.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://space.bilibili.com/3546854264408363?spm_id_from=333.1007.0.0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <i className="fa-brands fa-bilibili mr-2"></i>
              <span>B站个人主页</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
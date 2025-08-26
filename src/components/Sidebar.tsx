import { useState } from 'react';
import { docsData } from '@/data/docs';
import { cn } from '@/lib/utils';

interface SidebarProps {
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  activeSectionId: string | null;
  activeSubsectionId: string | null;
  onSectionClick: (sectionId: string, subsectionId: string) => void;
}

export function Sidebar({ 
  mobileMenuOpen, 
  onCloseMobileMenu, 
  activeSectionId, 
  activeSubsectionId, 
  onSectionClick 
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    // 默认展开第一个章节
    docsData.length > 0 ? [docsData[0].id] : []
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:static md:translate-x-0",
        "md:h-[calc(100vh-4rem)] md:overflow-y-auto"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">文档目录</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {docsData.map((section) => (
            <div key={section.id} className="mb-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <span>{section.title}</span>
                <i className={cn(
                  "fa-solid", 
                  expandedSections.includes(section.id) ? "fa-chevron-down" : "fa-chevron-right",
                  "text-xs text-gray-400"
                )}></i>
              </button>
              
              {expandedSections.includes(section.id) && section.subsections && (
                <div className="mt-1 ml-4 space-y-1">
                  {section.subsections.map((subsection) => (
                    <button
                      key={subsection.id}
                      onClick={() => {
                        onSectionClick(section.id, subsection.id);
                        onCloseMobileMenu();
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md",
                        activeSectionId === section.id && activeSubsectionId === subsection.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {subsection.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
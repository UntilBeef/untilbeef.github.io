import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DocumentationContent } from '@/components/DocumentationContent';
import { Footer } from '@/components/Footer';
import { docsData } from '@/data/docs';

export default function Documentation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSubsectionId, setActiveSubsectionId] = useState<string | null>(null);

  // 初始化默认章节
  useEffect(() => {
    if (docsData.length > 0 && docsData[0].subsections && docsData[0].subsections.length > 0) {
      setActiveSectionId(docsData[0].id);
      setActiveSubsectionId(docsData[0].subsections[0].id);
    }
  }, []);

  const handleSectionClick = (sectionId: string, subsectionId: string) => {
    setActiveSectionId(sectionId);
    setActiveSubsectionId(subsectionId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 导航栏 */}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 */}
        <Sidebar 
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          activeSectionId={activeSectionId}
          activeSubsectionId={activeSubsectionId}
          onSectionClick={handleSectionClick}
        />
        
        {/* 移动菜单遮罩 */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
        
        {/* 主内容区域 */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <DocumentationContent 
            sectionId={activeSectionId} 
            subsectionId={activeSubsectionId} 
          />
        </main>
      </div>
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
}
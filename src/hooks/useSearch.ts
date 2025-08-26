import { useState, useEffect } from 'react';
import { docsData, DocSection, DocSubsection } from '@/data/docs';

interface SearchResult {
  section: DocSection;
  subsection: DocSubsection;
  matches: {
    type: 'content' | 'title';
    text: string;
  }[];
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery);
        setIsSearching(true);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = (query: string) => {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    docsData.forEach(section => {
      section.subsections?.forEach(subsection => {
        const matches: SearchResult['matches'] = [];
        
        // 检查标题是否匹配
        if (subsection.title.toLowerCase().includes(lowerQuery)) {
          matches.push({
            type: 'title',
            text: subsection.title
          });
        }
        
        // 检查内容是否匹配
        if (subsection.content.toLowerCase().includes(lowerQuery)) {
          matches.push({
            type: 'content',
            text: getPreviewText(subsection.content, lowerQuery)
          });
        }
        
        // 如果有匹配项，添加到结果中
        if (matches.length > 0) {
          results.push({
            section,
            subsection,
            matches
          });
        }
      });
    });

    setSearchResults(results);
  };

  const getPreviewText = (content: string, query: string) => {
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(query);
    
    if (index === -1) return content.substring(0, 100) + '...';
    
    // 获取查询前后的文本预览
    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + query.length + 30);
    
    return (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching
  };
}
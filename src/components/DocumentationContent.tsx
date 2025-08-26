import { docsData, DocSection, DocSubsection, Diagram, Step, CommonError } from '@/data/docs';
import CodeEditor from './CodeEditor';
import { cn } from '@/lib/utils';

interface DocumentationContentProps {
  sectionId: string | null;
  subsectionId: string | null;
}

export function DocumentationContent({ sectionId, subsectionId }: DocumentationContentProps) {
  // 如果没有选择章节，默认显示介绍内容
  if (!sectionId || !subsectionId) {
    const introSection = docsData.find(s => s.id === "introduction");
    const firstSubsection = introSection?.subsections?.[0];
    
    if (introSection && firstSubsection) {
      return renderContent(introSection, firstSubsection);
    }
    
    // 如果没有介绍章节，显示欢迎信息
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-book-open text-blue-600 dark:text-blue-400 text-2xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">欢迎来到 Roblox Lua 教程</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          选择左侧目录中的章节开始学习 Roblox Lua 编程。本教程涵盖从基础语法到高级面向对象编程的所有核心概念。
        </p>
      </div>
    );
  }
  
  // 查找当前选中的章节和子章节
  const section = docsData.find(s => s.id === sectionId);
  const subsection = section?.subsections?.find(ss => ss.id === subsectionId);
  
  if (!section || !subsection) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div className="text-red-500 mb-4">
          <i className="fa-solid fa-exclamation-circle text-2xl"></i>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">内容未找到</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          抱歉，请求的文档内容不存在或已被移动。
        </p>
      </div>
    );
  }
  
  return renderContent(section, subsection);
}

function renderContent(section: DocSection, subsection: DocSubsection) {
  // Helper component for rendering diagrams
  const ConceptDiagram = ({ diagram }: { diagram: Diagram }) => {
    const imageUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(diagram.prompt)}`;
    
    return (
      <div className="my-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{diagram.title}</h4>
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-3">
          <img 
            src={imageUrl} 
            alt={diagram.description}
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{diagram.description}</p>
      </div>
    );
  };
  
  // Helper component for note box
  const NoteBox = ({ content }: { content: string }) => (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg my-6">
      <div className="flex items-start">
        <i className="fa-solid fa-exclamation-triangle text-yellow-500 mt-1 mr-3 text-lg"></i>
        <div>
          <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">注意</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">{content}</p>
        </div>
      </div>
    </div>
  );
  
  // Helper component for step-by-step instructions
  const StepByStep = ({ steps }: { steps: Step[] }) => {
    return (
      <div className="my-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">操作步骤</h3>
        <div className="space-y-8">
          {steps.map((step, index) => {
            const imageUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(step.screenshotPrompt)}`;
            
            return (
              <div key={index} className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200 mb-3">{step.instruction}</p>
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img 
                      src={imageUrl} 
                      alt={`Step ${index + 1}: ${step.instruction}`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  {step.highlightArea && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                      提示: 重点关注{step.highlightArea}区域
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Helper component for common errors
  const CommonErrors = ({ errors }: { errors: CommonError[] }) => {
    return (
      <div className="my-8 bg-red-50 dark:bg-red-900/10 p-5 rounded-xl">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-4 flex items-center">
          <i className="fa-solid fa-exclamation-circle mr-2"></i>常见问题与解决方法
        </h3>
        <div className="space-y-4">
          {errors.map((error, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{error.error}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><span className="font-medium">原因:</span> {error.cause}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">解决方法:</span> {error.solution}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{section.title}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{subsection.title}</h2>
      </div>
      
      <div className="prose dark:prose-invert prose-lg max-w-none">
        <p>{subsection.content}</p>
        
        {/* Render diagrams if any */}
        {subsection.diagrams && subsection.diagrams.map((diagram, index) => (
          <ConceptDiagram key={index} diagram={diagram} />
        ))}
        
        {/* Render note if exists */}
        {subsection.note && <NoteBox content={subsection.note} />}
        
        {/* Render steps if any */}
        {subsection.steps && <StepByStep steps={subsection.steps} />}
        
        {/* Render common errors if any */}
        {subsection.commonErrors && <CommonErrors errors={subsection.commonErrors} />}
        
        {/* Render code examples if any */}
        {subsection.codeExamples && subsection.codeExamples.length > 0 && ( 
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">代码示例</h3>
            <div className="space-y-6">
              {subsection.codeExamples.map((example, index) => (
                <div key={index} className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
                  {example.title && (
                    <div className="bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300">
                      {example.title}
                    </div>
                  )}
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                  {example.explanation && (
                    <div className="bg-gray-800/50 px-4 py-3 text-sm text-gray-300 border-t border-gray-800">
                      <i className="fa-solid fa-info-circle mr-2 text-blue-400"></i>
                      {example.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Fill-in-the-blank code exercise */}
        {subsection.fillInTheBlankCode && (
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              <i className="fa-solid fa-pencil text-blue-500 mr-2"></i>填空式练习
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              请完成以下代码，补充缺失的部分：
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">              
              {Object.entries(subsection.fillInTheBlankCode.placeholders).map(([key, value]) => (
                <div key={key} className="mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm font-medium mr-2">
                    {{key}}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{value}</span>
                </div>
              ))}
            </div>
            <CodeEditor 
              initialCode={subsection.fillInTheBlankCode.template} 
              height="300px" 
            />
          </div>
        )}
        {/* Regular code editor section */}
        {subsection.hasEditor && !subsection.fillInTheBlankCode && (
          <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              <i className="fa-solid fa-code text-green-500 mr-2"></i>在线代码编辑器
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              在下方编辑器中尝试编写代码，点击"运行"按钮查看结果：
            </p>
            <CodeEditor 
              initialCode={subsection.codeExamples?.[0]?.code || ""} 
              height="300px" 
            />
          </div>
        )}
      </div>
    </div>
  );
}
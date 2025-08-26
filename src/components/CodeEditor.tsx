import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { toast } from 'sonner';

interface CodeEditorProps {
  initialCode: string;
  height?: string;
  solutionCode?: string;
}

export default function CodeEditor({ initialCode, height = "200px", solutionCode }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Validate fill-in-the-blank code against solution
  const validateCode = () => {
    if (!solutionCode) return null;
    
    // Simple validation logic - can be enhanced
    const userLines = code.split('\n');
    const solutionLines = solutionCode.split('\n');
    const errors: {line: number, message: string}[] = [];
    
    // Check if all placeholders have been replaced
    if (code.includes('{{')) {
      const placeholders = code.match(/{{\w+}}/g);
      if (placeholders && placeholders.length > 0) {
        return {
          isCorrect: false,
          message: `还有未完成的填空: ${placeholders.join(', ')}`,
          errors: placeholders.map(placeholder => ({
            line: code.split('\n').findIndex(line => line.includes(placeholder)) + 1,
            message: `请填写${placeholder}`
          }))
        };
      }
    }
    
    // Compare line by line for more detailed feedback
    for (let i = 0; i < Math.max(userLines.length, solutionLines.length); i++) {
      const userLine = userLines[i]?.trim() || '';
      const solutionLine = solutionLines[i]?.trim() || '';
      
      if (userLine !== solutionLine && solutionLine) {
        errors.push({
          line: i + 1,
          message: `此处应为: "${solutionLine}"`
        });
      }
    }
    
    if (errors.length === 0) {
      return {
        isCorrect: true,
        message: "恭喜！你已正确完成所有填空！"
      };
    } else {
      return {
        isCorrect: false,
        message: `发现${errors.length}处错误`,
        errors
      };
    }
  };
  
  // 模拟代码运行
  const runCode = () => {
    setIsRunning(true);
    setOutput(null);
    setValidationResult(null);
    
    // 简单模拟代码执行延迟
    setTimeout(() => {
      try {
        // 如果提供了解决方案代码，先进行验证
        if (solutionCode) {
          const validation = validateCode();
          setValidationResult(validation);
          
          if (!validation?.isCorrect) {
            toast.error("代码还有错误，请检查并修正");
            setOutput(validation?.message || "代码验证失败");
            setIsRunning(false);
            return;
          }
        }
        
        // 在实际应用中，这里会连接到真实的代码执行环境
        // 这里仅做模拟处理
        if (code.includes("print")) {
          const printOutput = code.match(/print\("(.*?)"\)/);
          if (printOutput && printOutput[1]) {
            setOutput(`输出: ${printOutput[1]}`);
            toast.success(solutionCode ? "代码正确且执行成功！" : "代码执行成功！");
            
            // 如果这是填空练习且正确，显示成功消息
            if (solutionCode) {
              setValidationResult({
                isCorrect: true,
                message: "太棒了！你已经掌握了这个知识点！"
              });
            }
          } else {
            setOutput("代码执行成功，但没有输出内容"); 
            toast.success("代码执行成功！");
          }
        } else {
          setOutput("代码执行成功");
          toast.success("代码执行成功！");
        }
      } catch (error) {
        setOutput(`错误: ${error instanceof Error ? error.message : String(error)}`);
        toast.error("代码执行出错");
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <button
          onClick={runCode}
          disabled={isRunning}
          className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-1"></i> 运行中...
            </>
          ) : (
            <>
              <i className="fa-solid fa-play mr-1"></i> 运行
            </>
          )}
        </button>
      </div>
      
      <MonacoEditor
        height={height}
        language="lua"
        value={code}
        onChange={(value) => value && setCode(value)}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          theme: "vs-dark",
          lineNumbers: "on",
        }}
      />
      
      {output && (
        <div className="bg-gray-800/50 px-4 py-3 text-sm text-gray-300 border-t border-gray-700">
          <div className="flex items-center">
            <i className="fa-solid fa-terminal mr-2 text-blue-400"></i>
            <span>{output}</span>
          </div>
        </div>
        
      )}
    </div>
  );
}
export interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections?: DocSubsection[];
}

export interface Step {
  instruction: string;
  screenshotPrompt: string;
  highlightArea?: string;
}

export interface CommonError {
  error: string;
  cause: string; 
  solution: string;
}

export interface Diagram {
  title: string;
  description: string;
  prompt: string; // For image generation
}

export interface FillInTheBlankCode {
  template: string; // With placeholders like {{placeholder}}
  placeholders: {[key: string]: string}; // Explanations for each placeholder
  solution: string; // Complete correct code
}

export interface DocSubsection { 
 id: string;
  title: string; 
  content: string;
  diagrams?: Diagram[];
 steps?: Step[];
  note?: string; // Important note before steps
  commonErrors?: CommonError[];
  codeExamples?: CodeExample[]; 
 fillInTheBlankCode?: FillInTheBlankCode; // For guided practice
  hasEditor?: boolean;
} 

export interface CodeExample {
  title?: string; 
  code: string;
  explanation?: string;
}

export const docsData: DocSection[] = [
  {
    id: "introduction",
    title: "介绍",
    content: "Roblox Lua是一种基于Lua 5.1版本的脚本语言，专为Roblox平台设计。它允许开发者创建游戏机制、交互系统和自定义内容。本教程将涵盖Roblox Lua的核心语法和概念。",
     subsections: [
       {
         id: "what-is-roblox-lua",
         title: "什么是Roblox Lua",
         content: "Roblox Lua是Roblox游戏平台使用的主要编程语言，可以用来创建游戏逻辑、角色行为、GUI界面和其他交互元素。它基于标准Lua语言，但包含了Roblox平台特有的API扩展。",
         diagrams: [
           {
             title: "Roblox开发流程示意图",
             description: "Roblox游戏开发的基本流程，从安装Studio到发布游戏",
             prompt: "Roblox game development workflow diagram showing installation, creating game, scripting, testing, and publishing steps"
           }
         ],
         codeExamples: [ ]
       },
       {
         id: "setting-up-environment",
         title: "设置开发环境",
         content: "安装并配置Roblox Studio，为编写Lua代码做好准备。",
         note: "请确保您的电脑满足Roblox Studio的最低系统要求，包括Windows 10或macOS 10.15以上版本。",
         steps: [
           {
             instruction: "访问Roblox官网下载页面",
             screenshotPrompt: "Roblox Studio download page with download button highlighted",
             highlightArea: "Download button"
           },
           {
             instruction: "点击下载按钮，运行安装程序",
             screenshotPrompt: "Roblox Studio installer showing installation progress",
             highlightArea: "Installation progress bar"
           },
           {
             instruction: "安装完成后，点击桌面上的Roblox Studio图标启动程序",
             screenshotPrompt: "Roblox Studio desktop icon with launch animation",
             highlightArea: "Desktop icon"
           }
         ],
         commonErrors: [
           {
             error: "安装程序无法启动",
             cause: "可能是由于您的系统不满足最低要求或存在权限问题",
             solution: "检查您的操作系统版本，确保以管理员身份运行安装程序"
           },
           {
             error: "安装过程中卡住",
             cause: "可能是由于网络问题或防病毒软件干扰",
             solution: "检查网络连接，暂时禁用防病毒软件后重试"
           },
           {
             error: "无法找到桌面图标",
             cause: "安装时可能未勾选创建桌面快捷方式选项",
             solution: "在开始菜单或应用文件夹中搜索Roblox Studio，或重新安装并确保勾选创建桌面快捷方式"
           }
         ],
         codeExamples: [ ]
       }
    ]
  },
  {
    id: "variables",
    title: "变量",
    content: "变量是存储数据的容器，在Roblox Lua中可以存储数字、字符串、布尔值等不同类型的数据。",
     subsections: [
       { // 变量声明
         id: "variable-declaration",
         title: "变量声明",
         content: "变量是存储数据的容器，在Roblox Lua中创建变量非常简单，只需两步即可完成。",
         diagrams: [
           {
             title: "变量概念图解",
             description: "变量就像贴有标签的盒子，可以存放不同类型的数据",
             prompt: "Variable concept diagram showing labeled boxes containing different data types like numbers, strings and booleans"
           }
         ],
         note: "在Roblox Lua中，强烈建议始终使用local关键字声明变量，这有助于避免命名冲突和内存泄漏。",
         steps: [
           {
             instruction: "使用local关键字声明变量",
             screenshotPrompt: "Roblox Studio script editor showing local variable declaration syntax",
             highlightArea: "local keyword"
           },
           {
             instruction: "为变量赋值",
             screenshotPrompt: "Roblox Studio script editor showing variable assignment with equals sign highlighted",
             highlightArea: "Equals sign and value"
           }
         ],
         commonErrors: [
           {
             error: "忘记使用local关键字",
             cause: "直接声明变量而不使用local会创建全局变量",
             solution: "总是在变量前添加local关键字，如: local score = 100"
           },
           {
             error: "使用错误的赋值符号",
             cause: "使用了==(比较)而不是=(赋值)",
             solution: "赋值使用单个等号: local name = \"Player\"，比较才使用双等号: if score == 100 then"
           },
           {
             error: "变量名与内置函数冲突",
             cause: "使用了像print或wait这样的内置函数名作为变量名",
             solution: "选择独特的变量名，避免使用Roblox Lua内置函数名"
           }
         ],
         codeExamples: [
           {
             code: "local score = 100\nlocal playerName = \"UntilBeef\"\nlocal isAlive = true\n\nglobalVariable = \"I'm global\" -- 不推荐",
             explanation: "使用local关键字声明的变量只在当前作用域内有效，而全局变量在整个脚本中都可访问。"
           }
         ],
         fillInTheBlankCode: {
           template: "local {{variableName}} = {{value}}\nprint(\"我的{{variableName}}是\" .. {{variableName}})",
           placeholders: {
             variableName: "为变量选择一个名称，如score、name等",
             value: "为变量赋值，可以是数字、字符串或布尔值"
           },
           solution: "local level = 5\nprint(\"我的等级是\" .. level)"
         },
         hasEditor: true
       },
       {
         id: "variable-naming",
         title: "变量命名规则",
         content: "变量名可以包含字母、数字和下划线，但不能以数字开头。Roblox Lua区分大小写，因此score和Score是两个不同的变量。",
         codeExamples: [
           {
             code: "local playerAge = 25\nlocal player_age = 25 -- 下划线风格\nlocal PlayerAge = 25 -- 驼峰式命名\n\n-- 以下是无效的变量名\n-- local 2ndPlace = \"silver\"\n-- local my-name = \"invalid\""
           }
         ]
       }
    ]
  },
  {
    id: "data-types",
    title: "数据类型",
    content: "Roblox Lua支持多种基本数据类型，每种类型用于存储不同种类的数据。",
    subsections: [
      {
        id: "primitive-types",
        title: "基本数据类型",
        content: "Roblox Lua提供了几种基本数据类型包括数字、字符串、布尔值、nil等。",
        codeExamples: [
          {
            code: "local number = 42 -- 数字\nlocal str = \"Hello Roblox\" -- 字符串\nlocal boolean = true -- 布尔值\nlocal nothing = nil -- 空值\nlocal array = {1, 2, 3, 4} -- 数组\nlocal dictionary = {name = \"Player\", level = 10} -- 字典"
          }
        ]
      },
      {
        id: "roblox-specific-types",
        title: "Roblox特有类型",
        content: "Roblox Lua扩展了标准Lua，提供了许多平台特有的数据类型，如Instance、Vector3、CFrame等。",
        codeExamples: [
          {
            code: "local part = Instance.new(\"Part\") -- 创建一个Part实例\nlocal position = Vector3.new(10, 5, 3) -- 三维向量\nlocal cframe = CFrame.new(0, 2, 0) -- 坐标框架\nlocal color = Color3.new(1, 0, 0) -- 颜色值(红色)"
          }
        ]
      }
    ]
  },
  {
    id: "functions",
    title: "函数",
    content: "函数是执行特定任务的代码块，可以接受参数并返回值，有助于代码的重用和组织。",
    subsections: [ // 函数声明
      {
        id: "function-declaration",
        title: "函数声明",
        content: "在Roblox Lua中，可以使用function关键字声明函数，或使用函数表达式创建匿名函数。",
        codeExamples: [
          {
            code: "-- 标准函数声明\nlocal function greet(name)\n    return \"Hello, \" .. name\nend\n\n-- 函数表达式\nlocal add = function(a, b)\n    return a + b\nend\n\n-- 调用函数\nlocal message = greet(\"Roblox\")\nlocal sum = add(5, 3)"
          }
        ]
      },
      {
        id: "parameters-return-values",
        title: "参数和返回值",
        content: "函数可以接受多个参数，并且可以返回多个值，这是Lua的一个特色功能。",
        codeExamples: [
          {
            code: "-- 带默认参数的函数\nlocal function createPlayer(name, level)\n    level = level or 1 -- 设置默认值\n    return name, level\nend\n\n-- 多返回值\nlocal playerName, playerLevel = createPlayer(\"UntilBeef\", 5)\n\n-- 可变参数\nlocal function sum(...) \n    local total = 0\n    for _, v in ipairs({...}) do\n        total = total + v\n    end\n    return total\nend\n\nlocal total = sum(1, 2, 3, 4)"
          }
        ]
      }
    ]
  },
  {
    id: "control-flow",
    title: "控制流",
    content: "控制流语句允许您控制代码的执行顺序，包括条件执行和循环。",
    subsections: [
      {
        id: "conditionals",
        title: "条件语句",
        content: "条件语句允许根据条件执行不同的代码块，包括if、elseif和else。",
        codeExamples: [
          {
            code: "local score = 85\n\nif score >= 90 then\n    print(\"优秀\")\nelseif score >= 70 then\n    print(\"良好\")\nelseif score >= 60 then\n    print(\"及格\")\nelse\n    print(\"不及格\")\nend\n\n-- 简化的条件表达式\nlocal result = score > 60 and \"通过\" or \"未通过\""
          }
        ]
      },
      {
        id: "loops",
        title: "循环",
        content: "循环语句允许重复执行代码块，包括for循环和while循环。",
        codeExamples: [
          {
            code: "-- for循环\nfor i = 1, 10 do\n    print(\"计数: \" .. i)\nend\n\n-- 数组遍历\nlocal fruits = {\"苹果\", \"香蕉\", \"橙子\"}\nfor index, fruit in ipairs(fruits) do\n    print(index .. \": \" .. fruit)\nend\n\n-- while循环\nlocal count = 1\nwhile count <= 5 do\n    print(\"While循环: \" .. count)\n    count = count + 1\nend\n\n-- 中断循环\nfor i = 1, 100 do\n    if i > 5 then\n        break\n    end\n    print(i)\nend"
          }
        ]
      } // 循环
    ]
  },
  {
    id: "oop",
    title: "面向对象编程",
    content: "Roblox Lua通过元表(metatables)和冒号语法支持面向对象编程范式。",
    subsections: [ // 表和元表
      {
        id: "tables-and-metatables",
        title: "表和元表",
        content: "表(tables)是Lua中唯一的数据结构，可以用来模拟对象。元表允许您定义表的行为，如运算符重载。",
        codeExamples: [
          {
            code: "-- 创建一个简单的对象\nlocal Player = {\n    name = \"\",\n    level = 1,\n    health = 100\n}\n\n-- 创建构造函数\nfunction Player.new(name)\n    local self = setmetatable({}, Player)\n    self.name = name\n    return self\nend\n\n-- 添加方法\nfunction Player:greet()\n    print(\"Hello, my name is \" .. self.name)\nend\n\nfunction Player:levelUp()\n    self.level = self.level + 1\n    print(self.name .. \" 升级到了 \" .. self.level .. \"级\")\nend\n\n-- 使用对象\nlocal player1 = Player.new(\"UntilBeef\")\nplayer1:greet()\nplayer1:levelUp()"
          }
        ]
      },
      {
        id: "roblox-oop",
        title: "Roblox中的面向对象",
        content: "在Roblox中，Instance类是所有对象的基类，通过继承可以创建复杂的游戏对象层次结构。",
        codeExamples: [
          {
            code: "-- 创建自定义类\nlocal Vehicle = {}\nVehicle.__index = Vehicle\n\nfunction Vehicle.new(model)\n    local self = setmetatable({}, Vehicle)\n    self.Model = model\n    self.Speed = 0\n    return self\nend\n\nfunction Vehicle:accelerate(amount)\n    self.Speed = self.Speed + amount\n    print(self.Model .. \" 加速到 \" .. self.Speed .. \" mph\")\nend\n\nfunction Vehicle:brake()\n    self.Speed = 0\n    print(self.Model .. \" 已停止\")\nend\n\n-- 创建子类\nlocal Car = setmetatable({}, {__index = Vehicle})\nCar.__index = Car\n\nfunction Car.new(model)\n    local self = Vehicle.new(model)\n    setmetatable(self, Car)\n    self.Doors = 4\n    return self\nend\n\n-- 使用类\nlocal myCar = Car.new(\"Sports Car\")\nmyCar:accelerate(60)\nprint(\"车门数量: \" .. myCar.Doors)"
          }
        ]
      }
    ]
  }
];
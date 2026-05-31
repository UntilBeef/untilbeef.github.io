# Forsaken 教程网站 - 部署指南

## 问题说明
当前网络无法直接连接 GitHub 服务器（端口 443 被阻止），无法通过命令行推送代码。

## 解决方案

### 方案一：使用 GitHub Desktop（推荐）

1. **下载并安装 GitHub Desktop**
   - 访问 https://desktop.github.com/
   - 下载并安装 GitHub Desktop

2. **登录 GitHub 账号**
   - 打开 GitHub Desktop
   - 使用你的 GitHub 账号登录

3. **添加本地仓库**
   - 点击 `File` → `Add local repository...`
   - 选择文件夹：`E:\新建文件夹\forsaken-guide`
   - 如果提示这不是仓库，点击 "create a repository"

4. **发布到 GitHub**
   - 点击 `Publish repository` 按钮
   - 仓库名称：`untilbeef.github.io`
   - **勾选 `Keep this code private`**（保持私有）
   - 点击 `Publish repository`

5. **启用 GitHub Pages**
   - 在 GitHub Desktop 中点击 `View on GitHub`
   - 在浏览器中进入仓库的 `Settings` → `Pages`
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`
   - 点击 `Save`

### 方案二：使用 GitHub 网页端上传

1. **创建仓库**
   - 访问 https://github.com/new
   - 仓库名称：`untilbeef.github.io`
   - **选择 `Private`（私有）**
   - 点击 `Create repository`

2. **上传文件**
   - 点击 `uploading an existing file`
   - 将 `E:\新建文件夹\forsaken-guide` 文件夹中的所有文件拖入
   - 包括：
     - index.html
     - mechanics.html
     - survivors.html
     - killers.html
     - advanced-guide.html
     - css/style.css
     - js/main.js
   - 点击 `Commit changes`

3. **启用 GitHub Pages**
   - 进入仓库 `Settings` → `Pages`
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`
   - 点击 `Save`

### 方案三：使用代理或 VPN

如果你有代理或 VPN：

```bash
cd e:\新建文件夹\forsaken-guide
git config --global http.proxy http://127.0.0.1:端口号
git config --global https.proxy http://127.0.0.1:端口号
git remote add origin https://github.com/UntilBeef/untilbeef.github.io.git
git push -u origin main
```

## 网站文件清单

```
forsaken-guide/
├── index.html          # 首页
├── mechanics.html      # 游戏机制
── survivors.html      # 幸存者攻略
├── killers.html        # 杀手攻略
├── advanced-guide.html # 进阶教程
├── css/
│   └── style.css       # 样式
└── js/
    ── main.js         # 交互
```

## 注意事项

1. **私有仓库的 GitHub Pages**：私有仓库使用 GitHub Pages 可能需要 GitHub Pro 账号
2. **公开访问**：如果仓库是私有的，GitHub Pages 将无法公开访问网站
3. **替代方案**：如果无法使用 GitHub Pages，可以考虑：
   - 使用 Netlify 或 Vercel 部署（支持私有仓库）
   - 将代码打包后通过其他方式分享给需要的人

## 本地预览

你可以直接在浏览器中打开 `index.html` 文件预览网站：
- 在文件资源管理器中双击 `index.html`
- 或使用 Live Server 等浏览器插件

# 我的 TODO List

一个简单的待办事项管理应用，支持 GitHub 自动同步。

## 功能特性

- ✅ 添加、编辑、删除待办事项
- ✅ 支持子任务（最多3级嵌套）
- ✅ 优先级管理（高、中、低）
- ✅ 任务完成状态管理
- ✅ 本地存储备份
- ✅ GitHub 自动同步
- ✅ 响应式设计

## 快速开始

### 方法一：直接使用（推荐）

1. 克隆仓库到本地
2. 直接打开 `index.html` 文件
3. 数据将保存在浏览器的 localStorage 中

### 方法二：使用本地服务器

如果需要更好的体验，可以使用本地服务器：

1. 安装 Python（如果已安装可跳过）
2. 在项目目录运行：
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
3. 打开浏览器访问：`http://localhost:8000`

## GitHub 同步功能

### 方式一：自动同步（需要配置 Token）

1. 按照 `GITHUB_SETUP.md` 中的说明配置 GitHub Token
2. 在应用中点击"同步到 GitHub"按钮
3. 系统会自动：
   - 直接更新 `todo.json` 文件
   - 或触发 GitHub Action 进行同步

### 方式二：手动同步

如果自动同步不可用，可以手动同步：

1. 点击"同步到 GitHub"按钮
2. 在弹出的对话框中选择：
   - **下载 todo.json**：下载文件到本地
   - **复制数据**：复制数据到剪贴板
3. 在 GitHub 仓库中编辑 `todo.json` 文件
4. 粘贴数据并保存
5. GitHub Action 会自动触发并同步数据

### 安全说明

⚠️ **注意**：自动同步功能需要将 GitHub Token 暴露在前端代码中，存在安全风险。建议：
- 使用私有仓库
- 定期更换 Token
- 或使用手动同步方式

## 文件结构

```
MyTodoList/
├── index.html          # 主页面
├── main.js             # 主要逻辑
├── style.css           # 样式文件
├── todo.json           # 数据文件
├── README.md           # 项目说明
├── USAGE.md            # 使用说明
├── GITHUB_SETUP.md     # GitHub Token 配置说明
└── .github/
    └── workflows/
        └── sync-todo.yml  # GitHub Action 配置
```

## 数据格式

```json
[
  {
    "id": "t1234567890",
    "title": "任务标题",
    "desc": "任务描述",
    "priority": "high|medium|low",
    "createdAt": 1640995200000,
    "completedAt": null,
    "children": [],
    "level": 1
  }
]
```

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub Actions

## 许可证

MIT License 
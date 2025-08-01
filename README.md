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

### 自动同步

1. 在应用中点击"同步到 GitHub"按钮
2. 数据会自动保存到 `todo.json` 文件
3. GitHub Action 会自动触发并提交更改

### 手动同步

如果自动同步不可用，可以手动同步：

1. 点击"同步到 GitHub"按钮
2. 在弹出的对话框中复制数据
3. 在 GitHub 仓库中编辑 `todo.json` 文件
4. 粘贴数据并保存

## 文件结构

```
MyTodoList/
├── index.html          # 主页面
├── main.js             # 主要逻辑
├── style.css           # 样式文件
├── todo.json           # 数据文件
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
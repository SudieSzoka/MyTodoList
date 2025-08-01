# 我的 TODO List

一个简单而强大的待办事项管理应用，支持层级任务、优先级管理和GitHub同步功能。

## 功能特性

- 📝 **层级任务管理**：支持父子任务关系，最多3级嵌套
- 🎯 **优先级设置**：高、中、低三种优先级，带颜色标识
- ⏰ **时间追踪**：自动记录创建时间和完成时间
- 📊 **统计信息**：实时显示任务统计
- 🔄 **GitHub同步**：支持将数据同步到GitHub仓库
- 💾 **本地存储**：数据自动保存到浏览器本地存储
- 🎨 **现代UI**：简洁美观的界面设计

## GitHub Token 设置

### 获取 GitHub Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择权限：
   - `repo` - 完整的仓库访问权限
   - 或者 `public_repo` - 仅公开仓库权限
4. 生成并复制token（格式：`ghp_xxxxxxxxxxxxxxxxxxxx`）

### 在应用中使用

1. 在网页的 "GitHub Token" 输入框中输入你的token
2. Token会自动保存到浏览器本地存储
3. 点击 "同步到 GitHub" 按钮即可同步数据

### 安全提示

- Token会保存在浏览器本地存储中，请确保在私人设备上使用
- 可以随时点击输入框右侧的 "×" 按钮清除token
- 按ESC键也可以快速清除token

## 使用方法

### 添加任务
1. 在底部输入框中输入任务标题
2. 选择优先级（高/中/低）
3. 可选：添加备注信息
4. 点击"添加"按钮

### 管理任务
- ✅ **完成**：点击任务右侧的✅按钮
- ↩️ **恢复**：点击已完成任务的↩️按钮
- ✏️ **编辑**：点击✏️按钮修改任务信息
- ➕ **添加子任务**：点击➕按钮为任务添加子任务
- 🗑️ **删除**：点击🗑️按钮删除任务

### 查看任务
- **进行中**：查看未完成的任务
- **已完成**：查看已完成的任务
- 点击任务前的▼/▶按钮可以展开/折叠子任务

## 同步到GitHub

应用支持多种同步方式：

1. **直接更新**：通过GitHub API直接更新todo.json文件
2. **GitHub Action**：触发仓库中的GitHub Action进行同步
3. **手动同步**：下载数据文件，手动上传到GitHub

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub API

## 文件结构

```
MyTodoList/
├── index.html          # 主页面
├── main.js            # 主要逻辑
├── style.css          # 样式文件
├── todo.json          # 数据文件
└── README.md          # 说明文档
```

## 许可证

MIT License 
# GitHub Token 配置说明

## ⚠️ 安全警告

**注意：这种方式会将你的 GitHub Token 暴露在前端代码中，存在安全风险。请谨慎使用！**

## 配置步骤

### 1. 创建 GitHub Personal Access Token

1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧菜单选择 "Developer settings" → "Personal access tokens" → "Tokens (classic)"
4. 点击 "Generate new token" → "Generate new token (classic)"
5. 设置 Token 名称，如 "Todo App Sync"
6. 选择权限范围：
   - ✅ `repo` (完整的仓库访问权限)
   - ✅ `workflow` (允许触发 GitHub Actions)
7. 点击 "Generate token"
8. **重要：复制并保存 Token，它只会显示一次！**

### 2. 修改 main.js 配置

打开 `main.js` 文件，找到以下配置部分：

```javascript
const GITHUB_CONFIG = {
  owner: 'your-username', // 替换为你的 GitHub 用户名
  repo: 'MyTodoList',     // 替换为你的仓库名
  token: 'your-github-token-here' // 替换为你的 GitHub Token
};
```

修改为你的实际信息：

```javascript
const GITHUB_CONFIG = {
  owner: '你的GitHub用户名',
  repo: '你的仓库名',
  token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
};
```

### 3. 测试同步功能

1. 打开网页应用
2. 添加一些待办事项
3. 点击"同步到 GitHub"按钮
4. 系统会尝试：
   - 直接更新 todo.json 文件
   - 如果失败，触发 GitHub Action
   - 如果都失败，显示手动同步选项

## 功能说明

### 自动同步方式

1. **直接更新文件**：通过 GitHub API 直接更新 todo.json 文件
2. **触发 Action**：通过 repository_dispatch 事件触发 GitHub Action
3. **手动同步**：如果自动同步失败，提供下载和复制选项

### 权限要求

Token 需要以下权限：
- `repo`：读写仓库文件
- `workflow`：触发 GitHub Actions

## 安全建议

1. **定期更换 Token**：建议每月更换一次
2. **限制权限**：只给必要的权限
3. **私有仓库**：建议使用私有仓库
4. **监控使用**：定期检查 Token 的使用情况

## 故障排除

### 常见错误

1. **401 Unauthorized**：Token 无效或权限不足
2. **403 Forbidden**：Token 权限不够
3. **404 Not Found**：仓库不存在或路径错误

### 解决方案

1. 检查 Token 是否正确
2. 确认 Token 权限是否足够
3. 验证仓库名称和用户名是否正确
4. 检查网络连接

## 替代方案

如果担心安全问题，建议使用：

1. **手动同步**：下载文件后手动上传
2. **后端代理**：使用服务器作为中间层
3. **GitHub CLI**：使用命令行工具 
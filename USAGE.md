# 使用说明

## GitHub Token 设置功能

### 新功能特性

✅ **用户友好的Token输入界面**
- 在页面顶部添加了GitHub Token输入框
- 默认显示 `ghp_xxx` 作为占位符
- 支持密码输入模式，保护Token安全

✅ **自动保存功能**
- Token会自动保存到浏览器本地存储
- 下次打开页面时会自动填充
- 无需重复输入

✅ **便捷的清除功能**
- 点击输入框右侧的 "×" 按钮可快速清除Token
- 按ESC键也可以快速清除Token
- 清除后会自动从本地存储中删除

### 使用步骤

1. **获取GitHub Token**
   - 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo` 或 `public_repo`
   - 生成并复制token

2. **在应用中设置Token**
   - 在页面顶部的 "GitHub Token" 输入框中输入你的token
   - Token会自动保存到浏览器本地存储
   - 输入框右侧会显示一个 "×" 按钮用于清除

3. **同步数据**
   - 点击 "同步到 GitHub" 按钮
   - 系统会使用你输入的token进行同步
   - 支持多种同步方式：直接更新、GitHub Action、手动同步

### 安全注意事项

⚠️ **重要提醒**
- Token会保存在浏览器本地存储中
- 请确保在私人设备上使用
- 不要在公共设备上保存Token
- 定期更换GitHub Token以提高安全性

### 故障排除

**问题：同步失败，提示"请输入有效的 GitHub Token"**
- 检查Token输入框是否为空或仍为默认值 `ghp_xxx`
- 确认Token格式正确（以 `ghp_` 开头）
- 验证Token是否具有足够的权限

**问题：Token被意外清除**
- 检查是否误按了ESC键
- 点击了输入框右侧的清除按钮
- 可以重新输入Token，系统会自动保存

**问题：同步权限不足**
- 确认Token具有 `repo` 或 `public_repo` 权限
- 检查GitHub仓库的访问权限
- 确认仓库名称和用户名配置正确

## 其他功能

### 任务管理
- 添加、编辑、删除任务
- 支持子任务（最多3级嵌套）
- 优先级设置（高、中、低）
- 任务完成状态管理

### 数据同步
- 本地存储自动备份
- GitHub仓库同步
- 多种同步方式支持

### 界面特性
- 响应式设计
- 现代美观的UI
- 直观的操作界面 
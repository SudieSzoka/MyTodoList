// todo 数据结构示例：
// {
//   id, title, desc, priority, createdAt, completedAt, children: [], level
// }

const TODO_STORAGE_KEY = 'my_todo_list';
let todos = [];
let currentTab = 'active'; // active | completed
const COLLAPSE_KEY = 'my_todo_collapse';
let collapseState = {};

// 从 todo.json 加载数据
async function loadTodosFromJson() {
  try {
    const response = await fetch('todo.json');
    if (response.ok) {
      const data = await response.json();
      todos = data;
      // 同时保存到 localStorage 作为备份
      localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
      return true;
    }
  } catch (error) {
    console.error('从 todo.json 加载数据失败:', error);
  }
  return false;
}

// 从 localStorage 加载数据（备用方案）
function loadTodosFromLocalStorage() {
  const data = localStorage.getItem(TODO_STORAGE_KEY);
  if (data) {
    todos = JSON.parse(data);
  } else {
    todos = [];
  }
}

async function loadTodos() {
  // 优先从 todo.json 加载，失败则从 localStorage 加载
  const success = await loadTodosFromJson();
  if (!success) {
    loadTodosFromLocalStorage();
  }
}

function saveTodos() {
  // 保存到 localStorage
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function loadCollapseState() {
  const data = localStorage.getItem(COLLAPSE_KEY);
  if (data) collapseState = JSON.parse(data);
  else collapseState = {};
}
function saveCollapseState() {
  localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapseState));
}

function render() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  const filtered = filterTodosByTab(todos, currentTab);
  renderStats(filtered);
  filtered.forEach(todo => {
    list.appendChild(renderTodoItem(todo));
  });
  // 新增：切换到已完成时隐藏添加新任务区域
  const addTodoSection = document.getElementById('add-todo');
  if (addTodoSection) {
    addTodoSection.style.display = currentTab === 'active' ? '' : 'none';
  }
}

function renderStats(list) {
  let stats = document.getElementById('todo-stats');
  if (!stats) {
    stats = document.createElement('div');
    stats.id = 'todo-stats';
    stats.style.margin = '0 0 12px 0';
    stats.style.fontSize = '0.98em';
    stats.style.color = '#888';
    document.getElementById('todo-list').parentNode.insertBefore(stats, document.getElementById('todo-list'));
  }
  const total = list.length;
  let completed = 0, active = 0;
  function countTodos(arr) {
    for (const t of arr) {
      if (t.completedAt) completed++;
      else active++;
      if (t.children) countTodos(t.children);
    }
  }
  countTodos(list);
  stats.innerHTML = `父任务总数: <b>${total}</b> ｜ 进行中: <b>${active}</b> ｜ 已完成: <b>${completed}</b>`;
}

function filterTodosByTab(todos, tab) {
  return todos.filter(todo =>
    tab === 'active' ? !todo.completedAt : !!todo.completedAt
  );
}

function renderTodoItem(todo, level = 1, parent = null) {
  // 检测是否为手机端
  const isMobile = window.innerWidth <= 768;
  
  const item = document.createElement('div');
  item.className = 'todo-item' + (todo.completedAt ? ' completed' : '');
  item.dataset.priority = todo.priority;
  item.dataset.level = level;

  // 主内容容器
  const mainContent = document.createElement('div');
  mainContent.className = 'todo-main';
  mainContent.style.display = 'flex';
  mainContent.style.flexDirection = 'row';
  mainContent.style.justifyContent = 'space-between';
  mainContent.style.alignItems = 'flex-start';
  mainContent.style.padding = '10px 8px';

  // 折叠按钮
  const collapseBtn = document.createElement('span');
  collapseBtn.className = 'collapse-btn';
  collapseBtn.style.cursor = 'pointer';
  collapseBtn.style.marginRight = '8px';
  if (todo.children && todo.children.length > 0) {
    collapseBtn.textContent = collapseState[todo.id] ? '▶' : '▼';
    collapseBtn.onclick = () => {
      collapseState[todo.id] = !collapseState[todo.id];
      saveCollapseState();
      render();
    };
  } else {
    collapseBtn.textContent = '';
  }
  // 难度图标
  const priorityIcon = document.createElement('span');
  priorityIcon.style.marginRight = '6px';
  if (todo.priority === 'high') priorityIcon.textContent = '🔥';
  else if (todo.priority === 'low') priorityIcon.textContent = '↓';
  else priorityIcon.textContent = '●';
  priorityIcon.title = priorityText(todo.priority);

  // 左侧信息区
  const infoDiv = document.createElement('div');
  infoDiv.style.flex = '1';
  infoDiv.style.minWidth = '0';
  infoDiv.style.display = 'flex';
  infoDiv.style.flexDirection = 'column';

  // 第一行：标题和描述
  const titleRow = document.createElement('div');
  titleRow.style.display = 'flex';
  titleRow.style.alignItems = 'center';
  titleRow.style.flexWrap = 'wrap';
  titleRow.appendChild(collapseBtn);
  titleRow.appendChild(priorityIcon);
  const title = document.createElement('span');
  title.className = 'todo-title';
  title.style.marginRight = '10px';
  title.textContent = todo.title;
  titleRow.appendChild(title);
  
  // 如果有描述，在手机端分2行显示，桌面端在同一行显示
  if (todo.desc && todo.desc.trim()) {
    const descSpan = document.createElement('span');
    descSpan.className = 'todo-desc';
    if (isMobile) {
      // 手机端：描述单独一行
      descSpan.textContent = todo.desc;
      infoDiv.appendChild(titleRow);
      infoDiv.appendChild(descSpan);
    } else {
      // 桌面端：描述在同一行
      descSpan.textContent = ` - ${todo.desc}`;
      titleRow.appendChild(descSpan);
      infoDiv.appendChild(titleRow);
    }
  } else {
    infoDiv.appendChild(titleRow);
  }

  // 右侧时间信息
  const timeDiv = document.createElement('div');
  timeDiv.className = 'todo-time-info';
  timeDiv.style.display = 'flex';
  timeDiv.style.flexDirection = 'column';
  timeDiv.style.alignItems = 'flex-end';
  timeDiv.style.justifyContent = 'flex-start';
  timeDiv.style.marginLeft = 'auto';
  const createdSpan = document.createElement('span');
  createdSpan.className = 'created-time';
  createdSpan.textContent = `创建: ${formatDate(todo.createdAt)}`;
  const durationSpan = document.createElement('span');
  durationSpan.className = 'duration-time';
  durationSpan.textContent = todo.completedAt
    ? `总用时: ${formatDuration(todo.completedAt - todo.createdAt)}`
    : `已持续: ${formatDuration(Date.now() - todo.createdAt)}`;
  timeDiv.appendChild(createdSpan);
  timeDiv.appendChild(durationSpan);

  mainContent.appendChild(infoDiv);
  
  // 在手机端，时间信息和操作按钮都放在TODO内容下方
  if (!isMobile) {
    // 桌面端：时间信息在右侧
    mainContent.appendChild(timeDiv);
  }
  
  // 操作按钮
  const actions = document.createElement('div');
  actions.className = 'todo-actions';
  if (isMobile) {
    // 手机端：横排显示
    actions.style.display = 'flex';
    actions.style.flexDirection = 'row';
    actions.style.gap = '8px';
    actions.style.marginLeft = '0';
  } else {
    // 桌面端：竖排显示
    actions.style.display = 'flex';
    actions.style.flexDirection = 'column';
    actions.style.gap = '4px';
    actions.style.marginLeft = '8px';
  }

  if (isMobile) {
    // 手机端：所有按钮横排
    if (!todo.completedAt) {
      const completeBtn = document.createElement('button');
      completeBtn.title = '完成';
      completeBtn.innerHTML = '✅';
      completeBtn.onclick = () => completeTodo(todo.id);
      actions.appendChild(completeBtn);
    } else {
      const restoreBtn = document.createElement('button');
      restoreBtn.title = '恢复';
      restoreBtn.innerHTML = '↩️';
      restoreBtn.onclick = () => restoreTodo(todo.id);
      actions.appendChild(restoreBtn);
    }
    
    const addChildBtn = document.createElement('button');
    addChildBtn.title = '添加子任务';
    addChildBtn.innerHTML = '➕';
    addChildBtn.onclick = () => showAddChildForm(todo, item, level);
    if (level < 3 && !todo.completedAt) actions.appendChild(addChildBtn);
    
    const editBtn = document.createElement('button');
    editBtn.title = '编辑';
    editBtn.innerHTML = '✏️';
    editBtn.onclick = () => showEditForm(todo, item);
    if (!todo.completedAt) actions.appendChild(editBtn);
    
    const delBtn = document.createElement('button');
    delBtn.title = '删除';
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = () => { if (confirm('确认删除此任务吗？')) deleteTodo(todo.id); };
    actions.appendChild(delBtn);
  } else {
    // 桌面端：按钮分两行
    const rowA = document.createElement('div');
    rowA.style.display = 'flex';
    rowA.style.gap = '4px';
    if (!todo.completedAt) {
      const completeBtn = document.createElement('button');
      completeBtn.title = '完成';
      completeBtn.innerHTML = '✅';
      completeBtn.onclick = () => completeTodo(todo.id);
      rowA.appendChild(completeBtn);
    } else {
      const restoreBtn = document.createElement('button');
      restoreBtn.title = '恢复';
      restoreBtn.innerHTML = '↩️';
      restoreBtn.onclick = () => restoreTodo(todo.id);
      rowA.appendChild(restoreBtn);
    }
    const addChildBtn = document.createElement('button');
    addChildBtn.title = '添加子任务';
    addChildBtn.innerHTML = '➕';
    addChildBtn.onclick = () => showAddChildForm(todo, item, level);
    if (level < 3 && !todo.completedAt) rowA.appendChild(addChildBtn);

    const rowB = document.createElement('div');
    rowB.style.display = 'flex';
    rowB.style.gap = '4px';
    const editBtn = document.createElement('button');
    editBtn.title = '编辑';
    editBtn.innerHTML = '✏️';
    editBtn.onclick = () => showEditForm(todo, item);
    if (!todo.completedAt) rowB.appendChild(editBtn);
    const delBtn = document.createElement('button');
    delBtn.title = '删除';
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = () => { if (confirm('确认删除此任务吗？')) deleteTodo(todo.id); };
    rowB.appendChild(delBtn);

    actions.appendChild(rowA);
    actions.appendChild(rowB);
  }
  
  if (!isMobile) {
    // 桌面端：操作按钮在右侧
    mainContent.appendChild(actions);
  }

  item.appendChild(mainContent);
  
  // 手机端：时间信息和操作按钮分两行显示
  if (isMobile) {
    // 时间信息单独一行
    const timeRow = document.createElement('div');
    timeRow.style.display = 'flex';
    timeRow.style.justifyContent = 'flex-end';
    timeRow.style.marginTop = '8px';
    timeRow.style.paddingTop = '8px';
    timeRow.style.borderTop = '1px solid #e3eaf1';
    timeRow.appendChild(timeDiv);
    item.appendChild(timeRow);
    
    // 操作按钮单独一行，横排居中
    const actionsRow = document.createElement('div');
    actionsRow.style.display = 'flex';
    actionsRow.style.justifyContent = 'center';
    actionsRow.style.marginTop = '8px';
    actionsRow.appendChild(actions);
    item.appendChild(actionsRow);
  }

  // 创建子任务容器
  const childrenContainer = document.createElement('div');
  childrenContainer.className = 'todo-children-container';
  // 子任务
  if (todo.children && todo.children.length > 0 && !collapseState[todo.id]) {
    const childrenDiv = document.createElement('div');
    childrenDiv.className = 'todo-children';
    todo.children.forEach(child => {
      childrenDiv.appendChild(renderTodoItem(child, level + 1, todo));
    });
    childrenContainer.appendChild(childrenDiv);
  }
  // 添加子任务表单区域
  if (todo._showAddChildForm) {
    const formDiv = document.createElement('div');
    formDiv.className = 'todo-form-container';
    formDiv.appendChild(renderAddChildForm(todo, level));
    childrenContainer.appendChild(formDiv);
  }
  // 编辑表单区域
  if (todo._showEditForm) {
    const formDiv = document.createElement('div');
    formDiv.className = 'todo-form-container';
    formDiv.appendChild(renderEditForm(todo));
    childrenContainer.appendChild(formDiv);
  }
  // 如果有子内容，添加到主容器
  if (childrenContainer.children.length > 0) {
    item.appendChild(childrenContainer);
  }
  return item;
}

function priorityText(p) {
  return p === 'high' ? '高' : p === 'low' ? '低' : '中';
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.getFullYear() + '-' + (d.getMonth()+1).toString().padStart(2,'0') + '-' + d.getDate().toString().padStart(2,'0') + ' ' + d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

function formatDuration(ms) {
  if (ms < 60000) return Math.floor(ms/1000) + '秒';
  if (ms < 3600000) return Math.floor(ms/60000) + '分钟';
  if (ms < 86400000) return Math.floor(ms/3600000) + '小时';
  return Math.floor(ms/86400000) + '天';
}

function completeTodo(id) {
  findAndUpdateTodo(todos, id, todo => {
    todo.completedAt = Date.now();
  });
  saveTodos();
  render();
}

function restoreTodo(id) {
  findAndUpdateTodo(todos, id, todo => {
    todo.completedAt = null;
  });
  saveTodos();
  render();
}

function deleteTodo(id) {
  deleteTodoById(todos, id);
  saveTodos();
  render();
}

function addChildTodo(){} // 占位
function editTodo(){} // 占位

function findAndUpdateTodo(list, id, fn) {
  for (let todo of list) {
    if (todo.id === id) {
      fn(todo);
      return true;
    }
    if (todo.children && todo.children.length > 0) {
      if (findAndUpdateTodo(todo.children, id, fn)) return true;
    }
  }
  return false;
}

function deleteTodoById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list.splice(i, 1);
      return true;
    }
    if (list[i].children && list[i].children.length > 0) {
      if (deleteTodoById(list[i].children, id)) return true;
    }
  }
  return false;
}

function genId() {
  return 't' + Math.random().toString(36).slice(2, 10) + Date.now();
}

// 新增 todo
function setupAddTodo() {
  document.getElementById('add-todo-btn').onclick = () => {
    const title = document.getElementById('new-todo-title').value.trim();
    const desc = document.getElementById('new-todo-desc').value.trim();
    const priority = document.getElementById('new-todo-priority').value;
    if (!title) return alert('请输入任务标题');
    const todo = {
      id: genId(),
      title,
      desc,
      priority,
      createdAt: Date.now(),
      completedAt: null,
      children: [],
      level: 1
    };
    todos.push(todo);
    saveTodos();
    render();
    document.getElementById('new-todo-title').value = '';
    document.getElementById('new-todo-desc').value = '';
    document.getElementById('new-todo-priority').value = 'medium';
  };
}

// 页签切换
function setupTabs() {
  document.getElementById('tab-active').onclick = () => {
    currentTab = 'active';
    document.getElementById('tab-active').classList.add('active');
    document.getElementById('tab-completed').classList.remove('active');
    render();
  };
  document.getElementById('tab-completed').onclick = () => {
    currentTab = 'completed';
    document.getElementById('tab-active').classList.remove('active');
    document.getElementById('tab-completed').classList.add('active');
    render();
  };
}

// GitHub 配置
const GITHUB_CONFIG = {
  // 请替换为你的 GitHub 用户名和仓库名
  owner: 'SudieSzoka', // 替换为你的 GitHub 用户名
  repo: 'MyTodoList',     // 替换为你的仓库名
  // Token 现在通过用户界面输入，不再硬编码
  token: '' // 这个值会被用户输入的token替代
};

// 同步到 GitHub
async function syncToGitHub() {
  const syncBtn = document.getElementById('sync-btn');
  const syncStatus = document.getElementById('sync-status');
  
  try {
    syncBtn.disabled = true;
    syncBtn.textContent = '同步中...';
    syncStatus.textContent = '正在同步数据到 GitHub...';
    syncStatus.style.color = '#007bff';
    
    // 保存到 localStorage
    saveTodos();
    
    // 获取用户输入的token
    const userToken = document.getElementById('github-token').value.trim();
    if (!userToken || userToken === 'ghp_xxx') {
      throw new Error('请输入有效的 GitHub Token');
    }
    
    // 创建临时的配置对象，使用用户输入的token
    const tempConfig = {
      ...GITHUB_CONFIG,
      token: userToken
    };
    
    // 检查配置
    if (tempConfig.owner === 'your-username') {
      throw new Error('请先配置 GitHub 仓库信息');
    }
    
    const dataStr = JSON.stringify(todos, null, 2);
    
    // 方法1：直接更新 todo.json 文件
    try {
      await updateTodoFile(dataStr, tempConfig);
      syncStatus.textContent = '同步成功！数据已更新到 GitHub';
      syncStatus.style.color = '#28a745';
      return;
    } catch (error) {
      console.warn('直接更新失败，尝试触发 Action:', error);
    }
    
    // 方法2：触发 GitHub Action
    try {
      await triggerGitHubAction(dataStr, tempConfig);
      syncStatus.textContent = '同步成功！GitHub Action 已触发';
      syncStatus.style.color = '#28a745';
      return;
    } catch (error) {
      console.warn('触发 Action 失败:', error);
    }
    
    // 方法3：降级到手动同步
    showManualSyncDialog(dataStr, syncStatus);
    
  } catch (error) {
    console.error('同步失败:', error);
    syncStatus.textContent = '同步失败: ' + error.message;
    syncStatus.style.color = '#dc3545';
  } finally {
    syncBtn.disabled = false;
    syncBtn.textContent = '同步到 GitHub';
    
    // 5秒后清除状态信息
    setTimeout(() => {
      syncStatus.textContent = '';
    }, 5000);
  }
}

// 直接更新 todo.json 文件
async function updateTodoFile(content, config = GITHUB_CONFIG) {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/todo.json`;
  
  // 首先获取文件的 SHA
  const getResponse = await fetch(url, {
    headers: {
      'Authorization': `token ${config.token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!getResponse.ok) {
    throw new Error('无法获取文件信息');
  }
  
  const fileInfo = await getResponse.json();
  
  // 更新文件
  const updateResponse = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${config.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: 'Auto-sync todo data from web app',
      content: btoa(unescape(encodeURIComponent(content))), // Base64 编码
      sha: fileInfo.sha
    })
  });
  
  if (!updateResponse.ok) {
    const error = await updateResponse.json();
    throw new Error(`更新失败: ${error.message}`);
  }
  
  return await updateResponse.json();
}

// 触发 GitHub Action
async function triggerGitHubAction(content, config = GITHUB_CONFIG) {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/dispatches`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `token ${config.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      event_type: 'sync-todo',
      client_payload: {
        todo_data: content
      }
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`触发 Action 失败: ${error.message}`);
  }
  
  return response;
}

// 显示手动同步对话框
function showManualSyncDialog(dataStr, syncStatus) {
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'todo.json';
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
  `;
  
  content.innerHTML = `
    <h3>自动同步失败，请手动同步</h3>
    <p>请选择以下任一方式同步数据：</p>
    <div style="margin: 15px 0;">
      <button id="download-btn" style="
        padding: 10px 20px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
      ">📥 下载 todo.json</button>
      <button id="copy-btn" style="
        padding: 10px 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      ">📋 复制数据</button>
    </div>
    <div style="margin: 15px 0;">
      <h4>同步步骤：</h4>
      <ol>
        <li>下载或复制数据</li>
        <li>打开 GitHub 仓库</li>
        <li>编辑 todo.json 文件</li>
        <li>粘贴数据并保存</li>
        <li>GitHub Action 会自动触发同步</li>
      </ol>
    </div>
    <p><strong>数据预览：</strong></p>
  `;
  
  const textArea = document.createElement('textarea');
  textArea.value = dataStr;
  textArea.style.cssText = `
    width: 100%;
    height: 200px;
    font-family: monospace;
    font-size: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    margin: 10px 0;
  `;
  textArea.readOnly = true;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '关闭';
  closeBtn.onclick = () => {
    document.body.removeChild(modal);
    URL.revokeObjectURL(url);
  };
  closeBtn.style.cssText = `
    margin-top: 10px;
    padding: 8px 16px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  content.appendChild(textArea);
  content.appendChild(closeBtn);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // 绑定按钮事件
  document.getElementById('download-btn').onclick = () => {
    downloadLink.click();
    syncStatus.textContent = '文件已下载，请上传到 GitHub';
    syncStatus.style.color = '#28a745';
  };
  
  document.getElementById('copy-btn').onclick = async () => {
    try {
      await navigator.clipboard.writeText(dataStr);
      syncStatus.textContent = '数据已复制到剪贴板';
      syncStatus.style.color = '#28a745';
    } catch (error) {
      // 降级方案
      textArea.select();
      document.execCommand('copy');
      syncStatus.textContent = '数据已复制到剪贴板';
      syncStatus.style.color = '#28a745';
    }
  };
}

// 初始化应用
document.addEventListener('DOMContentLoaded', async () => {
  await loadTodos();
  loadCollapseState();
  setupAddTodo();
  setupTabs();
  setupGitHubToken();
  render();
  
  // 设置同步按钮
  document.getElementById('sync-btn').onclick = syncToGitHub;
  
  // 显示加载状态
  const syncStatus = document.getElementById('sync-status');
  syncStatus.textContent = '数据加载完成';
  syncStatus.style.color = '#28a745';
  setTimeout(() => {
    syncStatus.textContent = '';
  }, 2000);
});

// 设置 GitHub Token 相关功能
function setupGitHubToken() {
  const tokenInput = document.getElementById('github-token');
  const clearBtn = document.getElementById('clear-token-btn');
  
  // 从 localStorage 加载保存的 token
  const savedToken = localStorage.getItem('github_token');
  if (savedToken && savedToken !== 'ghp_xxx') {
    tokenInput.value = savedToken;
  }
  
  // 当用户输入 token 时自动保存
  tokenInput.addEventListener('input', () => {
    const token = tokenInput.value.trim();
    if (token && token !== 'ghp_xxx') {
      localStorage.setItem('github_token', token);
    } else {
      localStorage.removeItem('github_token');
    }
  });
  
  // 清除按钮功能
  clearBtn.addEventListener('click', () => {
    tokenInput.value = 'ghp_xxx';
    localStorage.removeItem('github_token');
    tokenInput.focus();
  });
  
  // 键盘快捷键：ESC 清除
  tokenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tokenInput.value = 'ghp_xxx';
      localStorage.removeItem('github_token');
    }
  });
}

function showAddChildForm(todo, item, level) {
  // 只允许一个表单
  clearAllInlineForms();
  todo._showAddChildForm = true;
  render();
}
function showEditForm(todo, item) {
  clearAllInlineForms();
  todo._showEditForm = true;
  render();
}
function clearAllInlineForms(list = todos) {
  for (let t of list) {
    delete t._showAddChildForm;
    delete t._showEditForm;
    if (t.children && t.children.length > 0) clearAllInlineForms(t.children);
  }
}
function renderAddChildForm(parentTodo, parentLevel) {
  const form = document.createElement('form');
  form.className = 'inline-form';
  form.innerHTML = `
    <input type="text" name="title" placeholder="子任务标题" required style="width:120px;">
    <select name="priority">
      <option value="medium" selected>中</option>
      <option value="high">高</option>
      <option value="low">低</option>
    </select>
    <input type="text" name="desc" placeholder="备注（可选）" style="width:120px;">
    <button type="submit">添加</button>
    <button type="button" class="cancel-btn">取消</button>
  `;
  form.onsubmit = e => {
    e.preventDefault();
    const title = form.title.value.trim();
    const desc = form.desc.value.trim();
    const priority = form.priority.value;
    if (!title) return;
    const child = {
      id: genId(),
      title,
      desc,
      priority,
      createdAt: Date.now(),
      completedAt: null,
      children: [],
      level: parentLevel + 1
    };
    if (!parentTodo.children) parentTodo.children = [];
    parentTodo.children.push(child);
    delete parentTodo._showAddChildForm;
    saveTodos();
    render();
  };
  form.querySelector('.cancel-btn').onclick = () => {
    delete parentTodo._showAddChildForm;
    render();
  };
  return form;
}
function renderEditForm(todo) {
  const form = document.createElement('form');
  form.className = 'inline-form';
  form.innerHTML = `
    <input type="text" name="title" value="${todo.title}" required style="width:120px;">
    <select name="priority">
      <option value="medium" ${todo.priority==='medium'?'selected':''}>中</option>
      <option value="high" ${todo.priority==='high'?'selected':''}>高</option>
      <option value="low" ${todo.priority==='low'?'selected':''}>低</option>
    </select>
    <input type="text" name="desc" value="${todo.desc||''}" style="width:120px;">
    <button type="submit">保存</button>
    <button type="button" class="cancel-btn">取消</button>
  `;
  form.onsubmit = e => {
    e.preventDefault();
    todo.title = form.title.value.trim();
    todo.desc = form.desc.value.trim();
    todo.priority = form.priority.value;
    delete todo._showEditForm;
    saveTodos();
    render();
  };
  form.querySelector('.cancel-btn').onclick = () => {
    delete todo._showEditForm;
    render();
  };
  return form;
}
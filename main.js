// todo 数据结构示例：
// {
//   id, title, desc, priority, createdAt, completedAt, children: [], level
// }

const TODO_STORAGE_KEY = 'my_todo_list';
let todos = [];
let currentTab = 'active'; // active | completed
const COLLAPSE_KEY = 'my_todo_collapse';
let collapseState = {};

function loadTodos() {
  const data = localStorage.getItem(TODO_STORAGE_KEY);
  if (data) {
    todos = JSON.parse(data);
  } else {
    todos = [];
  }
}

function saveTodos() {
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

  // 第一行：标题
  const titleRow = document.createElement('div');
  titleRow.style.display = 'flex';
  titleRow.style.alignItems = 'center';
  titleRow.appendChild(collapseBtn);
  titleRow.appendChild(priorityIcon);
  const title = document.createElement('span');
  title.className = 'todo-title';
  title.style.marginRight = '10px';
  title.textContent = todo.title;
  titleRow.appendChild(title);
  infoDiv.appendChild(titleRow);

  // 第二行：备注（即使为空也保留）
  const descRow = document.createElement('div');
  descRow.className = 'todo-desc';
  descRow.textContent = todo.desc || '';
  descRow.style.minHeight = '1.2em';
  infoDiv.appendChild(descRow);

  // 右侧时间信息
  const timeDiv = document.createElement('div');
  timeDiv.className = 'todo-time-info';
  timeDiv.style.display = 'flex';
  timeDiv.style.flexDirection = 'column';
  timeDiv.style.alignItems = 'flex-end';
  timeDiv.style.justifyContent = 'flex-start';
  timeDiv.style.marginLeft = 'auto';
  const createdSpan = document.createElement('span');
  createdSpan.textContent = `创建: ${formatDate(todo.createdAt)}`;
  const durationSpan = document.createElement('span');
  durationSpan.textContent = todo.completedAt
    ? `总用时: ${formatDuration(todo.completedAt - todo.createdAt)}`
    : `已持续: ${formatDuration(Date.now() - todo.createdAt)}`;
  timeDiv.appendChild(createdSpan);
  timeDiv.appendChild(durationSpan);

  mainContent.appendChild(infoDiv);
  mainContent.appendChild(timeDiv);

  // 操作按钮分两行
  const actions = document.createElement('div');
  actions.className = 'todo-actions';
  actions.style.display = 'flex';
  actions.style.flexDirection = 'column';
  actions.style.gap = '4px';
  actions.style.marginLeft = '8px';

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
  mainContent.appendChild(actions);

  item.appendChild(mainContent);

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

// 同步到 GitHub（预留）
document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  loadCollapseState();
  setupAddTodo();
  setupTabs();
  render();
  document.getElementById('sync-btn').onclick = () => {
    alert('同步到 GitHub 功能开发中，当前仅本地保存。');
  };
});

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
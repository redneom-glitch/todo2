// DOM要素の取得
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const filterBtns = document.querySelectorAll('.filter-btn');

// 状態管理
let todos = JSON.parse(localStorage.getItem('todos2')) || [];
let currentFilter = 'all';

// ローカルストレージに保存
function saveTodos() {
  localStorage.setItem('todos2', JSON.stringify(todos));
}

// HTMLエスケープ
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// タスク数を更新
function updateCount() {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const totalCount = todos.length;
  todoCount.textContent = `${activeCount}件の未完了 / 全${totalCount}件`;
}

// フィルタリングされたタスクを取得
function getFilteredTodos() {
  switch (currentFilter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

// タスク一覧を描画
function renderTodos() {
  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    todoList.innerHTML = '<li class="empty-message">タスクがありません</li>';
    updateCount();
    return;
  }

  todoList.innerHTML = filteredTodos.map((todo, index) => {
    const originalIndex = todos.indexOf(todo);
    return `
      <li class="todo-item ${todo.completed ? 'completed' : ''}">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} data-index="${originalIndex}">
        <span>${escapeHtml(todo.title)}</span>
        <button class="delete-btn" data-index="${originalIndex}">削除</button>
      </li>
    `;
  }).join('');

  updateCount();
}

// タスクを追加
function addTodo() {
  const title = todoInput.value.trim();
  if (!title) return;

  todos.push({
    id: Date.now(),
    title: title,
    completed: false
  });

  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

// タスクの完了状態を切り替え
function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// タスクを削除
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// フィルターを変更
function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTodos();
}

// イベントリスナー
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

todoList.addEventListener('click', (e) => {
  const index = parseInt(e.target.dataset.index);

  if (e.target.type === 'checkbox') {
    toggleTodo(index);
  } else if (e.target.classList.contains('delete-btn')) {
    deleteTodo(index);
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setFilter(btn.dataset.filter);
  });
});

// 初期表示
renderTodos();

var input_add_item = document.getElementById('add_item');

var div_active_todos = document.getElementById('div_active_todos');
var div_completed_todos = document.getElementById('div_completed_todos');
var div_deleted_todos = document.getElementById('div_deleted_todos');

var a_active_todos = document.getElementById('a_active_todos');
var a_completed_todos = document.getElementById('a_completed_todos');
var a_deleted_todos = document.getElementById('a_deleted_todos');

var tbl_active_todos = document.getElementById('tbl_active_todos');
var tbl_completed_todos = document.getElementById('tbl_completed_todos');
var tbl_deleted_todos = document.getElementById('tbl_deleted_todos');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_COMPLETED = 'COMPLETED';
const STATUS_DELETED = 'DELETED';

function inflateTables(todo_json) {
  tbl_active_todos.innerHTML = '<tbody></tbody>';
  tbl_completed_todos.innerHTML = '<tbody></tbody>';
  tbl_deleted_todos.innerHTML = '<tbody></tbody>';

  var tbody_active_todos = tbl_active_todos.getElementsByTagName('tbody')[0];
  var tbody_completed_todos = tbl_completed_todos.getElementsByTagName('tbody')[0];
  var tbody_deleted_todos = tbl_deleted_todos.getElementsByTagName('tbody')[0];
  
  var todo_items = JSON.parse(todo_json) || {};
  Object.keys(todo_items).forEach(key => {
    var tblRow = document.createElement('tr');
    var tdata_desc = document.createElement('td');

    switch(todo_items[key].status) {
      case STATUS.ACTIVE:
        var tdata_check = document.createElement('td');
        tdata_check.innerHTML = '<input type=checkbox></input>';
        tdata_check.onclick = function() { completeTodo(key); };
        var tdata_del = document.createElement('td');
        tdata_del.innerHTML = '<button type="button" class="close" style="color: red; float: left">&times;</button>';
        tdata_del.onclick = function() { deleteTodo(key); };
        tdata_desc.innerHTML = '<input type="text" style="border: none" value=' + todo_items[key].title + '>';
        var input_field = tdata_desc.getElementsByTagName('input')[0];
        input_field.addEventListener('focus', function() { this.style.border = '1px solid #cccccc'; this.style.borderRadius = '3px'; });
        input_field.addEventListener('blur',  function() { this.style.border = 'none'; });
        //input_field.addEventListener('change',  function() { input_add_item.value = this.value; purgeTodo(key); addTodo(); });
        input_field.addEventListener('change',  function() { updateTodo(key, this.value); });
        tblRow.appendChild(tdata_check);
        tblRow.appendChild(tdata_desc);
        tblRow.appendChild(tdata_del);
        tbody_active_todos.appendChild(tblRow);
        break;
      case STATUS.COMPLETED:
        var tdata_check = document.createElement('td');
        tdata_check.innerHTML = '<input type=checkbox checked=true></input>';
        tdata_check.onclick = function() { undoCompleteTodo(key); };
        var tdata_del = document.createElement('td');
        tdata_del.innerHTML = '<button type="button" class="close" style="color: red; float: left">&times;</button>';
        tdata_del.onclick = function() { deleteTodo(key); };
        tdata_desc.innerText = todo_items[key].title;
        tblRow.appendChild(tdata_check);
        tblRow.appendChild(tdata_desc);
        tblRow.appendChild(tdata_del);
        tbody_completed_todos.appendChild(tblRow);
        break;
      case STATUS.DELETED:
        tdata_desc.innerText = todo_items[key].title;
        tblRow.appendChild(tdata_desc);
        tbody_deleted_todos.appendChild(tblRow);
        break;
    }
  });
}

function updateCount() {
  var active_todo_count = tbl_active_todos.getElementsByTagName('tr').length;
  var completed_todo_count = tbl_completed_todos.getElementsByTagName('tr').length;
  var deleted_todo_count = tbl_deleted_todos.getElementsByTagName('tr').length;
  a_active_todos.getElementsByClassName('elem_count')[0].innerText =
    '( ' + active_todo_count + (active_todo_count == 1 ? ' item' : ' items') + ' )';
  a_completed_todos.getElementsByClassName('elem_count')[0].innerText =
    '( ' + completed_todo_count + (completed_todo_count == 1 ? ' item' : ' items') + ' )';
  a_deleted_todos.getElementsByClassName('elem_count')[0].innerText =
    '( ' + deleted_todo_count + (deleted_todo_count == 1 ? ' item' : ' items') + ' )';
}

function renderList() {
  if(div_active_todos.getAttribute('aria-expanded') == 'false') {
    a_active_todos.getElementsByClassName('drop_indicator')[0].className = 'drop_indicator caret';
    a_active_todos.getElementsByClassName('elem_count')[0].style.visibility = 'visible';
  }
  else {
    a_active_todos.getElementsByClassName('drop_indicator')[0].className = 'drop_indicator caret caret-reversed';
    a_active_todos.getElementsByClassName('elem_count')[0].style.visibility = 'hidden';
  }

  if(div_completed_todos.getAttribute('aria-expanded') == 'false') {
    a_completed_todos.getElementsByClassName('drop_indicator')[0].className = 'drop_indicator caret';
    a_completed_todos.getElementsByClassName('elem_count')[0].style.visibility = 'visible';
  }
  else {
    a_completed_todos.getElementsByClassName('drop_indicator')[0].className = 'drop_indicator caret caret-reversed';
    a_completed_todos.getElementsByClassName('elem_count')[0].style.visibility = 'hidden';
  }

  if(div_deleted_todos.getAttribute('aria-expanded') == 'false') {
    a_deleted_todos.getElementsByClassName('drop_indicator')[0].className = 'drop_indicator caret';
    a_deleted_todos.getElementsByClassName('elem_count')[0].style.visibility = 'visible';
  }
  else {
    a_deleted_todos.getElementsByClassName('drop_indicator')[0].className = 'drop_indicator caret caret-reversed';
    a_deleted_todos.getElementsByClassName('elem_count')[0].style.visibility = 'hidden';
  }
}

$(div_active_todos).on('shown.bs.collapse', renderList)
                   .on('hidden.bs.collapse', renderList);
$(div_completed_todos).on('shown.bs.collapse', renderList)
                      .on('hidden.bs.collapse', renderList);
$(div_deleted_todos).on('shown.bs.collapse', renderList)
                    .on('hidden.bs.collapse', renderList);



/*========================= All LocalStorage functions are defined here ==========================*/


function getTodos() {
  return localStorage.getItem('todos');
}

function setTodos(todos) {
  localStorage.setItem('todos', todos);
  window.onload();
}

function addTodo() {
  if(input_add_item.value == '') return;

  var todos = JSON.parse(getTodos()) || [];
  var newTodo = new Todo(input_add_item.value, STATUS.ACTIVE);
  todos.push(newTodo);
  input_add_item.value = '';
  setTodos(JSON.stringify(todos));
}

function completeTodo(id) {
  var todos = JSON.parse(getTodos()) || [];
  todos[id].status = STATUS.COMPLETED;
  setTodos(JSON.stringify(todos));
}

function undoCompleteTodo(id) {
  var todos = JSON.parse(getTodos()) || [];
  todos[id].status = STATUS.ACTIVE;
  setTodos(JSON.stringify(todos));
}

function deleteTodo(id) {
  var todos = JSON.parse(getTodos()) || [];
  if(todos[id]) {
    todos[id].status = STATUS.DELETED;
    setTodos(JSON.stringify(todos));
  }
}

function purgeTodo(id) {
  var todos = JSON.parse(getTodos()) || [];
  if(todos[id]) {
    todos.splice(id, 1);
    setTodos(JSON.stringify(todos));
  }
}

function updateTodo(id, newVal) {
  var todos = JSON.parse(getTodos()) || [];
  if(todos[id]) {
    todos[id].title = newVal;
    setTodos(JSON.stringify(todos));
  }
}

window.onload = function() { inflateTables(getTodos()); updateCount(); }
input_add_item.addEventListener('keydown',  function(e) { if(e.keyCode == 13) addTodo(); });

window.addEventListener('storage', function(e) { /*console.log('event');*/ window.onload(); });

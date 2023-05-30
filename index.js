const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;

// getting local storage todo list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filters) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filters == todo.status || filters == "all") {
        li += `<li class="task">
        <label for="${id}">
          <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted} />
          <p class="${isCompleted}">${todo.name}</p>
        </label>
        <div class="settings">
          <i onclick="showMenu(this)" class="fas fa-sliders"></i>
          <ul class="task-menu">
            <li onclick="editTask(${id}, '${todo.name}')"><i class="fas fa-pen-to-square"></i>Edit</li>
            <li onclick="deleteTask(${id})" ><i class="fas fa-trash-can"></i>Delete</li>
          </ul>
        </div>
      </li> `;
      }
    });
  }
  taskBox.innerHTML = li 
      ||
      `<div class="banner">
        <h3 class="title"><span>Oops!</span></h3>
        <p>you don't have any task yet...</p>
       </div>`
    ;
}
showTodo("all");

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", e => {
    // removing the show click from the task menu 
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
}

function deleteTask(deleteId) {
  //removing selected task from the array list
  todos.splice(deleteId, 1);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo("all");
}

clearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem('todo-list', JSON.stringify(todos));
}

taskInput.addEventListener("keyup", e => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditedTask) { // if isEditedTask isn't true
      if (!todos) { // if no list is there pass an empty array
        todos = [];
      }
      let taskInfo = { name: userTask, status: 'pending' };
      todos.push(taskInfo); // adding new task to todo list
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }

    taskInput.value = "";
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo("all");
  }
});
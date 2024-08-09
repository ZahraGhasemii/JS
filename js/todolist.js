//* VARIABLES

//let todoArray = [];
let TodoEditId;

//* SELECT ELEMENTS

const todoAddForm = document.querySelector(".todoadd-form");
const todoAddInput = document.querySelector(".todoadd-input");
const todoList = document.querySelector(".todolist");
const todoAddInputmsg = document.querySelector(".todoadd-form .messages-error");
const filterTodos = document.querySelector(".filter-todos");
const todoEditInput = document.querySelector(".todoedit-input");
const todoEditForm = document.querySelector(".todoedit-form");
const modalCloseBtn = document.querySelector(".modal__close-btn");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");

//* EVENTs

todoAddForm.addEventListener("submit", addTodo);
filterTodos.addEventListener("change", filterTodo);
document.addEventListener("DOMContentLoaded", (e) => {
  const todoArray = getAllTodos();
  CreateTodolist(todoArray);
});

//* FUNCTIONS

function CreateTodolist(todoArray) {
  let todoItem = "";

  todoArray.forEach((todo) => {
    todoItem += `<li class="todo ${todo.isCompleted ? "completed" : ""}">
        <span class="todo__title">${todo.title}</span>
        <span class="todo__createdDate">${todo.createDate}</span>
        <button class="todo__edit-btn" data-todo-id="${todo.id}">
          <i class="fa fa-edit"></i>
        </button>
        <button class="todo__check-btn" data-todo-id="${todo.id}">
          <i class="fa fa-check-square"></i>
        </button>
        <button class="todo__remove-btn" data-todo-id="${todo.id}">
          <i class="fa fa-trash"></i>
        </button>
      </li>`;
  });

  todoList.innerHTML = todoItem;
  todoAddInput.value = "";

  const todoRemoveBtn = document.querySelectorAll(".todo__remove-btn");
  const todoCheckBtn = document.querySelectorAll(".todo__check-btn");
  const todoEditBtn = document.querySelectorAll(".todo__edit-btn");
  todoRemoveBtn.forEach((btn) => btn.addEventListener("click", removeTodo));
  todoCheckBtn.forEach((btn) => btn.addEventListener("click", checkTodo));
  todoEditBtn.forEach((btn) => btn.addEventListener("click", showModal));
  todoEditForm.addEventListener("submit", editTodo);
}

function addTodo(e) {
  e.preventDefault();

  if (!todoAddInput.value) {
    todoAddInputmsg.classList.remove("display-none");
    todoAddInputmsg.innerHTML = "لطفا عنوان را وارد نمایید";
    return null;
  } else {
    todoAddInputmsg.classList.add("display-none");
  }

  let newTodo = {
    id: Date.now(),
    title: todoAddInput.value,
    createDate: new Date().toLocaleDateString("fa-IR"),
    isCompleted: false,
  };

  //CreateTodolist(todoArray);
  saveTodos(newTodo);
  filterTodo();
}

function removeTodo(e) {
  const todoID = Number(e.target.dataset.todoId);
  let todoArray = getAllTodos();
  todoArray = todoArray.filter((f) => f.id !== todoID);
  //CreateTodolist(todoArray);
  saveAllTodos(todoArray);
  filterTodo();
}

function checkTodo(e) {
  const todoID = Number(e.target.dataset.todoId);
  let todoArray = getAllTodos();
  todoArray.forEach((f) => {
    if (f.id === todoID) {
      f.isCompleted = !f.isCompleted;
    }
  });
  //CreateTodolist(todoArray);
  saveAllTodos(todoArray);
  filterTodo();
}

function filterTodo() {
  let todoArray = getAllTodos();

  switch (filterTodos.value) {
    case "completed":
      CreateTodolist(todoArray.filter((f) => f.isCompleted));
      break;

    case "uncompleted":
      CreateTodolist(todoArray.filter((f) => !f.isCompleted));
      break;

    default:
      CreateTodolist(todoArray);
      break;
  }
}

function editTodo(e) {
  e.preventDefault();
  let todoArray = getAllTodos();

  todoArray = todoArray.map((obj) => {
    if (obj.id === TodoEditId) {
      return { ...obj, title: todoEditInput.value };
    }
    return obj;
  });

  //CreateTodolist(todoArray);
  saveAllTodos(todoArray);
  filterTodo();
  closeModal();
}

function showModal(e) {
  backdrop.classList.remove("display-none");
  modal.classList.remove("display-none");

  backdrop.addEventListener("click", closeModal);
  modalCloseBtn.addEventListener("click", closeModal);

  const todoID = Number(e.target.dataset.todoId);
  let todoArray = getAllTodos();

  const filteredTodo = todoArray.find((f) => f.id === todoID);
  todoEditInput.value = filteredTodo.title;
  TodoEditId = todoID;
}

function closeModal(e) {
  backdrop.classList.add("display-none");
  modal.classList.add("display-none");
}

//* LOCAL STORAGE

function getAllTodos() {
  const SavedTodoArray = JSON.parse(localStorage.getItem("todolist")) || [];
  return SavedTodoArray;
}

function saveAllTodos(todoArray) {
  localStorage.setItem("todolist", JSON.stringify(todoArray));
}

function saveTodos(todo) {
  const todoArray = getAllTodos();
  todoArray.push(todo);
  localStorage.setItem("todolist", JSON.stringify(todoArray));
  return todoArray;
}

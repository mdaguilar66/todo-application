document.addEventListener("DOMContentLoaded", function () {
    // Display Todos: Fetch Todo's from JSONPlaceholder API and display them
    displayTodos();
})

function displayTodos() {
    const todoList = document.querySelector('.todo__list');

    fetch("https://jsonplaceholder.typicode.com/todos")
        .then(response => response.json())
        .then(todos => {
            todoList.innerHTML = "";
            todos.forEach(todo => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="toggleTodoCompletion(${todo.id}, this)">
                    <span>${todo.title}</span>
                    <button onclick="deleteTodo(${todo.id}, this)" class="todo__delete btn">Delete</button>
                `;
                todoList.appendChild(li);
            });
        })
        .catch(error => {
            showError("Failed to fetch todos. Please try again.");
            console.error(error, 'error display');
        });
}

// Add Todo: Add Todo to list from the input field, send to JSONPlaceholder API (no page reload)
function addTodo() {
    const newToDoInput = document.querySelector('.todo__input');
    const newTodo = newToDoInput.value.trim();
    const todoList = document.querySelector('.todo__list');

    console.log(newTodo, 'newTodo')

    if (newTodo === '') {
        showError("Please enter a todo.");
        return
    }

    console.log(newTodo, 'newTodo two')
    fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: newTodo,
            completed: false,
        }),
    })
    .then(response => response.json())
    .then((data) => {
        newToDoInput.value = "";
        console.log(data, 'data')
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" ${data.completed ? 'checked' : ''} onclick="toggleTodoCompletion(${data.id}, this)">
            <span>${data.title}</span>
            <button onclick="deleteTodo(${data.id})" class="todo__delete btn">Delete</button>
        `;
        // Get the first child of todoList
        const firstChild = todoList.firstChild;

        // Insert the new li before the first child
        todoList.insertBefore(li, firstChild);
    })
    .catch(error => {
        showError("Failed to add a new todo. Please try again.");
        console.error(error);
    });
}

// Toggle Todo completion: mark Todo as complete, update status of todo in the JSONPlaceholder API
function toggleTodoCompletion(todoId, checkbox) {
    const completed = checkbox.checked;

    fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            completed: completed,
        }),
    })
    .then(response => console.log(response.status))
    .catch(error => {
        showError("Failed to update todo completion. Please try again.");
        console.error(error);
    });
}

// Delete Todo: remove Todo item from list and from JSONPlaceholder API
function deleteTodo(todoId, button) {
    const listItem = button.parentNode;

    fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: "DELETE",
    })
    .then(response => console.log(response.status))
    .then(
        listItem.parentNode.removeChild(listItem)
    )
    .catch(error => {
        showError("Failed to delete todo. Please try again.");
        console.error(error);
    });
}

// Error Handling: show error message for failed API requests
function showError(message) {
    alert(message);
}
// Define a Todo class with text and done properties

class Todo {
  constructor (text, done = false) {
    this.text = text
    this.done = done
  }
}

// Define a TodoList class
class TodoList {
  constructor () {
    // Load todos from local storage or create an empty array
    this.todos = JSON.parse(localStorage.getItem('todos')) || []

    // Get references to DOM elements
    this.todoInput = document.getElementById('todoInput') // The input field for adding a new todo item
    this.addBtn = document.getElementById('addBtn') // The "Add" button for adding a new todo item
    this.todoList = document.getElementById('todoList') // The <ul> element containing all the todo items
    this.clearBtn = document.getElementById('clear-btn') // The "Clear All" button for deleting all the todo items

    // Render existing todos
    this.renderTodos()

    // Bind event handlers to DOM elements
    this.addBtn.addEventListener('click', this.handleAddTodo.bind(this)) // When the "Add" button is clicked, call the handleAddTodo method
    this.todoInput.addEventListener(
      'keypress',
      this.handleInputKeyPress.bind(this) // When a key is pressed in the input field, call the handleInputKeyPress method
    )
    document
      .querySelector('form')
      .addEventListener('submit', this.handleFormSubmit.bind(this)) // When the form is submitted, call the handleFormSubmit method
  }

  // Render todos to the DOM
  renderTodos () {
    // Clear the existing todo list
    this.todoList.innerHTML = ''

    // Loop through todos and create DOM elements for each
    for (let i = 0; i < this.todos.length; i++) {
      const todo = this.todos[i]
      const li = document.createElement('li') // Create a new <li> element for each todo item
      const label = document.createElement('label') // Create a new <label> element for each todo item
      const checkbox = document.createElement('input') // Create a new <input> element for each todo item
      const editBtn = document.createElement('button') // Create a new "Edit" button for each todo item
      const deleteBtn = document.createElement('button') // Create a new "Delete" button for each todo item

      // Set up checkbox input element
      checkbox.type = 'checkbox'  // Set the type of the <input> element to "checkbox"
      checkbox.checked = todo.done // Set the "checked" attribute of the <input> element to the "done" property of the corresponding todo item
      
      
      // Add an event listener to the <input> element that updates the "done" property of the corresponding todo item, 
      // saves the updated todo list to local storage, and adds/removes the "completed" class to the corresponding <li> element
        checkbox.addEventListener('change', () => { 
        todo.done = checkbox.checked
        this.saveTodos()
        li.classList.toggle('completed', checkbox.checked)
      })

      // Set up label element
      label.textContent = todo.text // Set the text content of the <label> element to the "text" property of the corresponding todo item

      // Set up edit button
      editBtn.textContent = 'Edit'
      editBtn.classList.add('edit-btn')
      editBtn.addEventListener('click', () => {
        const newText = prompt('Enter new text for this todo', todo.text)
        if (newText) {
          todo.text = newText
          this.saveTodos()
          this.renderTodos()
        }
      })

      // Set up delete button
      deleteBtn.textContent = 'Delete'
      deleteBtn.classList.add('delete-btn')
      deleteBtn.addEventListener('click', () => {
        this.todos.splice(i, 1)
        this.saveTodos()
        this.renderTodos()
      })

      // Enable clear button if there are todos, disable it otherwise
      if (this.todos.length > 0) {
        this.clearBtn.removeAttribute('disabled')
      } else {
        this.clearBtn.setAttribute('disabled', true)
      }
      // Set up clear button
      this.clearBtn.addEventListener('click', () => {
        if (!this.clearBtn.hasAttribute('disabled')) {
          const confirmed = confirm(
            'Are you sure you want to delete everything?'
          )
          if (confirmed) {
            this.todos = []
            this.saveTodos()
            this.renderTodos()
            this.clearBtn.setAttribute('disabled', true)
          }
        }
      })

      // Append elements to list item
      li.appendChild(checkbox)
      li.appendChild(label)
      li.appendChild(editBtn)
      li.appendChild(deleteBtn)
      // Add completed class to list item if the todo is done
      if (todo.done) {
        li.classList.add('completed')
      }
      // Append list item to todo list
      this.todoList.appendChild(li)
    }
  }

  // Save todos to local storage
  saveTodos () {
    localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  // This function is called when the "Add" button is clicked. It creates a new todo
  // item with the text entered by the user, and adds it to the list of todos.
  // It then saves the updated list to local storage and re-renders the list.
  handleAddTodo () {
    const text = this.todoInput.value.trim()
    if (text) {
      const newTodo = new Todo(text)
      this.todos.push(newTodo)
      this.saveTodos()
      this.renderTodos()
      this.todoInput.value = ''
    }
  }

  // This function is called when a key is pressed in the input field.
  // If the key is the "Enter" key, it calls the handleAddTodo() function.
  handleInputKeyPress (event) {
    if (event.key === 'Enter') {
      this.handleAddTodo()
    }
  }

  // This function is called when the form is submitted.
  // It prevents the default behavior of the form and calls the handleAddTodo() function.
  handleFormSubmit (event) {
    event.preventDefault()
    this.handleAddTodo()
  }
}

// Initialize the TodoList object
const todoList = new TodoList()

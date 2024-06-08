// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const taskForm = $('#taskForm');
//let tasks;
const taskTitleInputEl = $('#task-title-input');
const taskDescriptionInputEl = $('#description-input');
const taskDueEl = $('#task-due');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = crypto.randomUUID();
    console.log(id);
}

//test function
function test() {
    console.log("test");
}

// TODO: Create a function that accepts an array of projects, stringifys them, and saves them in localStorage.
function saveTasksToStorage(event) {
    event.preventDefault();
    
    let tasks = taskList || [];

    const task = {
       Title: taskTitleInputEl.val(),
       Description: taskDescriptionInputEl.val(),
       Due: taskDueEl.val(),
    };
  
    // push task object into the tasks array
    tasks.push(task);
  
    // clear the input boxes
    taskTitleInputEl.val('');
    taskDescriptionInputEl.val('');
    taskDueEl.val('');
  
    // send the array to local storage
    localStorage.setItem('tasks',JSON.stringify(tasks));

    console.log(tasks);
  };

// Todo: create a function to create a task card
// function createTaskCard(task) {
//     // create a new task card
//     const taskCard = "task card";

//     console.log("create task card");
//     // create portions of the task card

//     // return task card
//     return taskCard;

// }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // initialize date picker
    $('#task-due').datepicker({
        changeMonth: true,
        changeYear: true,
      });
    
    // event listener for submit button
    taskForm.on('submit', saveTasksToStorage);
});

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const taskForm = $('#taskForm');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    //let nextId = crypto.randomUUID();
}

//test function
function test() {
    console.log("test");
}
// Todo: create a function to create a task card
function createTaskCard(task) {
    // create a new task card
    //const taskCard = $('<div class="card project-card draggable my-3" </div>');

    console.log("create task card");
    // create portions of the task card

}

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
    $('#taskDueDate').datepicker({
        changeMonth: true,
        changeYear: true,
      });
    
    // event listener for submit button
    taskForm.on('submit', test);
});

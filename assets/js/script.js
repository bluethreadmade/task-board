// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = crypto.randomUUID();

    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
         .addClass('card task-card draggable my-3')
         .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.due);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);


    // Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    console.log("create");
    // Return the card so it can be appended to the correct lane.
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

// name the lanes and empty them
  const todoLane = $('#todo-cards');
  todoLane.empty();
  const inProgressLane = $('#in-progress-cards');
  inProgressLane.empty();
  const doneLane = $('#done-cards');
  doneLane.empty();

  // ? Loop through tasks and create task cards for each status
  for (let tasks of taskList) {
    if (tasks.status === 'to-do') {
        todoLane.append(createTaskCard(tasks));
    } else if (tasks.status === 'in-progress') {
        inProgressLane.append(createTaskCard(tasks));
    } else if (tasks.status === 'done') {
        doneLane.append(createTaskCard(tasks));
    }
  };

  // ? Use JQuery UI to make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // get user input from form
    const title = $('#task-title-input').val();
    const description = $('#description-input').val();
    const due = $('#task-due').val();

    // create/initialize? new task object
    const newTask = {
        title: title,
        description: description,
        due: due,
        id: generateTaskId(),
        status: 'to-do'
    };

    // pull task array from local storage
    // If no tasks were retrieved from localStorage, assign tasks to a new empty array to push to later.
     if (!taskList) {
       taskList = [];
     };

    // let tasks = readTasksFromStorage();
    // push new object to tasks array
    taskList.push(newTask);

    // save to local storage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // clear form inputs
    $('#task-title-input').val('');
    $('#description-input').val('');
    $('#task-due').val('');
    
    console.log("hi");

    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();

    console.log("delete");
    // find task by id in local storage
    const taskId = $(this).attr('data-task-id');
    console.log(`${taskId}`);


    // for each task in the array, if the task ID matches this task ID, get right of it using splice
    taskList.forEach((task) => {
        if (task.id === taskId) {
            taskList.splice(taskList.indexOf(task), 1);
        }
      });

    // save the tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // render the screen
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  // Get the task id from the event
  const taskId = ui.draggable[0].dataset.data-task-id;
  console.log(`${ui.draggable[0]}`);

  //  Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of taskList) {
    // ? Find the project card by the `id` and update the project status.
    if (task.id === taskId) {
        console.log(`${task.id}`);
      task.status = newStatus;
    }
  }
  // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // initialize date picker
    $('#task-due').datepicker({
        changeMonth: true,
        changeYear: true,
      }); 

    // ? Make lanes droppable
    $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
    });
    
    renderTaskList();

    // event listener for submit button
    $('#task-form').on('submit', handleAddTask);

    // event handler for delete button (on click run the delete task function)
    $('.lane').on('click', 'delete', handleDeleteTask);



});





// PSEUDO CODE
// pull any existing tasks from local storage and render them on the page in the correct status column
// local storage = array called taskList, containing objects called task
// hit add task button and modal form pops us
// contains title, description, date and save button
// on save -
// -- generate a unique ID and send title/description/date/unique ID to local storage
// -- create a card
// -- and render the new card to it's column
// ---- with the color indicating how close to the due date they are
// on dragging to a column set a property to indicate to do/in progress/done status
// -- done column sets card to white
// on delete -- remove item from local storage

// // // // DEPENDANCIES
// // // // things currently in local storage (taskList) - they are stored in local storage as a JSON string and need to be parsed back to an array to be used
// // // let taskList = JSON.parse(localStorage.getItem("tasks"));
// // // // things from form - title/description/date
// // // const taskTitleInputEl = $('#task-title-input');
// // // const taskDescriptionInputEl = $('#description-input');
// // // const taskDueInputEl = $('#task-due');
// // // const taskFormEl = $('#task-form');

// // // // DATA

// // // // FUNCTIONS

// // // // testfunction
// // // function test()
// // // {
// // //     console.log("here")
// // // }
// // // // generate unique ID
// // // function generateTaskId() {
// // //     let id = crypto.randomUUID();
// // //     console.log(id);
// // // }

// // // function readTasksFromStorage() {
// // // // If no tasks were retrieved from localStorage, assign tasks to a new empty array to push to later.
// // //      if (!taskList) {
// // //        taskList = [];
// // //      };

// // //      console.log("tasks")
// // // // ? Return the tasks array either empty or with data in it whichever it was determined to be by the logic right above.
// // //      return taskList;
// // // }

// // // // add ID/title/description/due date from form to task object, push to taskList array, save to local storage
// // // // pass event becuase this should happen on the click of submit
// // // function handleAddTask(event) {
// // //     event.preventDefault();

// // //     // get user input from form
// // //     const title = taskTitleInputEl.val();
// // //     const description = taskDescriptionInputEl.val();
// // //     const due = taskDueInputEl.val();

// // //     // create/initialize? new task object
// // //     const newTask = {
// // //         Title: title,
// // //         Description: description,
// // //         Due: due,
// // //         ID: crypto.randomUUID(),
// // //         Status: 'to-do'
// // //     };

// // //     // pull task array from local storage
// // //     let tasks = readTasksFromStorage();
// // //     // push new object to tasks array
// // //     tasks.push(newTask);

// // //     // save to local storage
// // //     saveTasksToStorage(tasks);

// // //     // clear form inputs
// // //     taskTitleInputEl.val('');
// // //     taskDescriptionInputEl.val('');
// // //     taskDueInputEl.val('');
    
// // //     console.log("hi");

// // //     createTaskCard(tasks);
// // //     renderTaskList(tasks);
// // // }

// // // function saveTasksToStorage(tasks) {
// // //     localStorage.setItem('tasks', JSON.stringify(tasks));
// // // }

// // // // create a card
// // // function createTaskCard(tasks){

// // //     const taskCard = $('<div>')
// // //          .addClass('card task-card draggable my-3')
// // //          .attr('data-task-id', tasks.Id);
// // //     const cardHeader = $('<div>').addClass('card-header').text(tasks.Title);
// // //     const cardBody = $('<div>').addClass('card-body');
// // //     const cardDescription = $('<p>').addClass('card-text').text(tasks.Description);
// // //     const cardDueDate = $('<p>').addClass('card-text').text(tasks.Due);
// // //     const cardDeleteBtn = $('<button>')
// // //         .addClass('btn btn-danger delete')
// // //         .text('Delete')
// // //         .attr('data-task-id', tasks.Id);
// // //     // event handler for delete button (on click run the delete task function)
// // //     cardDeleteBtn.on('click', handleDeleteTask);

// // //     // Gather all the elements created above and append them to the correct elements.
// // //     cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
// // //     taskCard.append(cardHeader, cardBody);

// // //     console.log("create");
// // //     // Return the card so it can be appended to the correct lane.
// // //     return taskCard;
// // // }

// // // function handleDeleteTask(){
// // //     // find task by id in local storage
// // //     const taskId = $(this).attr('data-task-id');
// // //     const tasks = readTasksFromStorage();

// // //     // for each task in the array, if the task ID matches this task ID, get right of it using splice
// // //     tasks.forEach((task) => {
// // //         if (task.id === taskId) {
// // //             tasks.splice(tasks.indexOf(task), 1);
// // //         }
// // //       });

// // //     // save the tasks to localStorage
// // //     saveTasksToStorage(tasks);

// // //     // render the screen
// // //     renderTaskList();
// // // }

// // // // render existing items on cards in local storage (on page load)
// // // // append the cards to the column based on status
// // // function renderTaskList(){

// // // // name the lanes and clear them
// // //   const todoLane = $('#todo-cards');
// // //   todoLane.empty();

// // //   const inProgressLane = $('#in-progress-cards');
// // //   inProgressLane.empty();

// // //   const doneLane = $('#done-cards');
// // //   doneLane.empty();

// // //   // ? Loop through tasks and create task cards for each status
// // //   for (let tasks of taskList) {
// // //     if (tasks.Status === 'to-do') {
// // //         todoLane.append(createTaskCard(tasks));
// // //     } else if (tasks.Status === 'in-progress') {
// // //         inProgressLane.append(createTaskCard(tasks));
// // //     } else if (tasks.Status === 'done') {
// // //         doneLane.append(createTaskCard(tasks));
// // //     }
// // //   };
// // // }

// - if empty, initilize taskList array
// append to column on drag
// - change color per column
// remove from local storage


// USER INTERACTIONS
// modal handles ADD TASK button, so no listener needed
// listen to form for save button.
// -----then run the functions that generate the unique id, and send the title/description/date and id to local storage and render the page
// listen for delete on the card
// ----- then run the function that removes it from local storage
// ---------- how? referencing the unique ID and removing that object from the taskList array? (pop?/splice?
// listen for drag
// ----- then run function that appends the card to the dragged over column
// ----- run function that changes the card color







//----------------------------First Try---------------------------------------------------------
// Retrieve tasks and nextId from localStorage
// let taskList = JSON.parse(localStorage.getItem("tasks"));
// let nextId = JSON.parse(localStorage.getItem("nextId"));

// const taskForm = $('#taskForm');
// //let tasks;
// const taskTitleInputEl = $('#task-title-input');
// const taskDescriptionInputEl = $('#description-input');
// const taskDueEl = $('#task-due');

// // Todo: create a function to generate a unique task id
// function generateTaskId() {
//     let id = crypto.randomUUID();
//     console.log(id);
// }

// //test function
// function test() {
//     console.log("test");
// }

// // TODO: Create a function that accepts an array of projects, stringifys them, and saves them in localStorage.
// function saveTasksToStorage(event) {
//     event.preventDefault();
    
//     let tasks = taskList || [];

//     const task = {
//        Title: taskTitleInputEl.val(),
//        Description: taskDescriptionInputEl.val(),
//        Due: taskDueEl.val(),
//        id: crypto.randomUUID(),
//     };
  
//     // push task object into the tasks array
//     tasks.push(task);
  
//     // clear the input boxes
//     taskTitleInputEl.val('');
//     taskDescriptionInputEl.val('');
//     taskDueEl.val('');
  
//     // send the array to local storage
//     localStorage.setItem('tasks',JSON.stringify(tasks));

//     console.log(tasks);
//   }

// // Todo: create a function to create a task card
// function createTaskCard(task) {
//     // create a new task card
//     const taskCard = $('<div>')
//         .addClass('card task-card draggable my-3')
//         .attr('data-task-id', task.id);
//     const cardHeader = $('<div>').addClass('card-header h4').text(task.Title);
//     const cardBody = $('<div>').addClass('card-body');
//     const cardDescription = $('<p>').addClass('card-text').text(task.Description);
//     const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
//     // const cardDeleteBtn = $('<button>')
//     //     .addClass('btn btn-danger delete')
//     //     .text('Delete')
//     //     .attr('data-project-id', project.id);
//     // cardDeleteBtn.on('click', handleDeleteProject);

//     console.log("create task card");

//     // ? Gather all the elements created above and append them to the correct elements.
//     cardBody.append(cardDescription, cardDueDate, /* cardDeleteBtn*/ );
//     taskCard.append(cardHeader, cardBody);

//     // return task card
//     return taskCard;

// }

// // Todo: create a function to render the task list and make cards draggable
// function renderTaskList() {
    
//         const tasks = readTasksFromStorage();
      
//         // // ? Empty existing project cards out of the lanes
//         // const todoList = $('#todo-cards');
//         // todoList.empty();
      
//         // const inProgressList = $('#in-progress-cards');
//         // inProgressList.empty();
      
//         // const doneList = $('#done-cards');
//         // doneList.empty();
      
//         // ? Loop through projects and create project cards for each status
//         for (let task of tasks) {
//           if (task.status === 'to-do') {
//             todoList.append(createTaskCard(task));
//           } else if (task.status === 'in-progress') {
//             inProgressList.append(createTaskCard(task));
//           } else if (task.status === 'done') {
//             doneList.append(createTaskCard(task));
//           }
//         }

// }
// function readProjectsFromStorage() {
//     // ? Retrieve projects from localStorage and parse the JSON to an array.
//     // ? We use `let` here because there is a chance that there are no projects in localStorage (which means the projects variable will be equal to `null`) and we will need it to be initialized to an empty array.
//     let tasks = JSON.parse(localStorage.getItem('tasks'));
  
//     // ? If no projects were retrieved from localStorage, assign projects to a new empty array to push to later.
//     if (!tasks) {
//       tasks = [];
//     }
  
//     // ? Return the projects array either empty or with data in it whichever it was determined to be by the logic right above.
//     return tasks;
//   }
// // Todo: create a function to handle adding a new task
// function handleAddTask(event){
    
// }

// // Todo: create a function to handle deleting a task
// function handleDeleteTask(event){

// }

// // Todo: create a function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {

// }

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// $(document).ready(function () {
//     // initialize date picker
//     $('#task-due').datepicker({
//         changeMonth: true,
//         changeYear: true,
//       }); 
//     // event listener for submit button
//     taskFormEl.on('submit', handleAddTask);
// });

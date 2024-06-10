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

    // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (task.due && task.status !== 'done') {
      const now = dayjs();
      const taskDueDate = dayjs(task.due, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

    // Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

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

    // push new object to tasks array
    taskList.push(newTask);

    // save to local storage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // clear form inputs
    $('#task-title-input').val('');
    $('#description-input').val('');
    $('#task-due').val('');
    
    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();

    // find task by id in local storage
    const taskId = $(this).attr('data-task-id');

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
  const taskId = ui.draggable.attr('data-task-id');

  //  Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  // pull task array from local storage
  // If no tasks were retrieved from localStorage, assign tasks to a new empty array to push to later.
  if (!taskList) {
    taskList = [];
  };

  for (let task of taskList) {
    // ? Find the project card by the `id` and update the project status.
    if (task.id === taskId) {
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
    $('.lane').on('click', '.delete', handleDeleteTask);

});
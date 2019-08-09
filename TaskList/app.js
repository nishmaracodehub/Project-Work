// Define UI vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const taskInput = document.querySelector('#task');
const filter = document.querySelector('#filter');
const clrBtn = document.querySelector('.clear-tasks');

//Load All Event Listeners
loadEventListeners();

//Define LoadEventListeners
function loadEventListeners(){

    // DOM Load event
    document.addEventListener('DOMContentLoaded', getTasks);

    // Add task event
    form.addEventListener('submit', addTask);

    // delete task event
    taskList.addEventListener('click',deleteTask);

    // clear tasks event
    clrBtn.addEventListener('click', clearTasks);

    // filter tasks event
    filter.addEventListener('keyup', filterTasks);
}

//Define getTasks
function getTasks(){
    let tasks;
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task){
        //create li element
        const li = document.createElement('li');
        li.className = 'collection-item';
        //create textnode
        li.appendChild(document.createTextNode(task));
        //create a new link elemet
        const link = document.createElement('a');
        link.className = 'delete-item secondary-content';
        link.innerHTML = '<i class="fa fa-remove"></i>';
        //append link to li
        li.appendChild(link);

        //append li to ul
        taskList.appendChild(li);
    })


}
//Define addTask
function addTask(e){

    if(taskInput.value === ''){
        alert('Add a Task');
    } else {
    //create li element
    const li = document.createElement('li');
    li.className = 'collection-item';
    //create textnode
    li.appendChild(document.createTextNode(taskInput.value));
    //create a new Link element
    const link = document.createElement('a');
    link.className = 'delete-item secondary-content';
    link.innerHTML = '<i class="fa fa-remove"></i>';
    //append link to li
    li.appendChild(link);

    //append li to ul
    taskList.appendChild(li);

    //Store in local Storage
    storeTaskInLocalStorage(taskInput.value);

    //clear input
    taskInput.value = '';

    }
    e.preventDefault();
}

//Define storeTaskInLocalStorage
function storeTaskInLocalStorage(task){
    let tasks;
    // check if localstorage has any values 
    if(localStorage.getItem('tasks') === null){
        // no values
        tasks = [];
    } else {
        // get the values
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    // add the tasks to tasks array
    tasks.push(task);
    // set the localstorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Define deleteTask
function deleteTask(e){
    if(e.target.parentElement.classList.contains('delete-item')){
        if(confirm('Are you sure?')){
            e.target.parentElement.parentElement.remove();

            //Remove from Local Storage
            removeTaskFromLocalStorage(e.target.parentElement.parentElement);
        }
    }
}

//Define removeTaskFromLocalStorage
function removeTaskFromLocalStorage(taskItem){
    let tasks;
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task, index){
        if(taskItem.textContent === task){
            tasks.splice(index, 1);
        }
    });

    // set the local storage again
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Define clearTasks

function clearTasks(e){
    // slower
    // taskList.innerHTML = ''; 

    // faster
    while(taskList.firstChild){
        taskList.removeChild(taskList.firstChild);
    }

    // Clear tasks from local storage
    clearTasksFromLocalStorage();
}

function clearTasksFromLocalStorage(){
    localStorage.clear();
}

// Define filterTasks
function filterTasks(e){
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(function(task){
        const item = task.firstChild.textContent;
        if(item.toLowerCase().indexOf(text) !== -1){
            task.style.display = 'block';
        }else{
            task.style.display = 'none';
        }
    })

}


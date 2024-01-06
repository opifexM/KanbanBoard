import {addDragEnterAreaOption, addDraggableListOption, addDraggableTaskOption} from "./drag-and-drop-feature.js";

const backlogList = document.querySelector('.taskboard__group--backlog .taskboard__list');
const basketList = document.querySelector('.taskboard__list--trash');
const createTaskForm = document.querySelector('.add-task__form');
const createTaskInput = createTaskForm.querySelector('input');
const createTaskButton = createTaskForm.querySelector('button');
const clearBasketButton = document.querySelector('.taskboard__button');

let taskIdCounter = 0;

function getNextTaskId() {
    return ++taskIdCounter;
}

function addTaskEvents() {
    createTaskButton.addEventListener('click', addNewTaskHandler);
    createTaskInput.addEventListener('input', taskInputHandler);
    clearBasketButton.addEventListener('click', clearBasketHandler)
}

function addOptionForAllTasks() {
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(divTask => {
        if (!divTask.classList.contains("task--empty")) {
            divTask.id = `task-${getNextTaskId()}`;
            divTask.classList.remove('task--active');
            const p = divTask.querySelector('.task__view');
            const input = divTask.querySelector('.task__input');
            const button = divTask.querySelector('.task__edit');

            addDraggableTaskOption(divTask);
            if (button) {
                addEditOption(button, {divTask, p, input});
            }
        }
    });
}

function addOptionForAllLists() {
    const allLists = document.querySelectorAll('.taskboard__list');
    allLists.forEach(divList => addDraggableListOption(divList));
}

function applyEmptyTaskToAllLists() {
    const allLists = document.querySelectorAll('.taskboard__list');
    allLists.forEach(divList => applyEmptyTask(divList));
}

function addOptionForAllAreas() {
    const allAreas = document.querySelectorAll('.taskboard__group');
    allAreas.forEach(area => addDragEnterAreaOption(area));
}

function deleteEmptyTask(list) {
    const emptyTask = list.querySelector('.task--empty');
    if (emptyTask) {
        emptyTask.remove();
    }
}

function addEmptyTask(list) {
    const emptyTask = list.querySelector('.task--empty');
    if (!emptyTask) {
        const divTask = document.createElement('div');
        const p = document.createElement('p');

        if (list.classList.contains("taskboard__list--trash")) {
            divTask.classList.add('task--empty-trash', 'task', 'task--empty');
            p.textContent = 'Basket is empty';
        } else {
            divTask.classList.add('taskboard__item', 'task', 'task--empty');
            p.textContent = 'Drag the card';
        }

        divTask.appendChild(p);
        list.appendChild(divTask);
    }
}

function applyEmptyTask(list) {
    const numberOfTask = list.querySelectorAll('.task:not(.task--empty)').length;
    (numberOfTask > 0) ? deleteEmptyTask(list) : addEmptyTask(list);
}

function createTask(title) {
    const divTask = document.createElement('div');
    divTask.classList.add('taskboard__item', 'task');
    divTask.id = `task-${getNextTaskId()}`;

    const divBody = document.createElement('div');
    divBody.classList.add('task__body');

    const p = document.createElement('p');
    p.classList.add('task__view');
    p.textContent = title;

    const input = document.createElement('input');
    input.classList.add('task__input');
    input.type = 'text';
    input.setAttribute('value', title);

    const button = document.createElement('button');
    button.classList.add('task__edit');
    button.setAttribute('aria-label', 'Edit');
    addEditOption(button, {divTask, p, input});

    divBody.append(p, input);
    divTask.append(divBody, button);
    return divTask;
}

function finalizeEditing(elements, enterHandler, blurHandler, newTitleText = '') {
    elements.divTask.classList.remove('task--active');
    elements.input.removeEventListener('keydown', enterHandler);
    elements.input.removeEventListener('blur', blurHandler);

    if (newTitleText) {
        elements.p.textContent = newTitleText;
        elements.input.setAttribute('value', newTitleText);
    }
}

function checkBasketList() {
    const numberOfTask = basketList.querySelectorAll('.task:not(.task--empty)').length;
    clearBasketButton.disabled = numberOfTask === 0;
}

function editOnEnterHandler(event, elements, enterHandler, blurHandler) {
    if (event.key === 'Enter') {
        finalizeEditing(elements, enterHandler, blurHandler, event.target.value);
    }
}

function editOnBlurHandler(event, elements, enterHandler, blurHandler) {
    elements.input.value = elements.p.textContent;
    finalizeEditing(elements, enterHandler, blurHandler);
}

function initiateEditing(elements) {
    elements.divTask.classList.add('task--active');
    elements.input.focus();
    elements.input.select();
    const completeEditOnEnter = (event) => editOnEnterHandler(event, elements, completeEditOnEnter, completeEditOnBlur);
    const completeEditOnBlur = (event) => editOnBlurHandler(event, elements, completeEditOnEnter, completeEditOnBlur);
    elements.input.addEventListener('keydown', completeEditOnEnter);
    elements.input.addEventListener('blur', completeEditOnBlur);
}

function editTaskHandler(event, elements) {
    event.preventDefault();
    initiateEditing(elements);
}

function addEditOption(buttonElement, elements) {
    buttonElement.addEventListener('click', (event) => editTaskHandler(event, elements));
}

function addNewTaskHandler(event) {
    event.preventDefault();
    const newTask = createTask(createTaskInput.value);
    backlogList.appendChild(newTask);
    addDraggableTaskOption(newTask);

    createTaskInput.value = '';
    createTaskButton.disabled = true;
}

function taskInputHandler() {
    createTaskButton.disabled = !createTaskInput.value.length;
}

function clearBasketHandler() {
    basketList.innerHTML = '';
    applyEmptyTask(basketList);
    checkBasketList();
}

export {
    addOptionForAllAreas,
    addOptionForAllLists,
    addOptionForAllTasks,
    applyEmptyTaskToAllLists,
    checkBasketList,
    addTaskEvents,
}

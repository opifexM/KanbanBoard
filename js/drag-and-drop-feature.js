import {applyEmptyTaskToAllLists, checkBasketList} from "./task-operation.js";

let currentDragTaskId = null;
let originalTaskParent = null;
let isDropSuccessful = false;
let originalTaskNextSibling = null;
let targetTaskClass = null;
let lastClosestElementId = null;

function findClosestElement(event, container) {
    let closestElement = null;
    let minDistance = Infinity;

    Array.from(container.children).forEach(child => {
        const box = child.getBoundingClientRect();
        const point = {
            x: box.left + box.width / 2,
            y: box.top + box.height / 2
        };

        const distance = Math.sqrt(
            Math.pow(point.x - event.clientX, 2) +
            Math.pow(point.y - event.clientY, 2)
        );

        if (distance < minDistance) {
            closestElement = child;
            minDistance = distance;
        }
    });

    const lastChild = container.lastElementChild;
    if (lastChild) {
        const lastChildBox = lastChild.getBoundingClientRect();
        if (event.clientY > lastChildBox.bottom) {
            return null;
        }
    }
    return closestElement;
}

function dragStartTaskHandler() {
    this.classList.add('task--dragged');
    currentDragTaskId = this.id;
    originalTaskParent = this.parentNode;
    originalTaskNextSibling = this.nextElementSibling;
}

function dragOverTaskHandler(event) {
    event.preventDefault();

    if (!currentDragTaskId) {
        return;
    }

    const divTask = document.getElementById(currentDragTaskId);
    const closestElement = findClosestElement(event, this);
    const newClosestElementId = closestElement ? closestElement.id : null;

    if (lastClosestElementId !== newClosestElementId) {
        if (closestElement) {
            this.insertBefore(divTask, closestElement);
        } else {
            this.appendChild(divTask);
        }
        lastClosestElementId = newClosestElementId;
        applyEmptyTaskToAllLists();
    }
}

function dragDropTaskHandler(event) {
    event.preventDefault();
    if (currentDragTaskId) {
        const divTask = document.getElementById(currentDragTaskId);
        divTask.className = `taskboard__item task ${targetTaskClass}`;
        isDropSuccessful = true;
    }
}

function dragEndTaskHandler() {
    const divTask = document.getElementById(currentDragTaskId);
    divTask.classList.remove('task--dragged');

    if (!isDropSuccessful) {
        originalTaskParent.insertBefore(divTask, originalTaskNextSibling);
    }

    currentDragTaskId = null;
    originalTaskParent = null;
    originalTaskNextSibling = null;
    isDropSuccessful = false;
    targetTaskClass = null;
    applyEmptyTaskToAllLists();
    checkBasketList();
}

function dragEnterTaskHandler(event) {
    event.preventDefault();
    if (event.currentTarget.classList.contains("taskboard__group--backlog")) {
        targetTaskClass = "";
    } else if (event.currentTarget.classList.contains("taskboard__group--processing")) {
        targetTaskClass = "task--processing";
    } else if (event.currentTarget.classList.contains("taskboard__group--done")) {
        targetTaskClass = "task--done";
    } else if (event.currentTarget.classList.contains("taskboard__group--basket")) {
        targetTaskClass = "task--basket";
    }
}

function addDraggableTaskOption(divTask) {
    divTask.draggable = true;
    divTask.addEventListener('dragstart', dragStartTaskHandler);
    divTask.addEventListener('dragend', dragEndTaskHandler);
}

function addDraggableListOption(divList) {
    divList.addEventListener('dragover', dragOverTaskHandler);
    divList.addEventListener('drop', dragDropTaskHandler);
}

function addDragEnterAreaOption(area) {
    area.addEventListener('dragenter', dragEnterTaskHandler);
}

export {addDraggableTaskOption, addDraggableListOption, addDragEnterAreaOption};

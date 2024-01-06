import {
    addOptionForAllAreas,
    addOptionForAllLists,
    addOptionForAllTasks,
    addTaskEvents,
    applyEmptyTaskToAllLists,
    checkBasketList,
} from "./task-operation.js";

function init() {
    addOptionForAllTasks();
    addOptionForAllLists();
    addOptionForAllAreas();
    applyEmptyTaskToAllLists();
    checkBasketList();
    addTaskEvents();
}

export default init;

import {
    addOptionForAllAreas,
    addOptionForAllLists,
    addOptionForAllTasks,
    addTaskEvents,
    applyEmptyTaskToAllLists,
    checkBasketList,
    prepareHtmlCode,
} from "./task-operation.js";

function init() {
    addOptionForAllTasks();
    addOptionForAllLists();
    addOptionForAllAreas();
    applyEmptyTaskToAllLists();
    checkBasketList();
    addTaskEvents();
    prepareHtmlCode();
}

export default init;

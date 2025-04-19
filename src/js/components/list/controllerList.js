import { DATA, EMIT } from '../../constants.js';
import ListModel from './modelList.js';
import ListView from './viewList.js';

export default function (state) {
   const model = new ListModel(state);
   const view = new ListView(state);

   view.renderData(state.listsTasksData);

   state.emitter.subscribe(EMIT.ADD_LIST, () => {
      model.createListTask(state.listsTasksData);
      state.addListTasks(model.listTasks);
      view.renderListTasks(model.listTasks);
   });

   /* ========= add task ========= */
   document.addEventListener('click', (event) => {
      if (view.isAddTask(event)) {
         model.createTask(state.listsTasksData);
         state.addTask(model.task, view.selectListId);
         view.renderTask(model.task);
      }
   });

   /* ========= edit title of list or text of task ========= */
   document.addEventListener('dblclick', (event) => {
      if (view.checkContentEditable(event)) {
         view.toggleContentEditable(event, true);
         event.target.focus();
      }
   });
   document.addEventListener('input', (event) => {
      const updatedElement = model.getDataElement(event);
      state.updateData(updatedElement);
   });
   document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
         event.target.blur();
         view.toggleContentEditable(event, false);
         model.editebleElementData = null;
      }
   });
   document.addEventListener('blur', (event) => {
      view.toggleContentEditable(event, false);
      model.editebleElementData = null;
   });

   /* ========= drag to sort or remove ========= */
   document.addEventListener('dragstart', (event) => {
      model.getDataDragElement(event);
      state.draggedItem = model.editebleElementData;
      event.dataTransfer.setData('text/html', '');
   });
   document.addEventListener('dragover', (event) => {
      event.preventDefault();

      switch (view.checkDropZone(event)) {
         case DATA.REMOVE_TYPE:
            state.action = DATA.REMOVE_TYPE;
            view.toggleHintRemoveZone(event);
            break;
         case DATA.LIST_TYPE:
            state.action = DATA.LIST_TYPE;
            break;
         default:
            state.action = null;
            break;
      }
   });
   document.addEventListener('drop', (event) => {
      event.preventDefault();
      event.dataTransfer.getData('text/plain');

      /* ========= drop to remove  ========= */
      if (state.action === DATA.REMOVE_TYPE) {
         view.toggleHintRemoveZone(event);
         view.removeElement(state.draggedItem.node);
         state.removeItemFromData(state.draggedItem);
      }
      /* ========= drop to sort  ========= */
      if (state.action === DATA.LIST_TYPE) {
         model.getDataDragElement(event);
         model.toDroppedElementData.type === state.draggedItem.type &&
            model.normalizeDroppedElementData();

         state.dropItem = model.toDroppedElementData;
         view.updateElement(state.draggedItem.node, state.dropItem.node);
         state.updateAfterDrop();
      }
   });
}

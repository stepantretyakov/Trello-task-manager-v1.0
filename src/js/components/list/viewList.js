import { TITLES, CLASSNAMES, IDS, DATA } from '../../constants.js';

class ListView {
   constructor(state) {
      this.app = state.app;
   }
   isAddTask(event) {
      const isAddTask = event.target.hasAttribute(DATA.ADD_TASK);

      if (isAddTask) {
         this.selectListElement = event.target.closest(`[${DATA.LIST_ID}]`);
         this.selectListId = +this.selectListElement.dataset[`${DATA.LIST_TYPE}Id`];
         return true;
      }
   }

   renderData(data) {
      this._renderListsTasksContainer();
      data.length > 0 && this._renderListsTasksData(data);
   }

   _renderListsTasksContainer() {
      const markup = `
         <div id="${IDS.LISTS}" class="${CLASSNAMES.LISTS}"></div>`;
      this.app.insertAdjacentHTML('afterbegin', markup);
      this.listTasksContainer = document.querySelector(`#${IDS.LISTS}`);
   }

   _renderListsTasksData(data) {
      // this._renderListsTasksContainer();
      for (const singleListTasks of data) {
         this.renderListTasks(singleListTasks);
         this.selectListElement = document.querySelector(
            `[${DATA.LIST_ID}="${singleListTasks.id}"]`,
         );
         singleListTasks.list.forEach((task) => this.renderTask(task));
      }
      this.listsTasksCollection = document.querySelectorAll(`[${DATA.LIST_ID}]`);
   }

   /* ========= External ========= */
   renderListTasks(singleListTasks) {
      const makup = `<div class="${CLASSNAMES.LIST}" ${DATA.TYPE}="${DATA.LIST_TYPE}" draggable="true" ${DATA.LIST_ID}="${singleListTasks.id}">
                  <p class="${CLASSNAMES.LIST_HEADER}" contenteditable="false">${singleListTasks.name}</p>
                  <div ${DATA.TYPE}="${DATA.TASKES_CONTAINER}" ${DATA.TASKES_ID}="${singleListTasks.id}" ></div>
                  <p class="${CLASSNAMES.LIST_FOOTER}">
                     <span ${DATA.ADD_TASK}  class="${CLASSNAMES.ACTION_TASK}">${TITLES.ADD_TASK}</span>
                  </p>
               </div>`;
      this.listTasksContainer.insertAdjacentHTML('beforeend', makup);
   }

   renderTask({ text, id }) {
      const markup = ` <div 
      class="${CLASSNAMES.TASK}" 
      draggable='true' 
      ${DATA.TYPE}="${DATA.TASK_TYPE}" 
      ${DATA.TASK_ID}="${id}" contenteditable="false">${text}</div>`;

      this.selectListElement
         .querySelector(`[${DATA.TYPE}="${DATA.TASKES_CONTAINER}"]`)
         .insertAdjacentHTML('afterbegin', markup);
   }

   removeElement(removeItem) {
      removeItem.remove();
   }

   updateElement(draggedElement, dropElement) {
      let dropContainer;
      const selector = `[${DATA.TYPE}="${DATA.TASKES_CONTAINER}"]`;
      if (selector) {
         if (dropElement.closest(selector)) {
            dropContainer = dropElement.closest(selector);
         } else {
            dropContainer = dropElement.querySelector(selector);
         }
         dropContainer.prepend(draggedElement);
      }
   }

   checkContentEditable(event) {
      return event.target.hasAttribute('contenteditable');
   }

   checkDropZone(event) {
      const trash = event.target.closest(`[${DATA.TYPE}="${DATA.REMOVE_TYPE}"]`);
      const sort = event.target.closest(`[${DATA.TYPE}="${DATA.LIST_TYPE}"]`);

      if (trash) return DATA.REMOVE_TYPE;
      if (sort) return DATA.LIST_TYPE;
   }

   toggleHintRemoveZone(event) {
      const trash = event.target.closest(`[${DATA.REMOVE}]`);
      if (trash) {
         if (event.type === 'dragover') trash.classList.add(CLASSNAMES.TRASH_HOVER);
         if (event.type === 'drop') trash.classList.remove(CLASSNAMES.TRASH_HOVER);
      }
   }

   toggleContentEditable(event, value) {
      event.target.contentEditable = value ? true : false;
   }
}
export default ListView;

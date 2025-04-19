import { TITLES, DATA } from '../../constants.js';

class List {
   columnsCounter = 0;
   valideAttributes = [DATA.TASK_TYPE, DATA.LIST_TYPE];
   editebleElementData = null;

   createListTask(listsTasksData) {
      this.listTasks = {
         name: TITLES.LIST_HEADER,
         type: DATA.LIST_TYPE,
         id: this._calcListID(listsTasksData),
         list: [],
      };
   }

   createTask(listsTasksData) {
      this.task = {
         text: TITLES.NEW_TASK,
         type: DATA.TASK_TYPE,
         id: this._calcTaskID(listsTasksData),
      };
   }

   _calcTaskID(listsTasksData) {
      let bufferIDs = [];

      for (const listTasks of listsTasksData) {
         if (listTasks.list.length > 0) {
            for (const item of listTasks.list) bufferIDs.push(item.id);
         } else continue;
      }

      return this._getMaxID(bufferIDs);
   }

   _calcListID(listsTasksData) {
      let bufferIDs = [];
      for (const list of listsTasksData) bufferIDs.push(list.id);

      return this._getMaxID(bufferIDs);
   }

   _getMaxID(array) {
      if (array.length !== 0) {
         let maxID = Math.max(...array);
         return ++maxID;
      } else {
         return 0;
      }
   }

   /* ========= drag to sort or remove ========= */

   getDataDragElement(event) {
      const result = this.getDataElement(event);
      if (result) {
         if (event.type === 'dragstart') this.editebleElementData = result;
         if (event.type === 'drop') this.toDroppedElementData = result;
      }
   }

   getDataElement(event) {
      let data = {};
      let elementType = this._validateIsType(event);

      const valideElement = elementType ? event.target : this._setDefaultTypeElement(event.target); //list
      const valideType = valideElement?.dataset.type;

      if (valideType) {
         if (valideType === DATA.LIST_TYPE) {
            data.id = +valideElement.dataset.listId;
            data.text = valideElement.firstElementChild.innerText;
         }

         if (valideType === DATA.TASK_TYPE) {
            data.id = +valideElement.dataset[`${DATA.TASK_TYPE}Id`];
            data.text = valideElement.innerText;
         }

         data.type = valideType;
         data.node = valideElement;
         return data;
      }
   }

   normalizeDroppedElementData() {
      const defaultElement = this._setDefaultTypeElement(this.toDroppedElementData.node);
      this.toDroppedElementData = {
         id: +defaultElement.dataset.listId,
         text: defaultElement.firstElementChild.innerText,
         type: defaultElement.dataset.type,
         node: defaultElement,
      };
   }

   _setDefaultTypeElement(element) {
      return element.closest(`[${DATA.TYPE}="${DATA.LIST_TYPE}"]`);
   }

   _validateIsType(event) {
      const type = event.target.dataset.type;
      return this.valideAttributes.includes(type) && type;
   }
}

export default List;

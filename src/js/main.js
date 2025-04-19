import { DATA, NAME } from './constants.js';
import EventEmitter from './utils/eventEmitter.js';
import LocalStorage from './utils/localStorage.js';
// import { adder } from './components/adder';
import adder from './components/adder/controllerAdder.js';
import remover from './components/remover/controllerRemover.js';
import list from './components/list/controllerList.js';

const state = {
   app: document.querySelector('#app'),
   emitter: new EventEmitter(),
   localStorage: new LocalStorage(),
   listsTasksData: [],
   draggedItem: {},
   dropItem: {},
   action: null,
   removeItemFromData(item) {
      if (item.type === DATA.LIST_TYPE) {
         this._removeItem(this.listsTasksData, item.id);
      }

      if (item.type === DATA.TASK_TYPE) {
         for (const listTasks of this.listsTasksData) {
            this._removeItem(listTasks.list, item.id);
         }
      }
      this._saveData();
   },
   updateData({ node, ...item }) {
      if (item.type === DATA.TASK_TYPE) {
         for (const listTasks of this.listsTasksData) {
            listTasks.list.forEach((task, index) => {
               if (task.id === item.id) {
                  task = { ...item };
                  listTasks.list.splice(index, 1, task);
               }
            });
         }
      }
      if (item.type === DATA.LIST_TYPE) {
         this.listsTasksData.forEach((listTasks, index) => {
            if (listTasks.id === item.id) {
               listTasks.name = item.text;
               this.listsTasksData.splice(index, 1, listTasks);
            }
         });
      }
      this._saveData();
   },
   updateAfterDrop() {
      this.removeItemFromData(this.draggedItem);
      this.listsTasksData.forEach((listTasks) => {
         if (listTasks.id === this.dropItem.id) {
            const obj = {
               text: this.draggedItem.text,
               id: this.draggedItem.id,
               type: this.draggedItem.type,
            };
            listTasks.list.push(obj);
            this._saveData();
            return;
         }
      });
   },
   loadData() {
      this.listsTasksData = this.localStorage.get(NAME.DB) ?? [];
   },
   addListTasks(listTasks) {
      this.listsTasksData.push(listTasks);
      this._saveData();
   },
   addTask(task, listID) {
      const index = this._findIndex(this.listsTasksData, listID);
      this.listsTasksData[index].list.push(task);
      this._saveData();
   },
   _removeItem(array, id) {
      for (const item of array) {
         if (item.id === id) {
            const index = this._findIndex(array, item.id);
            array.splice(index, 1);
         }
      }
   },
   _saveData() {
      this.localStorage.save('listsTasksData', this.listsTasksData);
   },
   _findIndex(array, id) {
      return array.findIndex((item) => item.id === id);
   },
};

init();

function init() {
   state.loadData();
   remover(state);
   adder(state);
   list(state);
}

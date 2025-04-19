import { EMIT } from '../../constants.js';
import AdderView from './viewAdder.js';

export default function (state) {
   const view = new AdderView(state);

   view.render();

   view.adderButton.addEventListener('click', () => {
      state.emitter.emit(EMIT.ADD_LIST);
   });
}

import { EMIT } from '../../constants.js';
import RemoveView from './viewRemover.js';

export default function (state) {
   const view = new RemoveView(state);

   view.render();
}

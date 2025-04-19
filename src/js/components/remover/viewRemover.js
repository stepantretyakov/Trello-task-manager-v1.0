import { TITLES, CLASSNAMES, IDS, DATA } from '../../constants.js';

class RemoveView {
   constructor(state) {
      this.app = state.app;
   }
 
   render() {
      const markup = `<div ${DATA.REMOVE} id="${IDS.REMOVE}" ${DATA.TYPE}="${DATA.REMOVE_TYPE}"  class="${CLASSNAMES.REMOVER}">
            <span class="${CLASSNAMES.ACTION}">${TITLES.REMOVE}</span>
         </div>`;

      this.app.insertAdjacentHTML('afterbegin', markup);
      this.removeZone = document.querySelector(`#${IDS.REMOVE}`);
   }
}

export default RemoveView;

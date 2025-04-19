import { TITLES, CLASSNAMES, IDS, DATA } from '../../constants.js';

class AdderView {
   constructor(state) {
      this.app = state.app;
   }

   render() {
      const markup = `<div id="${IDS.ADDER}" class="${CLASSNAMES.ADDER}">
				<span ${DATA.ADD_LIST} class="${CLASSNAMES.ACTION}">${TITLES.ADD_LIST}</span>
			</div>`;

      this.app.insertAdjacentHTML('afterbegin', markup);
      this.adderButton = document.querySelector(`#${IDS.ADDER}`);
   }
}

export default AdderView;

import * as model from './model.js';

class MediaQuery {
  addHandlerQuery(handler) {
    //match media
    const desktopView = window.matchMedia('(min-width: 1200px)');
    const extraLarge = window.matchMedia(
      '(min-width: 981px) and (max-width: 1200px)'
    );
    const largeView = window.matchMedia(
      '(min-width: 769px) and (max-width: 980px)'
    );
    const mediumView = window.matchMedia(
      '(min-width: 541px) and (max-width: 768px)'
    );
    const smallView = window.matchMedia(
      '(min-width: 501px) and (max-width: 540px)'
    );
    const smallestView = window.matchMedia(
      '(min-width: 320px) and (max-width: 500px)'
    );

    const mqls = [
      desktopView,
      extraLarge,
      largeView,
      mediumView,
      smallView,
      smallestView,
    ];
    for (let i = 0; i < mqls.length; i++) {
      mqls[i].addEventListener(
        'change',
        function () {
          this.controlQuery(mqls);
          handler();
        }.bind(this),
        false
      );
    }
    this.controlQuery(mqls); // call handler function explicitly at run time
  }

  controlQuery(mqls) {
    if (mqls[0].matches) {
      model.state.slides_per_page = 6;
      model.state.search.resultsPerPage = 5;
    }
    if (mqls[1].matches) {
      model.state.slides_per_page = 5;
      model.state.search.resultsPerPage = 4;
    }
    if (mqls[2].matches) {
      model.state.slides_per_page = 4;
      model.state.search.resultsPerPage = 3;
    }
    if (mqls[3].matches) {
      model.state.slides_per_page = 3;
      model.state.search.resultsPerPage = 2;
    }
    if (mqls[4].matches) {
      model.state.slides_per_page = 2;
      model.state.search.resultsPerPage = 2;
    }

    if (mqls[5].matches) {
      model.state.slides_per_page = 1;
      model.state.search.resultsPerPage = 1;
    }
  }
}

export default new MediaQuery();

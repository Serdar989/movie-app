class PaginationView {
  constructor() {
    this.parentElement = document.querySelector('.pagination');
  }

  addHandlerClick(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  render(dataIn) {
    this.clear();
    if (!dataIn || (Array.isArray(dataIn) && dataIn.length === 0))
      return this.renderError();
    const markup = this.generateMarkup(dataIn);
    this.parentElement.insertAdjacentHTML('beforeend', markup);
  }
  generateMarkup(data) {
    const currPage = data.page;
    const numPages = Math.ceil(data.results.length / data.resultsPerPage);
    if (currPage === 1 && numPages > 1) {
      return `
      
        <button data-goto="${
          currPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
                      <i class="fas fa-angle-right"></i>      

          </button> 
      `;
    }
    if (currPage === numPages && numPages > 1) {
      return `<button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
                       <i class="fas fa-angle-left"></i> 

            <span>Page ${currPage - 1}</span>
          </button>
        `;
    }
    if (currPage < numPages) {
      return `<button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
            <i class="fas fa-angle-left"></i> 
            <span>Page ${currPage - 1}</span>
          </button>
          <button data-goto="${
            currPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
           <i class="fas fa-angle-right"></i>      
          </button> 
        `;
    }
    return '';
  }
  renderError() {
    const markup = `
      <div class="error">
        <div>
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>There is some error. please try again</p>
      </div>`;
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  clear() {
    this.parentElement.innerHTML = '';
  }
}

export default new PaginationView();

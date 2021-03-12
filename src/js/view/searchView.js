import { IMAGE_URL } from '../config.js';

class SearchView {
  constructor(data) {
    this.parentEl = document.querySelector('.search');

    this.searchResult = document.querySelector('.search-results');
    this.parentElement = document.querySelector('.results');
    this.errorMessage = document.getElementById('message-error');
    this.data = data;
    this.parentElementMovie = document.querySelector('.details-box');
    this.pagination = document.querySelector('.pagination');
  }

  addHandlerSearch(handler) {
    this.parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      handler();
    });
  }
  getQuery() {
    const query = this.parentEl.querySelector('.search__field').value;
    this.clearInput();
    return query;
  }

  clearInput() {
    this.parentEl.querySelector('.search__field').value = '';
  }
  renderSpinner() {
    const markup = `
       <div class="spinner">
         <i class="fas fa-spinner fa-spin"></i>
        </div> 
  `;
    this.clear();
    this.clearPagination();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  render(dataIn) {
    if (!dataIn || (Array.isArray(dataIn) && dataIn.length === 0))
      return this.renderError();

    this.data = dataIn;
    document.getElementById('movie').classList.remove('movie-describe');

    this.parentElementMovie.innerHTML = '';

    const markup = this.generateMarkup();
    this.clear();
    this.clearMessage();

    this.parentElement.insertAdjacentHTML('beforeend', markup);
  }

  clear() {
    this.parentElement.innerHTML = '';
  }

  clearLoader() {
    this.searchResult.innerHTML = '';
  }
  clearPagination() {
    this.pagination.innerHTML = '';
  }

  generateMarkup() {
    return this.data
      .map((result) => {
        if (result.posterPath) {
          return `<li class="single-movie">
          <div class="image-container"><img src="${
            IMAGE_URL + result.posterPath
          }" alt="${result.title}" >
          </div>
          <div class="movie-details">
            <div class="title-container">
              <h3>Title: ${result.title}</h3>
            </div>
            <div class="release-date">
              <p>Vote average: ${result.voteAverage}</p>
            </div>            
            <div class="btn-container"><a href="#${
              result.id
            }" class="btn details"  data-movie-id="${
            result.id
          }">More details</a></div>
          </div>
        </li> `;
        }
      })
      .join('');
  }

  clearMessage() {
    this.errorMessage.innerHTML = '';
  }

  renderError() {
    const markup = `
      <div class="error">
        <div>
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>NO MOVIES FOUND FOR YOUR QUERY! PLEASE TRY AGAIN</p>
      </div>`;
    this.clearMessage();
    this.clear();

    this.errorMessage.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage() {
    const markup = `
      <div class="error">
        <div>
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>There is a field that the user must fill in</p>
      </div>`;
    this.clearMessage();
    this.clear();

    this.errorMessage.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new SearchView();

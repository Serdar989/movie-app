import { IMAGE_URL } from '../config.js';

class bookmarksView {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.bookmarks = document.querySelector('.bookmarks');
    this.parentElement = document.querySelector('.bookmarks__list');
    this.parentElementMovie = document.querySelector('.details-box');
    this.bookmarksBtn = document.querySelector('.nav__btn--bookmarks');
  }

  addHandlerBookmarksLoad(handler) {
    window.addEventListener('load', handler);
  }
  addHandlerBookmarkSingl(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.single-movie');
      if (!btn) return;
      const id = btn.dataset.movieId;
      handler(id);
    });
  }

  addHandlerBookmarks(handler) {
    this.parentElementMovie.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const id = btn.dataset.movieId;
      handler(id);
      return false;
    });
  }

  render(dataIn) {
    this.clear();
    if (!dataIn || (Array.isArray(dataIn) && dataIn.length === 0))
      return this.renderError();

    const markup = this.generateMarkup(dataIn);
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this.parentElement.innerHTML = '';
  }

  generateMarkup(bookmarks) {
    return bookmarks
      .map((bookmark) => {
        return `<li class="single-movie slider-list" data-movie-id="${
          bookmark.id
        }">
          <div class="image-container"><img src="${
            IMAGE_URL + bookmark.posterPath
          }" alt="${bookmark.title}" >
          </div>
          <div class="movie-details">
            <div class="title-container">
              <h2>Title: ${bookmark.title}</h2>
            </div>
            <div class="release-date">
              <p>Vote average: ${bookmark.voteAverage}</p>
            </div>            
          
          </div>
        </li> `;
      })
      .join('');
  }

  renderError() {
    const markup = `
      <div class="error">
        <div>
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>There is some error. please try again</p>
      </div>`;
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  toggleBookmarks() {
    const bookmarks = this.bookmarks;
    this.nav.addEventListener('click', function (e) {
      const btn = e.target.closest('.nav__btn--bookmarks');
      if (!btn) return;
      bookmarks.classList.toggle('show-bookmarks');
      btn.classList.toggle('show-bookmarks');
    });
  }
  hideBookmarks() {
    const bookmarks = this.bookmarks;
    const btn = this.bookmarksBtn;

    bookmarks.classList.remove('show-bookmarks');
    btn.classList.remove('show-bookmarks');
  }
}

export default new bookmarksView();

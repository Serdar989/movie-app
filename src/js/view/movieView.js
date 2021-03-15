import { IMAGE_URL } from '../config.js';

class MovieView {
  constructor() {
    this.singleMovie = document.querySelector('#movie');

    this.parentElement = document.querySelector('.results');
    this.parentElementMovie = document.querySelector('.details-box');
    this.popupRating = document.querySelector('.popUp-rating');
    this.ratingForm = document.getElementById('ratingForm');
    this.checkBox = document.querySelectorAll('.rateCheckbox');
    this.checkBtn = document.querySelector('.checkBtn');
    this.voteContainer = document.querySelector('.vote-container');
  }

  addHandlerRender(handler) {
    const singleMovie = this.singleMovie;

    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const id = btn.dataset.movieId;
      singleMovie.scrollIntoView({ behavior: 'smooth', block: 'start' });
      handler(id);
    });
  }
  addHandlerPopup() {
    const popupForm = this.popupRating;

    this.parentElementMovie.addEventListener('click', function (e) {
      const btn = e.target.closest('.rate-icon');
      if (!btn) return;

      popupForm.classList.add('visible-rating');
    });
    this.popupRating.addEventListener('click', function (e) {
      const btn = e.target.closest('.close-form');
      if (!btn) return;

      popupForm.classList.remove('visible-rating');
    });
  }
  addHandlerRate(handler) {
    let checker = this.checkBox;
    const movieElement = this.parentElementMovie;
    const popupForm = this.popupRating;

    this.ratingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let checkedValue = null;
      document.querySelector('.rate').innerHTML = '';
      for (let i = 0; i < checker.length; i++) {
        if (checker[i].checked) {
          checkedValue = checker[i].value;
          const id = movieElement.firstElementChild.dataset.videoId;
          console.log('chceker je ' + checkedValue, checker[i]);
          handler(id, checkedValue);

          popupForm.classList.remove('visible-rating');
          return false;
        }
        checker[i].checked = false;
      }
      return false;
    });
  }
  renderSpinner() {
    const markup = `
       <div class="spinner">
         <i class="fas fa-spinner fa-spin"></i>
        </div> 
  `;
    this.clear();
    this.parentElementMovie.insertAdjacentHTML('afterbegin', markup);
  }
  render(movie, bookmarksID) {
    this.clear();
    const markup = this.generateMarkup(movie, bookmarksID);
    document.getElementById('movie').classList.add('movie-describe');

    this.parentElementMovie.insertAdjacentHTML('afterbegin', markup);
  }
  clear() {
    this.parentElementMovie.innerHTML = '';
  }
  generateMarkup(movie, bookmarksID) {
    return `<div class="movie-details" data-video-id = "${movie.id}">
              <div class="title-container">
                 <h3><span>Movie title:</span> ${movie.title}</h3>
                  <div class="subtitle-description">
                    <p><span>Language:</span>  ${movie.language}</p>
                    <p><span>Release date:</span>${movie.releaseDate}</p>
                  </div>
                  
              </div>
              <div class="image-container"><img src="${
                IMAGE_URL + movie.posterPath
              }" alt="${movie.title}" >
              </div>
              <div class="video-contianer">
                ${
                  movie.key == ''
                    ? `<div class="error">
                        <div>
                          <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p>This movie doesn't have video</p>
                       </div>`
                    : ` <iframe
                      src='https://www.youtube.com/embed/${movie.key}'
                  allowfullscreen=''
                ></iframe>`
                }
              </div>
              <div class="video-description">
              
                <div class="overview-container">
                   <p><span>Movie overview:</span> ${movie.overview}</p>
                 </div>
                 <div class="popularity-container">
                   <p><span>Movie popularity:</span> ${movie.popularity}</p>
                 </div>
                 <div class="vote-container">
                   <p><i class="fas fa-vote-yea"></i><span>Vote average:</span> ${
                     movie.voteAverage
                   }</p>
                  <p><i class="fas fa-vote-yea rate-icon"></i><span class= "my-rate">Your rate:</span><span class="rate">${
                    movie.myRate != undefined ? movie.myRate : ''
                  } </span></p>                   
                 </div>
                 <div class="btn-container">
                    <a href="#" class="btn details movie btn--bookmark" data-movie-id="${
                      movie.id
                    }"
                      > ${
                        bookmarksID.some(function (id) {
                          return id === movie.id;
                        })
                          ? 'Remove bookmark'
                          : 'Add to bookmark'
                      }</a
                    >
                  </div>    
               </div>

             </div>
           </div>`;
  }
}

export default new MovieView();

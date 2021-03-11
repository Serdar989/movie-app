import '../scss/main.scss';
import * as model from './model.js';
import mediaQuery from './mediaQuery.js';
import movieView from './view/movieView';
import searchView from './view/searchView';
import listsView from './view/listView';
import topRatedView from './view/topRatedView';
import paginationView from './view/paginationView';
import bookmarksView from './view/bookmarksView';
import listView from './view/listView';

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    searchView.renderSpinner();
    await model.loadSearchResult(query);

    searchView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  searchView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};
const controlMovie = async function (id) {
  try {
    movieView.renderSpinner();
    await model.loadMovie(id, model.state.search.results);
    movieView.render(model.state.movieTopRated, model.state.bookmarksID);
  } catch (error) {
    console.log(error);
  }
};

const controlLatestMovie = async function () {
  try {
    listView.renderSpinner();
    const data = await model.loadMovieLists();
    listsView.render(
      data,
      model.state.slide_index,
      model.state.slides_per_page
    );
  } catch (error) {
    console.log(error);
  }
};
const controlQueryList = function (mqls) {
  listsView.render(
    model.state.lists,
    model.state.slide_index,
    model.state.slides_per_page
  );
};
const controlSlider = function (n) {
  let slidesNumber = model.state.lists.length;

  model.state.slide_index += n;
  if (model.state.slide_index === slidesNumber + 1) {
    model.state.slide_index = 1;
  } else if (model.state.slide_index === 0) {
    model.state.slide_index = slidesNumber;
  }

  listsView.render(
    model.state.lists,
    model.state.slide_index,
    model.state.slides_per_page
  );
};

const controlSingleMovie = async function (id) {
  try {
    // resultsView.renderSpinner();
    await model.loadMovie(id, model.state.lists);
    movieView.render(model.state.movieTopRated, model.state.bookmarksID);
  } catch (error) {
    console.log(error);
  }
};

const controlTopRated = async function () {
  try {
    topRatedView.renderSpinner();
    const data = await model.loadMovieTopRated();
    topRatedView.render(
      data,
      model.state.topRated_slide_index,
      model.state.slides_per_page
    );
  } catch (error) {
    console.log(error);
  }
};

const controlQueryTopRated = function () {
  topRatedView.render(
    model.state.topRated,
    model.state.topRated_slide_index,
    model.state.slides_per_page
  );
};

const controlSliderTopRated = function (n) {
  let slidesNumber = model.state.topRated.length;

  model.state.topRated_slide_index += n;
  if (model.state.topRated_slide_index === slidesNumber + 1) {
    model.state.topRated_slide_index = 1;
  } else if (model.state.topRated_slide_index === 0) {
    model.state.topRated_slide_index = slidesNumber;
  }
  topRatedView.render(
    model.state.topRated,
    model.state.topRated_slide_index,
    model.state.slides_per_page
  );
};

const controlSingleMovieTopRated = async function (id) {
  try {
    // resultsView.renderSpinner();
    await model.loadMovie(id, model.state.topRated);
    movieView.render(model.state.movieTopRated, model.state.bookmarksID);
  } catch (error) {
    console.log(error);
  }
};

const controlLoadBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = async function (id) {
  try {
    // resultsView.renderSpinner();
    await model.loadMovie(id, model.state.bookmarks);
    movieView.render(model.state.movieTopRated, model.state.bookmarksID);
    bookmarksView.hideBookmarks();
  } catch (error) {
    console.log(error);
  }
};

const controlAddBookmarks = function (id) {
  const movieList = model.state.movieTopRated;
  let bookmarksIDs = model.state.bookmarksID;

  if (movieList.id == id && !bookmarksIDs.includes(movieList.id)) {
    model.addBookmark(movieList);
  } else if (movieList.id == id && bookmarksIDs.includes(movieList.id)) {
    model.deleteBookmark(movieList.id, movieList);
  }
  bookmarksView.render(model.state.bookmarks);

  model.state.bookmarksID.some(function (id) {
    return id === model.state.movieTopRated.id;
  })
    ? (document.querySelector('.btn--bookmark').innerHTML = 'Remove bookmark')
    : (document.querySelector('.btn--bookmark').innerHTML = 'Add to bookmark');
};
const controlRate = function (id, checkBoxValue) {
  model.state.movieTopRated.myRate = checkBoxValue;
  const bookmarkIndex = model.state.bookmarksID.findIndex((el) => el == id);
  if (bookmarkIndex != -1) {
    model.state.bookmarks[bookmarkIndex].myRate = checkBoxValue;
  }
  document
    .querySelector('.rate')
    .insertAdjacentHTML('afterbegin', checkBoxValue);
};

const init = function () {
  bookmarksView.addHandlerBookmarksLoad(controlLoadBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  movieView.addHandlerRender(controlMovie);
  movieView.addHandlerPopup();
  movieView.addHandlerRate(controlRate);

  mediaQuery.addHandlerQuery(controlQueryList);
  listsView.listsRender(controlLatestMovie);
  listsView.addHandlerSlider(controlSlider);
  listsView.addHandlerSingleMovie(controlSingleMovie);

  mediaQuery.addHandlerQuery(controlQueryTopRated);
  topRatedView.listsRender(controlTopRated);
  topRatedView.addHandlerSlider(controlSliderTopRated);
  topRatedView.addHandlerSingleMovie(controlSingleMovieTopRated);

  bookmarksView.addHandlerBookmarkSingl(controlBookmarks);
  bookmarksView.addHandlerBookmarks(controlAddBookmarks);
  bookmarksView.toggleBookmarks();
};
init();

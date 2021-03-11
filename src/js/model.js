import { API_URL, RES_PER_PAGE } from './config.js';

import { getJSON, generateMovieDBUrl } from './helpers.js';

export const state = {
  movie: {},
  movieTopRated: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: 5,
  },
  slides_per_page: 6,
  lists: [],
  slide_index: 1,
  topRated: [],
  topRated_slide_index: 1,
  bookmarks: [],
  bookmarksID: [],
  rate: '',
};

const createMovieObject = function (data, movieDetails) {
  const singleMovie = data.results[0];

  return {
    id: movieDetails.id,
    title: movieDetails.title,
    language: movieDetails.language,
    releaseDate: movieDetails.releaseDate,
    posterPath: movieDetails.posterPath,
    overview: movieDetails.overview,
    popularity: movieDetails.popularity,
    voteAverage: movieDetails.voteAverage,
    key: singleMovie != undefined ? singleMovie.key : '',
    bookmarked: movieDetails.bookmarked,
    myRate: movieDetails.myRate ? movieDetails.myRate : 'N/A',
  };
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const url = generateMovieDBUrl('/search/movie') + '&query=' + query;
    const data = await getJSON(url);
    const movie = data.results;
    state.search.results = movie.map((mov) => {
      return {
        id: mov.id,
        title: mov.title,
        language: mov.original_language,
        releaseDate: mov.release_date,
        posterPath: mov.poster_path,
        overview: mov.overview,
        popularity: mov.popularity,
        voteAverage: mov.vote_average,
        bookmarked: '',
        myRate: '',
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;

  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const loadMovie = async function (id, moviesInfo) {
  try {
    const url = generateMovieDBUrl(`/movie/${id}/videos`);

    const data = await getJSON(url);
    const movieDetails = moviesInfo.find((movieId) => {
      return movieId.id == id;
    });
    state.movieTopRated = createMovieObject(data, movieDetails);
    const bookmarkIndex = state.bookmarksID.findIndex((el) => el == id);

    if (
      bookmarkIndex != -1 &&
      state.bookmarks[bookmarkIndex].myRate != undefined
    ) {
      state.movieTopRated.myRate = state.bookmarks[bookmarkIndex].myRate;
    } else {
      state.movieTopRated.myRate = '';
    }
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

const createMovieListsObject = function (data) {
  const lists = data.results;
  state.lists = lists.map((list) => {
    return {
      id: list.id,
      title: list.title,
      language: list.original_language,
      releaseDate: list.release_date,
      posterPath: list.poster_path,
      overview: list.overview,
      popularity: list.popularity,
      voteAverage: list.vote_average,
      bookmarked: '',
    };
  });
};
export const loadMovieLists = async function () {
  try {
    const url = generateMovieDBUrl(`/movie/now_playing`);

    const data = await getJSON(url);
    createMovieListsObject(data);

    return this.state.lists;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

const createMovieTopRated = function (data) {
  const lists = data.results;
  state.topRated = lists.map((list) => {
    return {
      id: list.id,
      title: list.title,
      language: list.original_language,
      releaseDate: list.release_date,
      posterPath: list.poster_path,
      overview: list.overview,
      popularity: list.popularity,
      voteAverage: list.vote_average,
      bookmarked: '',
    };
  });
};
export const loadMovieTopRated = async function () {
  try {
    const url = generateMovieDBUrl(`/movie/top_rated`);

    const data = await getJSON(url);
    createMovieTopRated(data);

    return this.state.topRated;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const loadBookmarks = function () {
  if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
    state.movie.bookmarked = true;
  } else {
    state.movie.bookmarked = false;
  }
};
const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  localStorage.setItem('bookmarksID', JSON.stringify(state.bookmarksID));
};

export const addBookmark = function (movie) {
  clearBookmarks();
  state.bookmarks.push(movie);
  state.bookmarksID.push(movie.id);

  movie.bookmarked = true;

  persistBookmark();
};

export const deleteBookmark = function (id, movie) {
  const bookmarkIndex = state.bookmarks.findIndex((el) => el.id === id);

  state.bookmarksID.splice(bookmarkIndex, 1);
  state.bookmarks.splice(bookmarkIndex, 1);
  movie.bookmarked = false;

  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  const storageIDs = localStorage.getItem('bookmarksID');

  if (storage) {
    state.bookmarks = JSON.parse(storage);
    state.bookmarksID = JSON.parse(storageIDs);
  }
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
  localStorage.clear('bookmarksID');
};

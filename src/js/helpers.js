import { TIMEOUT_SEC } from './config.js';
import { API_URL, DB_API } from './config.js';

export const generateMovieDBUrl = function (path) {
  const url = `${API_URL}/3${path}?api_key=${DB_API}`;
  return url;
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    return data;
  } catch (err) {
    throw err;
  }
};

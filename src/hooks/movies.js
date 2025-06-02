import { useEffect, useReducer } from "react";
import { infoFetcher } from "./api";

const initialState = {
  casts: [],
  movieInfo: null,
  genres: [],
  isLoading: true,
  reviews: [],
  backDropImages: [],
  posterImages: [],
  similarMovies: [],
  genreNames: null,
  movieTrailers: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH SUCCESS":
      return {
        ...state,
        ...action.payload,
        error: null,
      };

    case "FETCH ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function useMoviesInfo(movieId, movieGenreId) {
    
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchMovieInfos() {
      try {
        const [
          movieInfo,
          movieCasts,
          movieReviews,
          pics,
          trailers,
          similarMovies,
        ] = await Promise.all([
          fetchMovieInfo(movieId),
          fetchMovieCasts(movieId),
          fetchMovieReviews(movieId),
          fetchMoviePictures(movieId),
          fetchMovieTrailers(movieId),
          fetchSimilarMovies(movieGenreId),
        ]);

        dispatch({
          type: "FETCH SUCCESS",
          payload: {
            casts: movieCasts,
            movieInfo: movieInfo,
            genres: movieInfo.genres,
            reviews: movieReviews,
            isLoading:false,
            backDropImages: pics.backdrops,
            posterImages: pics.posters,
            similarMovies: similarMovies,
            genreNames: movieInfo.genres.map((e) => {
              return e.name;
            }),
            movieTrailers: trailers,
          },
        });
      } catch (error) {
        console.error("Error Fetching", error);
      }

    }
    fetchMovieInfos();
  },[]);

  return state;
}


export async function fetchMovieGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list`;
  const genrelist = await infoFetcher(url);

  return genrelist.genres;
}

export async function fetchPopularMovies(pageNo = 1) {
  const url = `https://api.themoviedb.org/3/movie/popular?page=${pageNo}`;
  const popularMovies = await infoFetcher(url);

  return popularMovies.results;
}

export async function fetchNowPlayingMovies(pageNo = 1) {
  const url = `https://api.themoviedb.org/3/movie/now_playing?page=${pageNo}`;
  const trendingMovies = await infoFetcher(url);
  return trendingMovies.results;
}

export async function fetchTopMovies(pageNo = 1) {
  const url = `https://api.themoviedb.org/3/movie/top_rated?page=${pageNo}`;
  const topMovies = await infoFetcher(url);

  return topMovies.results;
}

export async function fetchUpcomingMovies(pageNo = 1) {
  const url = `https://api.themoviedb.org/3/movie/upcoming?page=${pageNo}`;
  const topMovies = await infoFetcher(url);

  return topMovies.results;
}

export async function fetchMovieCasts(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}/credits`;
  const credits = await infoFetcher(url);
  return credits.cast;
}

export async function fetchMovieInfo(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}`;
  const movieInfo = await infoFetcher(url);
  return movieInfo;
}

export async function fetchMovieReviews(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}/reviews`;
  const movieReviews = await infoFetcher(url);
  return movieReviews.results;
}

export async function fetchMoviePictures(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}/images`;
  const movieImages = await infoFetcher(url);
  return movieImages;
}

export async function fetchSimilarMovies(genreId) {
  const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`;
  const movies = await infoFetcher(url);
  return movies.results;
}

export async function fetchMovieTrailers(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}/videos`;
  const movieTrailers = await infoFetcher(url);
  return movieTrailers.results.filter((e) => e.site === "YouTube");
}

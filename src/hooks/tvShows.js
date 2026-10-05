import { useEffect, useReducer } from "react";
import { infoFetcher } from "./api";

const initialState = {
  casts: [],
  tvInfo: null,
  genres: [],
  isLoading: true,
  reviews: [],
  backDropImages: [],
  posterImages: [],
  similarTvs: [],
  genreNames: null,
  tvTrailers: [],
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

export function useTvsInfo(tvId, tvGenreId) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchTvInfos() {
      try {
        const [tvInfo, tvCasts, tvReviews, pics, trailers, similartvs] =
          await Promise.all([
            fetchTvInfo(tvId),
            fetchTvCasts(tvId),
            fetchTvReviews(tvId),
            fetchTvPictures(tvId),
            fetchTvTrailers(tvId),
            fetchSimilarTvs(tvGenreId),
          ]);

        dispatch({
          type: "FETCH SUCCESS",
          payload: {
            casts: tvCasts,
            tvInfo: tvInfo,
            genres: tvInfo.genres,
            reviews: tvReviews,
            isLoading: false,
            backDropImages: pics.backdrops,
            posterImages: pics.posters,
            similarTvs: similartvs,
            genreNames: tvInfo.genres.map((e) => {
              return e.name;
            }),
            tvTrailers: trailers,
          },
        });
      } catch (error) {
        console.error("Error Fetching", error);
      }
    }
    fetchTvInfos();
  }, []);

  return state;
}

export async function fetchOnAirTvs(pageNo = 1) {
  const url = `https://api.themoviedb.org/3/tv/on_the_air?page=${pageNo}`;
  const tvShows = await infoFetcher(url);
  return tvShows.results;
}

export async function fetchPopularTvs(pageNo = 1) {
  const url = `https://api.themoviedb.org/3/tv/popular?page=${pageNo}`;
  const tvShows = await infoFetcher(url);
  return tvShows.results;
}

export async function fetchTopTvs(pageNo = 1) {
  const url = `https://api.themoviedb.org/3/tv/top_rated?page=${pageNo}`;
  const tvShows = await infoFetcher(url);
  return tvShows.results;
}

export async function fetchTvCasts(id) {
  const url = `https://api.themoviedb.org/3/tv/${id}/credits`;
  const credits = await infoFetcher(url);
  return credits.cast;
}

export async function fetchTvInfo(id) {
  const url = `https://api.themoviedb.org/3/tv/${id}`;
  const tvInfo = await infoFetcher(url);
  return tvInfo;
}

export async function fetchTvReviews(id) {
  const url = `https://api.themoviedb.org/3/tv/${id}/reviews`;
  const tvReviews = await infoFetcher(url);
  return tvReviews.results;
}

export async function fetchTvPictures(id) {
  const url = `https://api.themoviedb.org/3/tv/${id}/images`;
  const tvImages = await infoFetcher(url);
  return tvImages;
}

export async function fetchTvsByGenres(
  genreId,
  pageNo = 1,
  sortBy = "popularity.desc",
) {
  const params = new URLSearchParams({
    with_genres: genreId,
    page: pageNo,
    sort_by: sortBy,
  });

  const url = `https://api.themoviedb.org/3/discover/tv?${params.toString()}`;

  const tvShows = await infoFetcher(url);

  return tvShows.results;
}

export async function fetchTvGenres() {
  const url = "https://api.themoviedb.org/3/genre/tv/list";

  const tvGenres = await infoFetcher(url);

  return tvGenres.genres;
}

export async function fetchSimilarTvs(genreId) {
  const url = `https://api.themoviedb.org/3/discover/tv?with_genres=${genreId}&sort_by=popularity.desc`;
  const tvs = await infoFetcher(url);
  return tvs.results;
}

export async function fetchTvTrailers(id) {
  const url = `https://api.themoviedb.org/3/tv/${id}/videos`;
  const tvTrailers = await infoFetcher(url);
  return tvTrailers.results;
  // .filter((e)=> e.site==="YouTube");
}

export async function fetchTvs({
  page = 1,
  sortBy = "popularity.desc",
  genreId = "",
  year = "",
  minRating = "",
} = {}) {
  const params = new URLSearchParams({
    page,
    sort_by: sortBy,
  });

  if (genreId) {
    params.append("with_genres", genreId);
  }

  if (year) {
    params.append("first_air_date_year", year);
  }

  if (minRating) {
    params.append("vote_average.gte", minRating);
  }

  const url = `https://api.themoviedb.org/3/discover/tv?${params.toString()}`;

  const result = await infoFetcher(url);

  return result.results;
}



// tvShows.js

export async function fetchTrendingTvs(pageNo = 1) {
  const url = `https://api.themoviedb.org/3/trending/tv/week?page=${pageNo}`;
  const tvShows = await infoFetcher(url);
  return tvShows.results;
}
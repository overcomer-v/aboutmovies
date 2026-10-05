export const MOVIE_SORT_OPTIONS = [
  {
    label: "Popular",
    value: "popularity.desc",
  },
  {
    label: "Top Rated",
    value: "vote_average.desc",
  },
  {
    label: "Newest",
    value: "primary_release_date.desc",
  },
  {
    label: "Oldest",
    value: "primary_release_date.asc",
  },
  {
    label: "Title A-Z",
    value: "original_title.asc",
  },
  {
    label: "Title Z-A",
    value: "original_title.desc",
  },
];

export const TV_SORT_OPTIONS = [
  {
    label: "Popular",
    value: "popularity.desc",
  },
  {
    label: "Top Rated",
    value: "vote_average.desc",
  },
  {
    label: "Newest",
    value: "first_air_date.desc",
  },
  {
    label: "Oldest",
    value: "first_air_date.asc",
  },
];

export const SEARCH_SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Popular", value: "popularity.desc" },
  { label: "Top Rated", value: "vote_average.desc" },
  { label: "Newest", value: "date.desc" },
  { label: "Oldest", value: "date.asc" },
  { label: "Title A-Z", value: "title.asc" },
  { label: "Title Z-A", value: "title.desc" },
];


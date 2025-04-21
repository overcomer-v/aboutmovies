
const apiKey = "d9ba131618563f5fd325139f52fd4067";

async function infoFetcher(url="") {
  let result;
  let validUrl;

  if(url.includes("?")){
    validUrl = url + `&api_key=${apiKey}`;
  }else{
    validUrl = url + `?api_key=${apiKey}`;
  }
  
  await fetch(validUrl)
    .then((res) => res.json())
    .then((res) => (result = res));

    return result;
}

export async function fetchPopularMovies(){
    const url = "https://api.themoviedb.org/3/movie/popular"
    const popularMovies = await infoFetcher(url);

    return popularMovies.results;
    
}

export async function fetchNowPlayingMovies(){
  const url = "https://api.themoviedb.org/3/movie/now_playing"
  const trendingMovies = await infoFetcher(url);
  return trendingMovies.results;
  
}

export async function fetchTopMovies(){
  const url = "https://api.themoviedb.org/3/movie/top_rated"
  const topMovies = await infoFetcher(url);

  return topMovies.results;
  
}
const apiKey = "d9ba131618563f5fd325139f52fd4067";

export async function infoFetcher(url="") {
  let result;
  let validUrl;

  if(url.includes("?")){
    validUrl = url + `&api_key=${apiKey}`;
  }else{
    validUrl = url + `?api_key=${apiKey}`;
  }
  
  try {
    await fetch(validUrl)
    .then((res) => res.json())
    .then((res) => (result = res));
  } catch (error) {
    console.log(error);
    return error;
    
  }
    return result;
}

export async function fetchSearchQuery(pageNo=1,query){
  const url = `https://api.themoviedb.org/3/search/multi?page=${pageNo}&query=${encodeURIComponent(query)}`
  const result = await infoFetcher(url);
  return result.results;
  
}
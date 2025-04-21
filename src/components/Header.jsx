import { fetchPopularMovies } from "../hooks/loader";

function Header() {
  return (
    <header className="grid grid-cols-[30%_70%] items-center  pt-4 pb-6 sticky top-0 z-50 bg-[rgb(10,10,10)]">
      <div className="brand-name">
        <h2 className="font-bold text-xl" onClick={async ()=>{
          console.log(await fetchPopularMovies());
        }}>Home</h2>
      </div>

     
     <div className="flex items-center justify-between w-ful">
      <div className="search-box flex justify-between bg-neutral-800 py-2 px-4 items-center rounded-2xl w-[80%]">
        <input
        className="bg-transparent border-0"
          type="text"
          placeholder="Search"
        />

        <i className="fa fa-search"></i>

      </div>

      <div className="bg-neutral-800 rounded-2xl flex gap-x-2 items-center py-2 px-6">
        <span>Categories</span>
        <i className="fa fa-arrow-down opacity-70"></i>
      </div>
      </div>
    </header>
  );
}

export default Header;

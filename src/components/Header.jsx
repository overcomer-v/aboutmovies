import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ openNavbar, setMenuOpen }) {
  return (
    <div className="">
      <div className="lg:flex hidden">
        <BigScreenHeader></BigScreenHeader>
      </div>
      <div className="flex lg:hidden">
        <SmallScreenHeader
          isMenuOpen={openNavbar}
          setMenuOpen={setMenuOpen}
        ></SmallScreenHeader>
      </div>
    </div>
  );
}

function BigScreenHeader() {
  const [query, setQuery] = useState([]);
  const navigator = useNavigate();
  return (
    <header className="flex justify-end items-center w-full pt-4 pb-2 sticky top-0 z-50 px-2">
      <div className="search-box w-[40%] h-12 flex items-center">
        <input
          onSubmit={() => {
            navigator(`/result-page?query=${query}`);
          }}
          className="bg-transparent placeholder:text-neutral-600 border-2 border-neutral-300  w-full h-12 px-6 rounded-tl-3xl rounded-bl-3xl"
          type="text"
          placeholder="What are you looking for"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
            onKeyDown={(e)=>{
            if (e.key === "Enter") {
              navigator(`/result-page?query=${query}`);
              
            }
          }}
        />
        <i
          onClick={() => {
            navigator(`/result-page?query=${query}`);
          }}
          className="fa fa-search bg-neutral-300 h-full items-center flex px-4 rounded-tr-xl text-black rounded-br-xl"
        ></i>
      </div>
    </header>
  );
}

function SmallScreenHeader({ openNavbar, setMenuOpen }) {
   const [query, setQuery] = useState([]);
   const [showSearchbar, setShowSearchBar] = useState(false);
  const navigator = useNavigate();
  return (
    <header className="flex-col w-full">
      {" "}
      <div className="flex justify-between w-full pt-6 sticky top-0 z-50 bg-[rgb(10,10,10)] px-2">
        <div>
          <i
            className="fa fa-navicon text-xl"
            onClick={() => {
              if (openNavbar) {
                setMenuOpen(false);
              } else {
                setMenuOpen(true);
              }
            }}
          ></i>
        </div>
        <div className="brand-name flex items-center mb-4 gap-4">
          <i className="fa fa-bullseye text-xl color-default"></i>
          <h2 className="font-semibold text-xl">
            About<span className="font-light opacity-[0.7]">Movies</span>
          </h2>
        </div>
        <div>
          <i className="fa fa-search text-xl" onClick={()=>{setShowSearchBar(!showSearchbar)}}></i>
        </div>
      </div>
       <div className={` transition-all ease-in-out  search-box mx-3 flex mt-4 ${showSearchbar?"h-12" :"h-0"} items-center`}>
        <input
          onSubmit={() => {
            navigator(`/result-page?query=${query}`);
          }}
          className={`bg-transparent placeholder:text-neutral-600 border-2 ${showSearchbar?"border-neutral-300" :"border-transparent"} w-full h-full px-6 rounded-tl-3xl rounded-bl-3xl`}
          type="text"
          placeholder="What are you looking for"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e)=>{ 
            if (e.key === "Enter") {
              navigator(`/result-page?query=${query}`);
              
            }
          }}
        />
        <i
          onClick={() => {
            navigator(`/result-page?query=${query}`);
          }}
          className="fa fa-search bg-neutral-300 h-full items-center flex px-4 rounded-tr-xl text-black rounded-br-xl"
        ></i>
      </div>
    </header>
  );
}

export default Header;

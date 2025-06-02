import { HashRouter, Route, Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import PopularPage from "./pages/Popular";
import UpcomingPage from "./pages/Upcoming";
import TopMoviesPage from "./pages/TopMovies";
import { useState } from "react";
import { AboutMovies } from "./pages/AboutMovies";
import { AboutTvShows } from "./pages/AboutTvShows";
import ResultsPage from "./pages/SearchResultsPage";
import { AboutUs } from "./pages/AboutUs";


function App() {

const [openNavBar, setNavBarOpen] = useState(false);

  return (
    <>
      <HashRouter>
        {" "}
        <div className="grid lg:grid-cols-[220px_1fr] h-screen relative">
          <Navbar openNavBar={openNavBar}  setNavbarOpen={setNavBarOpen}></Navbar>
          <div className="h-screen relative grid justify-start w-full grid-cols-1">
          <Header setMenuOpen={setNavBarOpen} openNavbar={openNavBar}></Header>

             <div className="lg:ml-1 w-full lg:px-4 flex relative flex-col overflow-y-auto">
            <Routes >
              <Route path="/" element={<Home />}></Route>
              <Route path="/trendings" element={<Trending />}></Route>
              <Route path="/popular-page" element={<PopularPage></PopularPage>}> </Route>
              <Route path="/upcoming-page" element={<UpcomingPage/>} ></Route>
              <Route path="/topmovies-page" element={<TopMoviesPage/>} ></Route>
              <Route path="/movie-info" element={<AboutMovies/>}></Route>
              <Route path="/tvshow-info" element={<AboutTvShows/>}></Route>
               <Route path="/result-page" element={<ResultsPage key={location.pathname + location.search}/>}></Route>
               <Route path="/aboutus-page" element={ <AboutUs></AboutUs>}></Route>
            </Routes>
          </div>
          </div>
         
        </div>
        <div>.</div>
      </HashRouter>
    </>
  );
}

export default App;

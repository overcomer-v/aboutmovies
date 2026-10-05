import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/NavBar";

import Home from "./pages/Home";
import Trending from "./pages/Trending";
import PopularPage from "./pages/Popular";
import UpcomingPage from "./pages/Upcoming";
import TopMoviesPage from "./pages/TopMovies";

import { AboutMovies } from "./pages/AboutMovies";
import { AboutTvShows } from "./pages/AboutTvShows";
import ResultsPage from "./pages/SearchResultsPage";
import { AboutUs } from "./pages/AboutUs";
import { GenreOpener } from "./pages/Genres";
import { Explore } from "./pages/Explore";

function App() {
  const [openNavBar, setNavBarOpen] = useState(false);

  return (
    <HashRouter>
      <div className="flex h-dvh w-full overflow-hidden bg-neutral-950 text-white">
        {/* Sidebar / Mobile Drawer */}
        <Navbar openNavBar={openNavBar} setNavbarOpen={setNavBarOpen} />

        {/* Main Application */}
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden gap-2 px-3 md:px-5">
          {/* Header */}
          <Header setMenuOpen={setNavBarOpen} openNavbar={openNavBar} />

          {/* Page Content */}
          <div className="min-h-0 flex-1 overflow-y-auto lg:px-5">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/trendings" element={<Trending />} />

              <Route path="/popular-page" element={<PopularPage />} />

              <Route
                path="/genre-page/:genreId/:genre"
                element={<GenreOpener />}
              />

              <Route path="/upcoming-page" element={<UpcomingPage />} />
              <Route path="/explore" element={<Explore />} />

              <Route path="/topmovies-page" element={<TopMoviesPage />} />

              <Route path="/movie-info" element={<AboutMovies />} />

              <Route path="/tvshow-info" element={<AboutTvShows />} />

              <Route path="/result-page" element={<ResultsPage />} />

              <Route path="/aboutus-page" element={<AboutUs />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;

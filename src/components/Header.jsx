import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ openNavbar, setMenuOpen }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/90 backdrop-blur-xl">
      {/* Desktop */}
      <div className="hidden lg:block">
        <BigScreenHeader />
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <SmallScreenHeader
          openNavbar={openNavbar}
          setMenuOpen={setMenuOpen}
        />
      </div>
    </header>
  );
}

/* -------------------------------- Desktop Header -------------------------------- */

function BigScreenHeader() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/result-page?query=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="flex w-full items-center justify-end px-6 py-4">
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-xl items-center"
      >
        <div className="group flex h-12 w-full overflow-hidden rounded-full border border-white/15 bg-white/5 transition-all duration-300 focus-within:border-white/30 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-black/20">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-full flex-1 bg-transparent px-6 text-sm text-white outline-none placeholder:text-neutral-500"
          />

          <button
            type="submit"
            aria-label="Search"
            className="flex w-14 items-center justify-center bg-white/10 text-neutral-300 transition-all duration-200 hover:bg-white hover:text-black"
          >
            <i className="fa fa-search" />
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------- Mobile Header -------------------------------- */

function SmallScreenHeader({ openNavbar, setMenuOpen }) {
  const [query, setQuery] = useState("");
  const [showSearchbar, setShowSearchBar] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/result-page?query=${encodeURIComponent(trimmedQuery)}`);

    setShowSearchBar(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!openNavbar);
  };

  return (
    <div className="w-full">
      {/* Top navigation */}
      <div className="flex h-16 items-center justify-between px-4">
        {/* Menu button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={openNavbar ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-neutral-300 transition-all hover:bg-white/10 hover:text-white"
        >
          <i className={`fa ${openNavbar ? "fa-times" : "fa-bars"}`} />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg">
            <i className="fa fa-bullseye text-sm" />
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-white">
            About
            <span className="font-light text-neutral-400">Movies</span>
          </h2>
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={() => setShowSearchBar(!showSearchbar)}
          aria-label={showSearchbar ? "Close search" : "Open search"}
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-neutral-300 transition-all hover:bg-white/10 hover:text-white"
        >
          <i className={`fa ${showSearchbar ? "fa-times" : "fa-search"}`} />
        </button>
      </div>

      {/* Mobile search */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showSearchbar
            ? "grid-rows-[1fr] pb-4 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden px-4">
          <form onSubmit={handleSearch}>
            <div className="flex h-12 overflow-hidden rounded-full border border-white/15 bg-white/5 transition-all focus-within:border-white/30 focus-within:bg-white/10">
              <input
                autoFocus={showSearchbar}
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-5 text-sm text-white outline-none placeholder:text-neutral-500"
              />

              <button
                type="submit"
                aria-label="Search"
                className="flex w-14 items-center justify-center bg-white/10 text-neutral-300 transition hover:bg-white hover:text-black"
              >
                <i className="fa fa-search" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Header;
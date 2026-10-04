import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    label: "Home",
    icon: "fa-home",
    id: 0,
    to: "/",
  },
  {
    label: "Upcoming",
    icon: "fa-clock",
    id: 1,
    to: "/upcoming-page",
  },
  {
    label: "Trending",
    icon: "fa-tv",
    id: 2,
    to: "/trendings",
  },
  {
    label: "Popular",
    icon: "fa-video",
    id: 3,
    to: "/popular-page",
  },
  {
    label: "Top Movies",
    icon: "fa-bullseye",
    id: 4,
    to: "/topmovies-page",
  },
];

const SECONDARY_ITEMS = [
  {
    label: "About Us",
    icon: "fa-info-circle",
    id: 5,
    to: "/aboutus-page",
  },
  {
    label: "Contact Us",
    icon: "fa-envelope",
    id: 6,
    to: "/contactus-page",
  },
];

function Navbar({ openNavBar, setNavbarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [pickedOptionsKey, setPickedOptionsKey] = useState(() => {
    const savedKey = sessionStorage.getItem("option-key");
    return savedKey !== null ? Number(savedKey) : 0;
  });

  /* Keep session storage updated */
  useEffect(() => {
    sessionStorage.setItem("option-key", pickedOptionsKey.toString());
  }, [pickedOptionsKey]);

  /* Automatically highlight the current route */
  useEffect(() => {
    const allItems = [...NAV_ITEMS, ...SECONDARY_ITEMS];

    const currentItem = allItems.find((item) => {
      if (item.to === "/") {
        return location.pathname === "/";
      }

      return location.pathname.startsWith(item.to);
    });

    if (currentItem) {
      setPickedOptionsKey(currentItem.id);
    }
  }, [location.pathname]);

  /* Prevent background scrolling when mobile navbar is open */
  useEffect(() => {
    if (openNavBar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openNavBar]);

  const handleNavigation = (item) => {
    setPickedOptionsKey(item.id);
    navigate(item.to);
    setNavbarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setNavbarOpen(false)}
        className={`
          
          fixed inset-0 z-[999]
          bg-black/60 backdrop-blur-sm
          
          transition-all duration-300
          lg:hidden
          ${
            openNavBar
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* Navbar */}
      <aside
        className={`
          border-r
          border-white/10
          fixed left-0 top-0 z-[1000]
          h-dvh
          overflow-scroll
          w-[80%] max-w-[240px]
          lg:relative lg:z-auto
          lg:h-auto lg:w-full
          transition-transform duration-300 ease-out
          ${openNavBar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div
          className="
            flex h-full flex-col
            border-r border-white/10
            bg-neutral-950/95
            px-5 py-6
            shadow-2xl
            backdrop-blur-2xl
            lg:border-r-0
            lg:bg-neutral-950
            lg:shadow-none
          "
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex items-center gap-3"
            >
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  bg-white text-black
                  shadow-lg shadow-black/20
                  transition-transform duration-300
                  group-hover:scale-105
                "
              >
                <i className="fa fa-bullseye text-sm" />
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-white">
                About
                <span className="ml-1 font-light text-neutral-400">Movies</span>
              </h2>
            </button>

            {/* Close button */}
            {/* <button
              type="button"
              onClick={() => setNavbarOpen(false)}
              aria-label="Close navigation"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full
                text-neutral-400
                transition-all
                hover:bg-white/10
                hover:text-white
                lg:hidden
              "
            >
              <i className="fa fa-times" />
            </button> */}
          </div>

          {/* Divider */}
          <div className="mb-5 h-px w-full bg-white/10" />

          {/* Main navigation */}
          <nav className="flex flex-1 flex-col">
            <p className="mb-3 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Discover
            </p>

            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={pickedOptionsKey === item.id}
                  onClick={() => handleNavigation(item)}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="my-6 h-px w-full bg-white/10" />

            <p className="mb-3 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              More
            </p>

            <div className="space-y-1">
              {SECONDARY_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={pickedOptionsKey === item.id}
                  onClick={() => handleNavigation(item)}
                />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <i className="fa fa-film text-xs text-neutral-300" />
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-300">
                    About Movies
                  </p>
                  <p className="text-[0.65rem] text-neutral-500">
                    Discover your next favorite
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* -------------------------------- Nav Item -------------------------------- */

function NavItem({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
  group relative
  flex w-full items-center gap-4
  rounded-2xl
  px-4 py-3.5
  text-left
  transition-all duration-200
  ${
    active
      ? "bg-red-500/10 text-white"
      : "text-neutral-400 hover:bg-white/[0.06] hover:text-white"
  }
`}
    >
      {/* Active indicator */}
      {active && (
        <span
          className="
      absolute left-0
      h-7 w-1
      rounded-r-full
      bg-red-500
      shadow-[0_0_12px_rgba(239,68,68,0.6)]
    "
        />
      )}

      {/* Icon */}
      <span
        className={`
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-xl
          transition-all duration-200
          ${
            active
              ? "bg-black/10 text-black"
              : "bg-white/[0.05] text-neutral-400 group-hover:bg-white/10 group-hover:text-white"
          }
        `}
      >
        <i
          className={`fa ${item.icon} text-sm   ${
            active
              ? "text-white"
              : " text-neutral-400 group-hover:bg-white/10 group-hover:text-white"
          }`}
        />
      </span>

      {/* Label */}
      <span className="text-sm font-medium">{item.label}</span>

      {/* Arrow */}
      <i
        className={`
          fa fa-angle-right
          ml-auto text-xs
          transition-all duration-200
          ${
            active
              ? "translate-x-0 opacity-100"
              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
          }
        `}
      />
    </button>
  );
}

export default Navbar;

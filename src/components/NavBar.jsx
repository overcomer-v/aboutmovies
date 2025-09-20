import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ openNavBar, setNavbarOpen }) {
  const [pickedOptionsKey, setPickedOptionsKey] = useState(() => {
    const lastOptionKey = sessionStorage.getItem("option-key");
    if (lastOptionKey) {
      return parseInt(lastOptionKey);
    } else {
      return 0;
    }
  });

  const navRef = useRef();

  useEffect(() => {
    sessionStorage.setItem("option-key", pickedOptionsKey.toString());
  }, [pickedOptionsKey]);

  useEffect(() => {
    function handleOffsiteClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        e.stopPropagation();
        e.preventDefault();
        setNavbarOpen(false);
      }
    }
   
    if (openNavBar) {
       setTimeout(() => {
      document.addEventListener("click", handleOffsiteClick);
    }, 100);
    }

    return () => {
      document.removeEventListener("click", handleOffsiteClick);
    };
  }, [openNavBar]);

  return (
    <nav
      
      className={` absolute lg:w-full ${
        openNavBar ? " left-[0] right-0" : "-left-[100vw]"
      } h-full z-[1000] flex w-full flex-col lg:fixed m-auto transition-all ease-in-out duration-1000`}
    >

      <div ref={navRef} className="w-3/4 bg-neutral-900 h-full py-6 px-4">

      <div className="flex items-center justify-between mb-4">
        <div className="brand-name flex items-center gap-4">
          <i className="fa fa-bullseye text-xl color-default"></i>
          <h2 className="font-semibold text-xl">
            About<span className="font-light opacity-[0.7]">Movies</span>
          </h2>
        </div>
        <i
          className="fa fa-close"
          onClick={() => {
            setNavbarOpen(false);
          }}
        ></i>
      </div>

      <span className="bg-white w-full h-[0.5px] my-4 opacity-[0.2]"></span>

      <NavOptionsCard
        label={"Home"}
        iconClass={"fa-home"}
        id={0}
        to={"/"}
      ></NavOptionsCard>
      <NavOptionsCard
        label={"Upcoming"}
        iconClass={"fa-clock"}
        id={1}
        to={"/upcoming-page"}
      ></NavOptionsCard>
      <NavOptionsCard
        label={"Trending"}
        iconClass={"fa-tv-alt"}
        id={2}
        to={"/trendings"}
      ></NavOptionsCard>
      <NavOptionsCard
        label={"Popular"}
        iconClass={"fa-video"}
        id={3}
        to={"/popular-page"}
      ></NavOptionsCard>
      <NavOptionsCard
        label={"TopMovies"}
        iconClass={"fa-bullseye"}
        id={4}
        to={"/topmovies-page"}
      ></NavOptionsCard>

      <span className="bg-white w-full h-[0.5px] my-4 opacity-[0.2]"></span>

      <NavOptionsCard
        label={"About Us"}
        iconClass={"fa-bullseye"}
        id={5}
        to={"/aboutus-page"}
      ></NavOptionsCard>

      <NavOptionsCard
        label={"Contact Us"}
        iconClass={"fa-bullseye"}
        id={6}
      ></NavOptionsCard>
      </div>
    </nav>
  );

  function NavOptionsCard({ label, iconClass, id, to }) {
    let bgColor = "bg-transparent";
    if (pickedOptionsKey === id) {
      bgColor = "bg-default";
    }

    const navigate = useNavigate();

    return (
      <div
        key={id}
        onClick={() => {
          setPickedOptionsKey(id);
          navigate(to);
          setNavbarOpen(false);
        }}
        className={`flex gap-7 items-center py-4 px-4 rounded-2xl mb-1 cursor-pointer ${bgColor}`}
      >
        <i className={`fa ${iconClass} w-5 text-[1.05rem]`}></i>
        <h5 className="font-semibold text-[1rem] text-start">{label}</h5>
      </div>
    );
  }
}

export default Navbar;

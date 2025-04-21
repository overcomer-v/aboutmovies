import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Trending from "./pages/Trending";

function App() {
  return (
    <>
      <BrowserRouter>
        {" "}
        <div className="grid grid-cols-[220px_85%] h-screen ">
          <Navbar></Navbar>
          <div className="ml-2 w-full px-4 flex flex-col overflow-y-auto h-[95vh] m-auto">
            <Header></Header>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/trendings" element={<Trending />}></Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

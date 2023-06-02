import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Item from "./Item"
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const NFTID = "aovwi-4maaa-aaaaa-qaagq-cai";
  return (
    <div className="App">
      <Header />
      <Item id = {NFTID}/>
      {/* <img className="bottom-space" src="home-img.png" /> */}
      <Footer />
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Item from "./Item";
import Gallery from "./Gallery";
import "bootstrap/dist/css/bootstrap.min.css";
import Minter from "./Minter";
import { Routes, Route } from "react-router-dom";
import { artflow_backend } from "../../../declarations/artflow_backend";
import CURRENT_USER_ID from "../index";
import NoMatch from "./NoMatch";

function App() {
  // const NFTID = "aovwi-4maaa-aaaaa-qaagq-cai";

  const [userOwnedGallery, setOwnedGallery] = useState();
  const [listingGallery, setListingGallery] = useState();

  async function getNFTs(){
    const userNFTIds = await artflow_backend.getOwnedNFTs(CURRENT_USER_ID);
    //  
    setOwnedGallery(<Gallery title = "My NFT" ids = {userNFTIds} role="collection"/>);

    const listedNFTIds = await artflow_backend.getListedNFTs();
    setListingGallery(<Gallery title = "Discover" ids={listedNFTIds} role="discover"/>)
  }
    useEffect(()=>{
    getNFTs();
  },[])
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route exact path="/" element={<img className="bottom-space" src="home-img.png" />} />
        <Route path="/discover" element={listingGallery} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collection" element={userOwnedGallery} />
        <Route path= "*" element={<NoMatch/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

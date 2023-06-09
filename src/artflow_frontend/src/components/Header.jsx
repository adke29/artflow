import React from "react";
import { Link } from "react-router-dom";
import Gallery from "./Gallery";

function Header() {
  const refresh = () => window.location.reload(true)
  return (

    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src="logo.png" />
          <div className="header-vertical-9"></div>
          <Link to="/">
            <h5 className="Typography-root header-logo-text">ArtFlow</h5>
          </Link>

          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3" onClick={refresh}>
            <Link to="/discover">
              Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/minter">
              Minter
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3" onClick={refresh}>
            <Link to="/collection">
              My NFTs
            </Link>

          </button>
        </div>
      </header>
    </div>


  );
}

export default Header;

import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./components/App";
import { Principal } from "@dfinity/principal";
import { HashRouter  } from "react-router-dom";

const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;

const init = async () => {
  const root = createRoot(document.getElementById('root'));
  root.render(
    <HashRouter >
      <App />
    </HashRouter >

  );
};

init();

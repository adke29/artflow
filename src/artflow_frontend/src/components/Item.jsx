import React, { useEffect, useState } from "react";
// import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { artflow_backend } from "../../../declarations/artflow_backend/";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button,setButton] = useState();
  const [priceInput, setPriceInput] = useState();

  const id = props.id;

  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({ host: localHost });
  agent.fetchRootKey(); // don't forget to delete this line when go live
  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const NFTName = await NFTActor.getName();
    const NFTOwner = await NFTActor.getOwner();

    const NFTRawImage = await NFTActor.getAsset();
    const imageContent = new Uint8Array(NFTRawImage);
    const NFTImage = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));

    setName(NFTName);
    setOwner(NFTOwner.toText());
    setImage(NFTImage);
    setButton(<Button handleClick = {handleSell} text = "Sell"/>)
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell(){
    setPriceInput(<input
      placeholder="Price in ADKE"
      type="number"
      className="price-input"
      value={price}
      onChange={(e)=>price=e.target.value}
    />)
    setButton(<Button handleClick = {sellItem} text="Confirm"/>)
  };
  
  async function sellItem(){
    const listingResult = await artflow_backend.listItem(props.id, Number(price));
    console.log("listing: " + listingResult);
    if(listingResult == "Success"){
      const artflowId = await artflow_backend.getArtflowCanisterId();
      const transferResult = await NFTActor.transferOwnership(artflowId);
      console.log("transfer: " + transferResult);
    }
  }


  return (
    <div className="disGrid-item" >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;

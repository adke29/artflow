import React, { useEffect, useState } from "react";
// import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft";
import {idlFactory as tokenIdlFactory} from "../../../declarations/token_backend";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { artflow_backend } from "../../../declarations/artflow_backend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [shouldDisplay, setDisplay] = useState(true);

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

    if (props.role == "collection") {
      const nftIsListed = await artflow_backend.isListed(props.id);
      if (nftIsListed) {
        setOwner("Artflow");
        setBlur({ filter: "blur(4px)" });
        setSellStatus("Listed");
      } else {
        setButton(<Button handleClick={handleSell} text="Sell" />)
      }
    } else if (props.role == "discover") {
      const originalOwner = await artflow_backend.getOriginalOwner(props.id);
      if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text="Buy" />);
      }

      const price = await artflow_backend.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);

    }
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell() {
    setPriceInput(<input
      placeholder="Price in ADKE"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => price = e.target.value}
    />)
    setButton(<Button handleClick={sellItem} text="Confirm" />)
  };

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false);
    const listingResult = await artflow_backend.listItem(props.id, Number(price));
    console.log("listing: " + listingResult);
    if (listingResult == "Success") {
      const artflowId = await artflow_backend.getArtflowCanisterId();
      const transferResult = await NFTActor.transferOwnership(artflowId);
      console.log("transfer: " + transferResult);
      if (transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("Artflow");
        setSellStatus("Listed");
      } else {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
      }
    }
  }

  async function handleBuy() {
    console.log("buy triggered");
    setLoaderHidden(false);
    const tokenActor = await Actor.createActor(tokenIdlFactory,{
      agent,
      canisterId:Principal.fromText("by6od-j4aaa-aaaaa-qaadq-cai"),
    })
    const sellerId = await artflow_backend.getOriginalOwner(props.id);
    const itemPrice = await artflow_backend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    if(result == "Success"){
      const transferResult = await artflow_backend.completePurchase(props.id,sellerId,CURRENT_USER_ID);
      console.log(transferResult);
      setLoaderHidden(true);
      setDisplay(false);
    }
  }


  return (
    <div style={{display: shouldDisplay ? "inline" : "none"}} className="disGrid-item" >
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image} style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
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

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, useNotification } from "@web3uikit/core";
import { useMoralis } from "react-moralis";
import { ethers, Contract } from "ethers";
import abi from "../constants/abi.json";
import UpdateListing from "./UpdateListing";

export default function NFTBox({
  price,
  tokenId,
  seller,
  nftAddress,
  marketplaceAddress,
}) {
  const [imageURI, setImageURI] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useNotification();
  const { isWeb3Enabled, account } = useMoralis();
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = provider.getSigner();
  const nft = new Contract(nftAddress, abi.BasicNFT, provider);

  async function updateUI() {
    const tokenURI = await nft.tokenURI(tokenId);
    if (tokenURI) {
      const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

      const responseURL = await (await fetch(requestUrl)).json(); //make a request with the url to the ipfs gateway to get the tokenURI object of the nft

      const _imageURI = responseURL.image;
      setTitle(responseURL.name);
      setDescription(responseURL.description);
      setImageURI(_imageURI);
    }
  }

  useEffect(() => {
    updateUI();
  }, [account]);

  const isOwner = account == seller;
  const formatedAddress = isOwner ? "you" : seller;

  const handleNotification = (type, message) => {
    dispatch({
      type,
      message,
      title: "Buy Tx",
      position: "topR",
    });
  };
  const buyNFT = async () => {
    try {
      const marketPlace = new Contract(
        marketplaceAddress,
        abi.NFTMarketPlace,
        signer
      );
      const tx = await marketPlace.buyItem(nftAddress, tokenId, {
        value: price,
      });
      await tx.wait();
      handleNotification("info", "NFT Bought Successfully");
    } catch (e) {
      console.log(e);
      handleNotification("error", e.code);
    }
  };

  const handleCardClick = () => {
    isOwner ? setShowModal(true) : buyNFT();
  };

  const hideModal = () => setShowModal(false);
  return (
    <>
      <UpdateListing
        isVisible={showModal}
        marketplaceAddress={marketplaceAddress}
        nftAddress={nftAddress}
        tokenId={tokenId}
        onClose={hideModal}
      />
      <Card description={description} title={title} onClick={handleCardClick}>
        <div className="p-2">
          <div className="flex flex-col items-end gap-2">
            <div>#{tokenId}</div>
            <div className="italic text-sm">Owned By: {formatedAddress}</div>
            <Image
              src={imageURI}
              width="200"
              height="200"
              loader={() => imageURI}
            />
            <div className="font-bold">
              Price: {ethers.utils.formatEther(price)}ETH
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

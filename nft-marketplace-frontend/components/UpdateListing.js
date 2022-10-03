import { Modal, Input, useNotification } from "@web3uikit/core";
import { ethers, Contract } from "ethers";
import abi from "../constants/abi.json";
import { useState } from "react";

export default function UpdateListing({
  isVisible,
  marketplaceAddress,
  tokenId,
  nftAddress,
  onClose,
}) {
  const [listingPrice, setListingPrice] = useState(0);
  const dispatch = useNotification();

  const handleNotification = (type, message) => {
    dispatch({
      type,
      message,
      title: "Listing tx",
      position: "topR",
    });
  };
  return (
    <Modal
      isVisible={isVisible}
      onOk={async () => {
        const provider = new ethers.providers.Web3Provider(
          web3.currentProvider
        );

        const signer = provider.getSigner();
        console.log(await signer.getAddress());
        const marketPlace = new Contract(
          marketplaceAddress,
          abi.NFTMarketPlace,
          signer
        );
        try {
          const tx = await marketPlace.updateListing(
            nftAddress,
            tokenId,
            ethers.utils.parseEther(listingPrice)
          );
          await tx.wait();
          handleNotification("info", "Listing Updated Successfully")
        } catch (e) {
          console.log(e.code);
          handleNotification("error", e.code)
        }
      }}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
    >
      <Input
        name="New listing price"
        type="number"
        label="Update Listing price in ETH"
        onChange={(e) => {
          setListingPrice(e.target.value);
        }}
      />
    </Modal>
  );
}

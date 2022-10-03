const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const tokenID = 1;

async function cancel() {
  const nftMarketPlace = await ethers.getContract("NftMarketPlace");
  const basicNFT = await ethers.getContract("BasicNFT");

  const cancelTx = await nftMarketPlace.cancelListing(
    basicNFT.address,
    tokenID
  );
  await cancelTx.wait();

  console.log(`Listing with tokenId : ${tokenID} cancelled`);
  if (network.config.url == "http://127.0.0.1:8545") {
    await moveBlocks(2, 1000);
  }
}

cancel()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

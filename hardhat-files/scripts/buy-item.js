const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const tokenID = 0;
const PRICE = ethers.utils.parseEther("0.5");
let nftMarketPlace;
async function buy() {
  const buyer = (await ethers.getSigners())[1];
  nftMarketPlace = await ethers.getContract("NftMarketPlace");
  const basicNFT = await ethers.getContract("BasicNFT");
  const buyerNftMarketPlace = nftMarketPlace.connect(buyer);
  const buyTx = await buyerNftMarketPlace.buyItem(basicNFT.address, tokenID, {
    value: PRICE,
  });
  await buyTx.wait();
  console.log("NFt bought!");

  if (network.config.url == "http://127.0.0.1:8545") {
    await moveBlocks(2, 1000);
  }
}

buy()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

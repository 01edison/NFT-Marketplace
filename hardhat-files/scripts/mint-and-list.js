const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.5");
async function mintAndList() {
  const nftMarketPlace = await ethers.getContract("NftMarketPlace");
  const basicNFT = await ethers.getContract("BasicNFT");

  console.log("Minting Basic NFT....");

  const mintTx = await basicNFT.mintNFT();
  const mintTxReceipt = await mintTx.wait();

  const tokenId = mintTxReceipt.events[0].args.tokenId;

  console.log("Approving NFT movement....");

  const approvalTx = await basicNFT.approve(nftMarketPlace.address, tokenId);
  const approvalTxReceipt = await approvalTx.wait();

  console.log("Listing NFT....");

  const listingTx = await nftMarketPlace.listItem(basicNFT.address, tokenId, PRICE);
  await listingTx.wait();

  console.log("Listed NFT for sale!");
  if (network.config.url == "http://127.0.0.1:8545") {
    await moveBlocks(2, 1000);
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

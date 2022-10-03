const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

async function mint() {
  const basicNFT = await ethers.getContract("BasicNFT");

  console.log("Minting Basic NFT....");

  const mintTx = await basicNFT.mintNFT();
  const mintTxReceipt = await mintTx.wait();

  const tokenId = mintTxReceipt.events[0].args.tokenId;
  console.log(`Got tokenID: ${tokenId}`);
  console.log(`NFT Address: ${basicNFT.address}`);

  if (network.config.url == "http://127.0.0.1:8545") {
    await moveBlocks(2, 1000);
  }
}

mint()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

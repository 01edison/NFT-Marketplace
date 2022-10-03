const { ethers, network } = require("hardhat");
const fs = require("fs");
const FRONT_END_CONTRACT_ADDR_FILE =
  "../nft-marketplace-frontend/constants/contractAddresses.json";

const FRONT_END_ABI_FILE = "../nft-marketplace-frontend/constants/abi.json";

const chainId =
  network.config.url == "http://127.0.0.1:8545"
    ? 31337
    : network.config.chainId;
module.exports = async () => {
  console.log("updating front end...");
  await updateContractAddresses();
  await updateAbi();
};

async function updateAbi() {
  const nftMarketPlace = await ethers.getContract("NftMarketPlace");
  const basicNft = await ethers.getContract("BasicNFT");
  const currentAbi = JSON.parse(
    fs.readFileSync(FRONT_END_ABI_FILE, {
      encoding: "utf8",
    })
  );

  currentAbi.NFTMarketPlace = nftMarketPlace.interface.format(
    ethers.utils.FormatTypes.json
  );
  currentAbi.BasicNFT = basicNft.interface.format(
    ethers.utils.FormatTypes.json
  );

  fs.writeFileSync(FRONT_END_ABI_FILE, JSON.stringify(currentAbi));
}

async function updateContractAddresses() {
  const nftMarketPlace = await ethers.getContract("NftMarketPlace");
  const basicNFT = await ethers.getContract("BasicNFT");
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_CONTRACT_ADDR_FILE, {
      encoding: "utf8",
    })
  );

  if (chainId in currentAddresses) {
    if (
      !currentAddresses[chainId]["NFTMarketPlace"].includes(
        nftMarketPlace.address
      )
    ) {
      currentAddresses[chainId]["NFTMarketPlace"].push(nftMarketPlace.address);
      currentAddresses[chainId]["BasicNFT"].push(basicNFT.address);
    }
  } else {
    currentAddresses[chainId] = {
      NFTMarketPlace: [nftMarketPlace.address],
      BasicNFT: [basicNFT.address],
    };
  }
  fs.writeFileSync(
    FRONT_END_CONTRACT_ADDR_FILE,
    JSON.stringify(currentAddresses)
  );
}

module.exports.tags = ["all", "frontend"];

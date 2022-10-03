const Moralis = require("moralis-v1/node");

require("dotenv").config();

const contractAddresses = require("./constants/contractAddresses.json");

let chainId = 31337;
let moralisChainId = chainId == 31337 ? "1337" : chainId;
const nftContractAddress = contractAddresses[chainId]["NFTMarketPlace"][0];
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.NEXT_PUBLIC_MASTER_KEY;

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log(`Working with contract address ${nftContractAddress}`);

  //all this is in the docs https://v1docs.moralis.io/moralis-dapp/connect-the-sdk/connect-using-node
  let itemListedOptions = {
    chainId: moralisChainId,
    address: nftContractAddress,
    topic: "ItemListed(address, address, uint256, uint256)",
    //abi of the event not the entire contract
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
    tableName: "ItemListed",
  };

  let itemBoughtOptions = {
    chainId: moralisChainId,
    address: nftContractAddress,
    topic: "ItemBought(address, address, uint256, uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
    tableName: "ItemBought",
  };

  let itemCancelledOptions = {
    chainId: moralisChainId,
    address: nftContractAddress,
    topic: "ItemCancelled(address, address, uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCancelled",
      type: "event",
    },
    tableName: "ItemCancelled",
  };

  const listedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemListedOptions,
    { useMasterKey: true }
  );
  const boughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemBoughtOptions,
    { useMasterKey: true }
  );
  const cancelledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemCancelledOptions,
    { useMasterKey: true }
  );

  if (
    listedResponse.success &&
    boughtResponse.success &&
    cancelledResponse.success
  ) {
    console.log("Database updated successfully");
  } else {
    console.log("Something went wrong");
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

const { moveBlocks } = require("../utils/move-blocks");
const { network } = require("hardhat");

async function mineBlocks() {
  if (network.config.url == "http://127.0.0.1:8545") {
    await moveBlocks(2, 1000);
  }
}

mineBlocks()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

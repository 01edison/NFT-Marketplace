const { network } = require("hardhat");

async function sleep(sleepTime) {
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
}

async function moveBlocks(amount, sleepAmount = 0) {
  console.log("moving blocks..");

  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
    if (sleepAmount > 0) {
      console.log("Sleeping...");
      await sleep(sleepAmount);
    }
  }
}

module.exports = { moveBlocks, sleep };

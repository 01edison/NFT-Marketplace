const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log(`deploying Basic NFT to the ${network.name} chain...`);
  const nftMarketPlace = await deploy("BasicNFT", {
    from: deployer,
    log: true,
    args: [],
  });

  log(`deployed Basic NFT to the ${network.name} chain successfully`);

  if (network.config.chainId !== 31337) {
    await verify(nftMarketPlace.address, []);
  }
};

module.exports.tags = ["all", "basicNFT"];

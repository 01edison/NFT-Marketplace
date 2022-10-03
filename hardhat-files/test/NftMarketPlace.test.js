const { expect, assert } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

const chainId = network.config.chainId;

if (chainId != 31337) {
  describe.skip;
} else {
  describe("NFT Market Place", () => {
    let nftMarketPlace, basicNFT, deployer, player;
    const PRICE = ethers.utils.parseEther("0.5");
    const NEW_PRICE = ethers.utils.parseEther("1");
    const TOKEN_ID = 0;
    beforeEach(async () => {
      deployer = (await getNamedAccounts()).deployer;
      player = (await ethers.getSigners())[1];
      await deployments.fixture("all");
      nftMarketPlace = await ethers.getContract("NftMarketPlace", deployer);
      basicNFT = await ethers.getContract("BasicNFT", deployer);
      await basicNFT.mintNFT();
      await basicNFT.approve(nftMarketPlace.address, TOKEN_ID);
    });

    it("lists NFTs and buys it", async () => {
      await nftMarketPlace.listItem(basicNFT.address, TOKEN_ID, PRICE);
      const playerConnectedNFTMarketPlace = nftMarketPlace.connect(player);
      await playerConnectedNFTMarketPlace.buyItem(basicNFT.address, TOKEN_ID, {
        value: PRICE,
      });

      const newOwner = await basicNFT.ownerOf(TOKEN_ID);
      const deployerProceeds = await nftMarketPlace.getProceeds(deployer);
      assert.equal(newOwner, player.address);
      assert.equal(deployerProceeds, PRICE.toString());
    });
    it("reverts when you dont send enough money to buy NFT", async () => {
      await nftMarketPlace.listItem(basicNFT.address, TOKEN_ID, PRICE);
      const playerConnectedNFTMarketPlace = nftMarketPlace.connect(player);
      await expect(
        playerConnectedNFTMarketPlace.buyItem(basicNFT.address, TOKEN_ID)
      ).to.be.reverted;
    });
    it("Allows seller to cancel listing", async () => {
      await nftMarketPlace.listItem(basicNFT.address, TOKEN_ID, PRICE);
      await nftMarketPlace.cancelListing(basicNFT.address, TOKEN_ID);
      assert.equal(
        (await nftMarketPlace.getListing(basicNFT.address, TOKEN_ID)).price,
        "0"
      );
    });
    it("Allows seller to update a listing", async () => {
      await nftMarketPlace.listItem(basicNFT.address, TOKEN_ID, PRICE);
      await nftMarketPlace.updateListing(basicNFT.address, TOKEN_ID, NEW_PRICE);
      assert.equal(
        (
          await nftMarketPlace.getListing(basicNFT.address, TOKEN_ID)
        ).price.toString(),
        ethers.utils.parseEther("1")
      );
    });
    it("Reverts when caller has no proceeds", async () => {
      await nftMarketPlace.listItem(basicNFT.address, TOKEN_ID, PRICE);
      const playerConnectedNFTMarketPlace = nftMarketPlace.connect(player);
      await playerConnectedNFTMarketPlace.buyItem(basicNFT.address, TOKEN_ID, {
        value: PRICE,
      });

      await expect(playerConnectedNFTMarketPlace.withrawProceeds()).to.be
        .reverted;
    });
    it("Allows seller to withdraw proceeds after sale", async () => {
      await nftMarketPlace.listItem(basicNFT.address, TOKEN_ID, PRICE);
      const playerConnectedNFTMarketPlace = nftMarketPlace.connect(player);
      await playerConnectedNFTMarketPlace.buyItem(basicNFT.address, TOKEN_ID, {
        value: PRICE,
      });

      const startingSellerProceeds = await nftMarketPlace.getProceeds(deployer);
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );
      console.log(
        `starting deployer balance: ${ethers.utils.formatEther(
          startingDeployerBalance
        )}`
      );
      assert.equal(startingSellerProceeds.toString(), PRICE.toString());
      const tx = await nftMarketPlace.withrawProceeds();
      const txReceipt = await tx.wait();
      const { gasUsed, effectiveGasPrice } = txReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      console.log(`gas cost: ${ethers.utils.formatEther(gasCost)}`);
      const endingSellerProceeds = await nftMarketPlace.getProceeds(deployer);
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);
      console.log(
        `ending deployer balance: ${ethers.utils.formatEther(
          endingDeployerBalance
        )}`
      );
      assert.equal(endingSellerProceeds.toString(), "0");
      assert.equal(
        endingDeployerBalance.add(gasCost).toString(),
        startingDeployerBalance.add(startingSellerProceeds).toString()
      );
    });
  });
}

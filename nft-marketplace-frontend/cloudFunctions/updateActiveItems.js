Moralis.Cloud.afterSave("ItemListed", async (request) => {
  //request.object is basically that new record or item you want to put into that collection like "ItemListed". so it contains the necessary info, like in this case, address, confirmed, tokenId etc, and the get() method is used to retrieve them
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed tx");

  if (confirmed) {
    logger.info("Item found!");
    const ActiveItem = Moralis.Object.extend("ActiveItem"); // creates a new collection called "Active Item"

    const query = new Moralis.Query(ActiveItem);

    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("seller", request.object.get("seller"));

    const alreadyListed = await query.first();

    if (alreadyListed) {
      //to avoid repititions in the "ActiveItem" collection if a listing is updated

      logger.info(
        `Deleting and resaving listing with address: ${request.object.get(
          "address"
        )} and tokenId : ${request.object.get("tokenId")}`
      );

      await alreadyListed.destroy();
    }
    const activeItem = new ActiveItem(); // creates a new entry into the "ActiveItem" collection
    activeItem.set("marketplaceAddress", request.object.get("address")); // set a column named "marketplaceAddress" to the address of the contract
    activeItem.set("nftAddress", request.object.get("nftAddress")); // set a column named "nftAddress" to the address of the nft
    activeItem.set("price", request.object.get("price")); // set a column named "price" to the price of the nft
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("seller", request.object.get("seller"));

    //ALL THESE PARAMETERS (confirmed, address, tokenId etc.)ABOVE ARE GOTTEN FROM THE ITEM LISTED TABLE IN THE DATABASE

    logger.info(
      `Adding address: ${request.object.get(
        "address"
      )}. TokenId: ${request.object.get("tokenId")}`
    );
    logger.info("Saving...");

    await activeItem.save();
  }
});

Moralis.Cloud.afterSave("ItemCancelled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();

  logger.info(`MarketPLace | Object: ${request.object}`);
  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address")); // query the marketPlaceAddress column
    query.equalTo("nftAddress", request.object.get("nftAddress")); // query the nftAddress column
    query.equalTo("tokenId", request.object.get("tokenId")); //query the tokenId column

    logger.info(`Marketplace | Query : ${query}`);
    const cancelledItem = await query.first(); // get the first item that mathches that query
    logger.info(`Marketplace | CancelledItem: ${cancelledItem}`);
    if (cancelledItem) {
      //if there is an item that matches that query
      logger.info(
        `Deleting.. ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was cancelled`
      );

      await cancelledItem.destroy(); // delete the item
    } else {
      logger.info(
        `No item with address ${request.object.get(
          "address"
        )} and tokenId: ${request.object.get("tokenId")}`
      );
    }
  }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));

    const boughtItem = await query.first();
    if (boughtItem) {
      logger.info("Deleting ... ");
      await boughtItem.destroy();
    } else {
      logger.info(
        `No Bought Item with address ${request.object.get(
          "address"
        )} and tokenId ${request.object.get("tokenId")}`
      );
    }
  }
});

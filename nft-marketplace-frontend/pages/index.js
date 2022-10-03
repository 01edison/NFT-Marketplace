import styles from "../styles/Home.module.css";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";

export default function Home() {
  const { data: activeNFTs, isFetching: fetchingActiveNFTs } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10),
    {
      live: true,
    }
  );

  const { isWeb3Enabled } = useMoralis();
  return (
    <>
      {isWeb3Enabled?<div className="container mx-auto">
        <h1 className="py-4 px-4 font-bold text-2xl">Recent Listing</h1>
        <div className="flex flex-wrap justify-between">
          {fetchingActiveNFTs ? (
            <div>Loading..</div>
          ) : (
            activeNFTs.map((nft) => {
              console.log(nft.attributes);
              const { seller, marketplaceAddress, nftAddress, price, tokenId } =
                nft.attributes;

              return (
                <div>
                  <NFTBox
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    seller={seller}
                    marketplaceAddress={marketplaceAddress}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>: <div>Connect Your wallet</div>}
      
    </>
  );
}

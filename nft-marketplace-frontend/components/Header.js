import React from "react";
import { ConnectButton } from "@web3uikit/web3";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="flex flex-row items-center justify-between p-5 border-b-2">
      <h1 className="px-4 py-4 font-bold text-3xl">NFT Marketplace</h1>
      <div className="flex flex-row items-center justify-around">
        <Link href="/">
          <a className="mr-5">Home</a>
        </Link>
        <Link href="/sell-nft"><a className="mr-5">Sell NFT</a></Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
};

export default Header;

# btc-2-defi
*The UI is quite minimal and all the TXs must be checked in console.*

## AIM
To bridge **BTC** to **ETH** to be used in various DeFi protocols.

### Part - 1

The project created a bridge from BTC to ETH by using the RenJS protocol. A **BTC** *Tx* is made to a generated address which once confirmed popups the wallet for signing the Tx.

![Screenshot 2021-10-28 at 1 39 46 PM](https://user-images.githubusercontent.com/35381035/139272927-c6f7a51a-f269-479a-8b2b-d54a20e480e3.png)

The **$testBTC** are minted upon Tx signing and are available on Kovan @ `0x0A9ADD98C076448CBcFAcf5E457DA12ddbEF4A8f`. This address will be used to add the ERC20 tokens in Metamask.

![Screenshot 2021-10-28 at 1 45 30 PM](https://user-images.githubusercontent.com/35381035/139273383-857056ec-90dd-4c38-9e9d-b5aeaa7f9568.png)

### Part - 2

The minted **$testBTC** will be swapped to Uniswap's Tokens **UNI** for putting them further into any DeFi project. `UniswapV2Router` of Uniswap's protocol V2 was used to swap one ERC20 token with another. The function definition is as follow
```solidity
  function swapExactTokensForTokens(
  
    //amount of tokens we are sending in
    uint256 amountIn,
    //the minimum amount of tokens we want out of the trade
    uint256 amountOutMin,
    //list of token addresses we are going to trade in.  this is necessary to calculate amounts
    address[] calldata path,
    //this is the address we are going to send the output tokens to
    address to,
    //the last time that the trade is valid for
    uint256 deadline
  ) external returns (uint256[] memory amounts);
```

There are 2 *TXs* during the `swap` - one's to approve the smart contract to access the address' tokens and the another one is the swap itself.

![Screenshot 2021-10-28 at 1 49 02 PM](https://user-images.githubusercontent.com/35381035/139281425-9363686f-c0b1-4675-b666-a98a12db621f.png)

The respective **UNI** are @ `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` on Kovan. They must be added using this same address on Metamask.

![Screenshot 2021-10-28 at 8 23 46 PM](https://user-images.githubusercontent.com/35381035/139281615-4570421c-4cb6-4e14-8403-7e58f364146f.png)

## Steps to run

The contract is already deployed on Kovan Test network @ `0x42eC57462E9ABD17F508981E41620d71E3C652F5`.

- Clone the repository.
- Delete `./src/artifacts`
- Run `yarn install` in the root to install dependancies.
- Run `npx hardhat compile` to get the artifacts in the `./src/artifacts` folder.
- Run `yarn start` to start the client server et voilà ! 🎉
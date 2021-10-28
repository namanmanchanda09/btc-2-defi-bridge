import './App.css';
import * as React from "react";
import { ethers } from "ethers";
import RenJS from "@renproject/ren";
import { Bitcoin, Ethereum } from "@renproject/chains";
import abi from './artifacts/contracts/TokenSwap.sol/TokenSwap.json';
const {btcABI} = require('./testBTC.js');
const {uniABI} = require('./uniABI.js');

export default function App() {
  const [currAccount, setCurrentAccount] = React.useState("");
  const [tokenOne, setTokenOne] = React.useState("btc");
  const [tokenTwo, setTokenTwo] = React.useState("uni");
  const [noTokens,setNoTokens] = React.useState(0);
  const testBTCAddress = "0x0A9ADD98C076448CBcFAcf5E457DA12ddbEF4A8f";
  const uniAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const tokenSwapAddress = "0x42eC57462E9ABD17F508981E41620d71E3C652F5";
  const tokenSwapContractABI = abi.abi;

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log(`Make sure you have Metamask!`);
      return;
    } else {
      console.log(`We have the ethereum object`, ethereum);
    }

    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log(`Found an authorised account : ${account}`)
          setCurrentAccount(account)
        } else {
          console.log(`No authorised account found`)
        }
      })
  }

  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Get metamask!')
    }
    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log(`Connected ${accounts[0]}`)
        setCurrentAccount(accounts[0])
      })
      .catch(err => console.log(err));
  }

  const mint = async () => {
    const {ethereum} = window;
    try{
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const ethereumProvider = { provider, signer };

        // const renJS = new RenJS("testnet", { logLevel: "log" });
        const renJS = new RenJS("testnet")

        const lockAndMint = await renJS.lockAndMint({
          asset: "BTC",
          from: Bitcoin(),
          to: Ethereum(ethereumProvider).Account({
              address: address,
          }),
      });
  
      console.log(
          `Deposit ${lockAndMint.params.asset} to ${lockAndMint.gatewayAddress}.`
      );

      lockAndMint.on("deposit", async (deposit) => {
        await deposit
            .confirmed()
            .on("confirmation", (confs, target) =>
                console.log(`Confirmations: ${confs}/${target}`)
            );

        await deposit.signed();
        await deposit
            .mint()
            .on("transactionHash", (txHash) =>
                console.log(`TxHash: ${txHash}`)
            );
        });
      }
    }catch(e){
      console.log(e);
    }
  };

  const swap = async() =>{
    if(tokenOne==='btc' && tokenTwo==='uni'){
      swapBtcToUni();
    }else if(tokenOne==='uni' && tokenTwo==='btc'){
      swapUniToBtc();
    }
  }

  const swapBtcToUni = async()=>{
    const {ethereum} = window;
    try{
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const tokenSwapContract = new ethers.Contract(tokenSwapAddress,tokenSwapContractABI,signer);

        const tokenContract = new ethers.Contract(testBTCAddress,btcABI,signer);

        try{
          const approvalAmount = ethers.utils.parseEther("5000000000000000000");
          const approveTx = await tokenContract.approve(tokenSwapAddress, approvalAmount);
          await approveTx.wait();
          console.log(`smart contract approved from $testBTC`);

          const swapTx = await tokenSwapContract.swap(testBTCAddress, uniAddress, noTokens, 1, currAccount);
          await swapTx.wait();
          console.log(`tokens swapped...`);
        }catch(e){
          console.log(e);
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  const swapUniToBtc = async()=>{
    const {ethereum} = window;
    try{
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenSwapContract = new ethers.Contract(tokenSwapAddress, tokenSwapContractABI,signer);

        const tokenContract = new ethers.Contract(uniAddress, uniABI, signer);

        try{
          const approvalAmount = "1000000000000000000";
          const approveTx = await tokenContract.approve(tokenSwapAddress, approvalAmount);
          await approveTx.wait();
          console.log("Smart contract approved from UNI");

          const tokens = ethers.utils.parseEther(`${noTokens}`);
          const swapTx = await tokenSwapContract.swap(uniAddress, testBTCAddress, tokens, 1, currAccount);
          await swapTx.wait();
          console.log('TOKENS SWAPPED...')
        }catch(e){
          console.log(e);
        }
      }

    }catch(e){
      console.log(e);
    }
  }

  React.useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">BTC-2-ETH bridge 🦄</div>

        <div className="bio">
          This is a website for bridging BTC & ETH. It allows to mint $testBTC on Kovan Testnet; & swap those with $UNI to be used in DeFi. You must be connected to Metamask (Kovan test network) to mint.<hr />

          {
            currAccount ? <h6>Connected to : <span style={{color:"black"}}>{currAccount}</span></h6>: (<button className="streamButton" onClick={connectWallet}>
            Connect Wallet
          </button>)
          }

          {
            currAccount ? (
              <button className="streamButton" onClick={mint} style={{marginRight:"15px"}}>Deposit</button>
            ) : null
          }

          <hr />

          {
            currAccount ? (
              <div>
                <h3>Swap using Uniswap V2</h3>

                <select style={{marginRight:"5px"}} value={tokenOne} onChange={e=>setTokenOne(e.target.value)}>
                  <option value="btc" defaultValue>₿ testBTC</option>
                  <option value="uni">🦄  UNI</option>
                </select>

                to 

                <select style={{marginLeft:"5px"}} value={tokenTwo} onChange={e=>setTokenTwo(e.target.value)}>
                  <option value="uni" defaultValue>🦄  UNI</option>
                  <option value="btc">₿ testBTC</option>
                </select>
                <br /><br />
                <input type="number" placeholder="number of tokens" value={noTokens} onChange={e=>setNoTokens(e.target.value)}/><br />
                <button onClick={swap} className="streamButton">Swap</button>
              </div>
            ) : null
          }

        </div>
      </div>
    </div>
  );
}





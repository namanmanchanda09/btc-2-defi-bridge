const hre = require("hardhat");

async function main() {
  const tokenSwapFactory = await hre.ethers.getContractFactory('TokenSwap');
  const tokenSwap = await tokenSwapFactory.deploy();
  await tokenSwap.deployed();

  console.log(`TokenSwap address : ${tokenSwap.address}`);
}


main()
.then((r)=>process.exit(0))
.catch((err)=>{
    console.log(err);
    process.exit(1);
})



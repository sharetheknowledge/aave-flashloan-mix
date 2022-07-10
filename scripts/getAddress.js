const { getNamedAccounts, ethers } = require("hardhat");
const { getWeth, AMOUNT } = require("../scripts/getWeth");

// aave_lending_pool_v2: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"
const ADDRESS_PROVIDER = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const MINIMUM_FLASHLOAN_WETH_BALANCE = 200000000000000000;
const TRANSFER_AMOUNT = ethers.utils.parseEther("1.1");
const BORROW_AMOUNT = ethers.utils.parseEther("1");

async function main() {
  const { deployer } = await getNamedAccounts();

  //   await getWeth();

  //deploy the flash loan contract
  const addressProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    ADDRESS_PROVIDER,
    deployer
  );
  console.log("getting contract ...");
  const myaddress = await addressProvider.getLendingPool();
  console.log(myaddress);
}

main();

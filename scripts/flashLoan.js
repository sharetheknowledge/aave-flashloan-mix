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

  await getWeth();

  //deploy the flash loan contract
  const TestFlashLoanFactory = await ethers.getContractFactory(
    "TestAaveFlashLoan"
  );
  console.log("Deploying contract ...");
  const testFlashloan = await TestFlashLoanFactory.deploy(ADDRESS_PROVIDER);
  await testFlashloan.deployed();
  console.log(`Deployed contract at ${testFlashloan.address}`);

  //   # We need to fund it if it doesn't have any token to fund!
  //     if weth.balanceOf(flashloan) < MINIMUM_FLASHLOAN_WETH_BALANCE:
  //         print("Funding Flashloan contract with WETH...")
  //         weth.transfer(flashloan, 2000000000000000000, {"from": acct})
  //     print("Executing Flashloan...")
  weth = await ethers.getContractAt("IWETH", WETH_ADDRESS, deployer);

  const wethBalance = await weth.balanceOf(testFlashloan.address);

  console.log(`The contract's WETH balance is ${wethBalance.toString()}`);

  if (wethBalance < MINIMUM_FLASHLOAN_WETH_BALANCE) {
    console.log("Funding Flashloan contract with WETH...");
    await weth.transfer(testFlashloan.address, TRANSFER_AMOUNT);
    const newBalance = await weth.balanceOf(testFlashloan.address);

    console.log(`The new contract's WETH balance is ${newBalance.toString()}`);
  }
  console.log("Executing Flashloan...");

  const tx = await testFlashloan.testFlashLoan(weth.address, BORROW_AMOUNT);

  console.log(`We did it !!! View tx here...${tx}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

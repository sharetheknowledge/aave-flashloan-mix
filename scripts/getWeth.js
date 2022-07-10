const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");
const { getNamedAccounts, ethers } = require("hardhat");
const AMOUNT = ethers.utils.parseEther("3");

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

async function getWeth() {
  const { deployer } = await getNamedAccounts();
  console.log(`Getting contract ...`);
  const weth = await ethers.getContractAt("IWETH", WETH_ADDRESS, deployer);
  console.log(`Got contract. Now depositing ...`);
  const tx = await weth.deposit({ value: AMOUNT });
  await tx.wait(1);
  console.log(`Deposited. Now checking balance ...`);
  const wethBalance = await weth.balanceOf(deployer);
  console.log(`Got ${wethBalance.toString()} WETH`);
}

module.exports = { getWeth, AMOUNT };

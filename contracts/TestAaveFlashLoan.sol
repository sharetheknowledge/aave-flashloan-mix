// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/aave/FlashLoanReceiverBase.sol";

import "hardhat/console.sol";

contract TestAaveFlashLoan is FlashLoanReceiverBase {
    using SafeMath for uint;

    event Log(string message, uint val);

    constructor(ILendingPoolAddressesProvider _addressProvider)
        public
        FlashLoanReceiverBase(_addressProvider)
    {}

    function testFlashLoan(address asset, uint amount) external {
        console.log("Intiating testFlashLoan");

        uint bal = IERC20(asset).balanceOf(address(this));
        require(bal > amount, "bal <= amount");

        console.log("First check done: balance of contract> amount requested");

        address receiver = address(this);

        address[] memory assets = new address[](1);
        assets[0] = asset;

        uint[] memory amounts = new uint[](1);
        amounts[0] = amount;

        // 0 = no debt, 1 = stable, 2 = variable
        // 0 = pay all loaned
        uint[] memory modes = new uint[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);

        bytes memory params = ""; // extra data to pass abi.encode(...)
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(
            receiver,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
        console.log(
            "All parameters have now been fed to LENDING_POOL.flashloan() function"
        );
    }

    function executeOperation(
        address[] calldata assets,
        uint[] calldata amounts,
        uint[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        console.log("Now we are doing executeOpertion() function");
        console.log(
            "Here is the part where we are supposed to do our arbitrage ..."
        );
        // do stuff here (arbitrage, liquidation, etc...)
        // abi.decode(params) to decode params
        for (uint i = 0; i < assets.length; i++) {
            emit Log("borrowed", amounts[i]);
            emit Log("fee", premiums[i]);

            uint amountOwing = amounts[i].add(premiums[i]);
            console.log("Now we just set the amounts that we owe ...");

            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);

            console.log(
                "And now we have given the approval to LENDING_POOL to take this amount back"
            );
        }
        // repay Aave
        return true;
    }
}

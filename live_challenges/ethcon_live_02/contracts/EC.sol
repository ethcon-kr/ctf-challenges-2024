// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {ERC20} from "./ERC20.sol";

contract EC is ERC20 {
    constructor() {
        _mint(msg.sender, 100_000_000 ether);
    }

    function name() public pure override returns (string memory) {
        return "EC";
    }

    function symbol() public pure override returns (string memory) {
        return "EC";
    }
}
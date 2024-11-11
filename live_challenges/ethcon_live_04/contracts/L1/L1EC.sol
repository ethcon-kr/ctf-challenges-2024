// SPDX-License-Identifier: MIT
pragma solidity =0.8.27;

import {ERC20} from "../ERC20.sol";

contract L1EC is ERC20 {
    function name() public pure override returns (string memory) {
        return "EC";
    }

    function symbol() public pure override returns (string memory) {
        return "EC";
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
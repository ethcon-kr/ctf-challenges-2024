// SPDX-License-Identifier: MIT
pragma solidity =0.8.27;

import {ERC20} from "../ERC20.sol";

contract L2EC is ERC20 {
    address public immutable receiver;

    constructor(address receiver_) {
        receiver = receiver_;
    }

    function name() public pure override returns (string memory) {
        return "EC";
    }

    function symbol() public pure override returns (string memory) {
        return "EC";
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == receiver, "Only receiver can mint");
        _mint(to, amount);
    }
}
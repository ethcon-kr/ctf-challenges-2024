// SPDX-License-Identifier: MIT
pragma solidity =0.8.27;

import {IERC20} from "../IERC20.sol";

contract L2Receiver {
    error OnlyL2Messenger();
    address public constant L2_MESSENGER = 0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d;

    function bridge(address to, address token, uint256 amount) external {
        require(msg.sender == L2_MESSENGER, OnlyL2Messenger());

        IERC20(token).mint(to, amount);
    }
}
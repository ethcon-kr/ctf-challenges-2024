// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

import {Vault} from "./Vault.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract Solver {
    error NotSolved();
    error AlreadySolved();
    address public solver;
    address public ec;

    constructor(address ec_) {
        ec = ec_;
    }

    function solve() external {
        require(solver == address(0), AlreadySolved());
        require(IERC20(ec).balanceOf(msg.sender) == 100_000_000 ether, NotSolved());
        solver = msg.sender;
    }
}

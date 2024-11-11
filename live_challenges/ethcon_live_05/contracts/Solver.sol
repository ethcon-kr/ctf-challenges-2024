// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

import {EC} from "./EC.sol";

contract Solver {
    error NotSolved();
    error AlreadySolved();
    address public solver;
    EC public ec;

    constructor(EC ec_) {
        ec = ec_;
    }

    function solve() external {
        require(solver == address(0), AlreadySolved());
        require(ec.balanceOf(msg.sender) == 100_000_000 ether, NotSolved());
        solver = msg.sender;
    }
}

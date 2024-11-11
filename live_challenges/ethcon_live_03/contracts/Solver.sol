// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

import {Casino} from "./Casino.sol";

contract Solver {
    error NotSolved();
    error AlreadySolved();
    address public solver;
    address public casino;

    constructor(address casino_) {
        casino = casino_;
    }

    function solve() external {
        require(solver == address(0), AlreadySolved());
        require(Casino(casino).jackpotWinner() == msg.sender, NotSolved());
        solver = msg.sender;
    }
}

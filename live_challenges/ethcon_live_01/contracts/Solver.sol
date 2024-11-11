// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

import {Point} from "./Point.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract Solver {
    error NotSolved();
    error AlreadySolved();
    address public solver;
    address public point;

    constructor(address point_) {
        point = point_;
    }

    function solve() external {
        require(solver == address(0), AlreadySolved());
        require(Point(point).balanceOf(msg.sender) > 3_000 ether, NotSolved());
        solver = msg.sender;
    }
}

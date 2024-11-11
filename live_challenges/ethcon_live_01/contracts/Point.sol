// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

contract Point {
    error OnlyStaker();
    error InsufficientBalance();

    address public immutable staker;

    mapping(address => uint256) public balanceOf;

    constructor(address staker_) {
        staker = staker_;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == staker, OnlyStaker());
        balanceOf[to] += amount;
    }
}

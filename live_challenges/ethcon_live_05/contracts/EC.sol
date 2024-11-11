// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

contract EC {
    error InsufficientBalance();
    error NotPermitted();
    error OnlyOwner();

    address public immutable owner;
    address public locker;

    mapping(address => uint256) public balanceOf;

    constructor() {
        owner = msg.sender;
    }

    function init(address locker_) external {
        require(msg.sender == owner, OnlyOwner());
        locker = locker_;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == locker || msg.sender == owner, NotPermitted());
        balanceOf[to] += amount;
    }

    function burnFrom(address from, uint256 amount) external {
        require(msg.sender == locker, NotPermitted());
        require(balanceOf[from] >= amount, InsufficientBalance());
        balanceOf[from] -= amount;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

contract EC {
    error OnlyAirdrop();
    error InsufficientBalance();
    error OnlyStaker();
    error OnlyOwner();

    address public immutable owner;
    address public airdrop;
    address public staker;

    mapping(address => uint256) public balanceOf;

    constructor() {
        owner = msg.sender;
    }

    function init(address airdrop_, address staker_) external {
        require(msg.sender == owner, OnlyOwner());
        airdrop = airdrop_;
        staker = staker_;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == airdrop, OnlyAirdrop());
        balanceOf[to] += amount;
    }

    function burnFrom(address from, uint256 amount) external {
        require(msg.sender == staker, OnlyStaker());
        require(balanceOf[from] >= amount, InsufficientBalance());
        balanceOf[from] -= amount;
    }
}

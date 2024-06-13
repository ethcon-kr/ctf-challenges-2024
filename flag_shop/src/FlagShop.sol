// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract FlagShop {
    address private _owner;
    uint256 public password;
    mapping(address user => bool hasFlag) public flag;

    error IncorrectPassword();
    error InsufficientFunds();

    constructor() {
        _owner = msg.sender;
        password = uint256(blockhash(block.number - 1));
    }

    function buyFlag(uint256 password_) external payable {
        if (password != password_) revert IncorrectPassword();
        if (msg.value != 0.1 ether) revert InsufficientFunds();
        password = uint256(blockhash(block.number - 1));
        flag[msg.sender] = true;
    }

    function withdraw() external {
        require(msg.sender == _owner);
        payable(msg.sender).transfer(address(this).balance);
    }
}

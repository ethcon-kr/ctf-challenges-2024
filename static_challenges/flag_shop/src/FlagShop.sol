// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.27;

contract FlagShop {
    uint256 public password;
    mapping(address user => bool hasFlag) public flag;

    error IncorrectPassword();
    error InsufficientFunds();

    constructor() {
        password = uint256(blockhash(block.number - 1));
    }

    function buyFlag(uint256 password_) external payable {
        require(password == password_, IncorrectPassword());
        require(msg.value == 0.000001 ether, InsufficientFunds());
        password = uint256(blockhash(block.number - 1));
        flag[msg.sender] = true;
    }
}

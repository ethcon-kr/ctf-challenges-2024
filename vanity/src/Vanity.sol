// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract Vanity {
    mapping(address user => bool hasFlag) public flag;

    function buyFlag() external {
        require(uint160(msg.sender) & 0xffffffff == 0xffffffff, "invalid sender");
        flag[msg.sender] = true;
    }
}
